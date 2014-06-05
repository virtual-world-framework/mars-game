this.initialize = function() {

    //Set up the grid map as a 2D array
    this.tiles = [];
    for ( var i = 0; i < this.maxX; i++ ) {
        this.tiles[ i ] = [];
        for ( var j = 0; j < this.maxY; j++ ) {
            this.tiles[ i ][ j ] = new GridTile();
        }
    }
}

this.setBoundaryValues = function( boundaryValues ) {
    for ( var i = 0; i < this.maxX; i++ ) {
        for (var j = 0; j < this.maxY; j++) {
            this.tiles[ i ][ j ].energyRequired = boundaryValues[ i ][ j ];
        }
    }
}

this.getTileFromGrid = function( gridCoord ) {
    return this.tiles[ gridCoord[ 0 ] - this.minX ][ gridCoord[ 1 ] - this.minY ];
}

this.getTileFromWorld = function( worldCoord ) {
    var x = ( worldCoord[ 0 ] - this.gridOriginInWorld[ 0 ] ) / this.gridSquareLength;
    var y = ( worldCoord[ 1 ] - this.gridOriginInWorld[ 1 ] ) / this.gridSquareLength;
    return this.tiles[ x ][ y ];
}

this.validCoord = function( gridCoord ) {
    if ( ( ( gridCoord[ 0 ] < this.minX ) || ( gridCoord[ 0 ] > this.maxX ) ) && ( ( gridCoord[ 1 ] < this.minX ) || ( gridCoord[ 1 ] > this.maxY ) ) ) {
        return false;
    }
    return true;
}

//Return the list of objects at gridCoord, if any
this.checkCoord = function( gridCoord ) {
    if ( this.validCoord( gridCoord ) ) {
        return this.getTileFromGrid( gridCoord ).objects;
    }
    return null;
}

//Add an object to the grid based on its current coordinate
this.addToGrid = function( object ) {
    var gridCoord = object.currentGridSquare;
    this.addToGridFromCoord( object, gridCoord );
}

//Assign an object a coordinate and add it to the grid
this.addToGridFromCoord = function( object, gridCoord ) {
    if ( this.validCoord( gridCoord ) ) {
        this.getTileFromGrid( gridCoord ).addToTile( object );
        object.currentGridSquare = gridCoord;
    }
}

//Add an object to the grid based on its current world position
this.addToGridFromWorld = function( object ) {
    var gridCoord = this.getTileFromWorld( object.translation );
    if ( this.validCoord( gridCoord ) ) {
        this.addToGridFromCoord( gridCoord );
    }
}

this.removeFromGrid = function( object, gridCoord ) {
    var objects = this.getTileFromGrid( gridCoord ).objects;
    var index = objects.indexOf( object )
    if ( index > -1) {
        return objects.splice( index, 1 )[ 0 ];
    }
    return null;
}

this.moveObjectOnGrid = function( object, srcCoord, destCoord ) {
    var removed = this.removeFromGrid( object, srcCoord );
    if ( removed ) {
        this.getTileFromGrid( destCoord ).addToTile( removed );
    }
}

function GridTile() {
    this.energyRequired = 0;
    this.objects = [];

    this.addToTile = function( object ) {
        this.objects.push( object );
    }

    this.hasInventoriable = function() {
        for ( var i = 0; i < this.objects.length; i++ ) {
            if ( this.objects[ i ].isInventoriable ) { 
                return true;
            }
        }
        return false;
    }
}
//@ sourceURL=source/grid.js