var gridMap;
var x = 0;
var y = 1;

this.initialize = function() {

    //Set up the grid map as a 2D array
    gridMap = this.gridMap;
    for ( var i = 0; i < this.maxX; i++ ) {
        gridMap[ i ] = [];
    }
}

this.validCoord = function( gridCoord ) {
    if ( ( ( gridCoord[ x ] < 0 ) || ( gridCoord[ x ] > this.maxX ) ) && ( ( gridCoord[ y ] < 0 ) || ( gridCoord[ y ] > this.maxY ) ) ) {
        return false;
    }
    return true;
}

this.isOccupied = function( gridCoord ) {
    if ( gridMap[ gridCoord [ x ] ][ gridCoord [ y ] ] == null ){
        return false;
    }
    return true;
}

//Add an object to the grid based on a given coordinate
this.addToGrid = function( object ) {
    var gridCoord = object.currentGridSquare;
    if ( this.validCoord( gridCoord ) && !this.isOccupied( gridCoord ) ) {
        gridMap[ gridCoord[ x ] ][ gridCoord[ y ] ] = object;
    }
}

//Add an object to the grid based on a given position
// this.addToGrid = function( object, position ) {
//     var x = Math.floor( position.x / 3 );
//     var y = Math.floor( position.y / 3 );
//     var gridCoord = { x, y };
//     this.addToGrid( object, gridCoord );
// }

this.removeFromGrid = function( object ) {
    for ( var i = 0; i < this.maxX; i++ ) {
        for ( var j = 0; j < this.maxY; j++ ) {
            if ( gridMap[ i ][ j ] === object ){
                gridMap[ i ][ j ] = null;
                object.currentGridSquare = null;
            }
        }
    }
}

this.checkCoord = function( gridCoord ) {
    if ( this.validCoord( gridCoord ) && this.isOccupied( gridCoord ) ) {
        return gridMap[ gridCoord[ x ] ][ gridCoord[ y ] ];
    }
    return null;
}

//@ sourceURL=source/grid.js