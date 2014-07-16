this.initialize = function() {
    this.updateGrid();
}
this.updateGrid = function( object ) {
    var gridSize, collisionMap, scene;
    if ( object ) {
        gridSize = object.gridSize;
        collisionMap = object.collisionMap;
        scene = this.find( "/" )[ 0 ];
        this.gridOriginInSpace = scene.grid.getWorldFromGrid( object.currentGridSquare );
    }
    this.boundaryValues = [];
    if ( gridSize && gridSize.length === 2 ) {
        this.maxX = gridSize[ 0 ];
        this.maxY = gridSize[ 1 ];
    }
    for ( var x = 0; x < this.maxX - this.minX; x++ ) {
        this.boundaryValues.push( new Array() );
        for ( var y = 0; y < this.maxY - this.minY; y++ ) {
            if ( collisionMap && collisionMap[ x ] && collisionMap[ x ][ y ] ) {
                this.boundaryValues[ x ].push( collisionMap[ x ][ y ] );
            } else {
                this.boundaryValues[ x ].push( 0 );
            }
        }
    }
    this.gridUpdated();
}
this.moveGridOrigin = function( coord ) {
    var scene = this.find( "/" )[ 0 ];
    var worldGrid = scene.grid.getWorldFromGrid( coord );
    var lastOrigin = this.gridOriginInSpace;
    this.gridOriginInSpace = [ worldGrid[ 0 ], worldGrid[ 1 ] ];
    this.gridMoved( lastOrigin );
}