var x = 0;
var y = 1;

this.initialize = function() {

    //Set up the grid map as a 2D array
    this.gridMap = this.gridMap;
    for ( var i = 0; i < this.maxX; i++ ) {
        this.gridMap[ i ] = [];
    }
}

this.validCoord = function( gridCoord ) {
    if ( ( ( gridCoord[ x ] < this.minX ) || ( gridCoord[ x ] > this.maxX ) ) && ( ( gridCoord[ y ] < this.minX ) || ( gridCoord[ y ] > this.maxY ) ) ) {
        return false;
    }
    return true;
}

this.isOccupied = function( gridCoord ) {
    if ( this.gridMap[ gridCoord[ x ] ][ gridCoord[ y ] ] ){
        return true;
    }
    return false;
}

//Add an object to the grid based on its current coordinate
this.addToGrid = function( object ) {
    var gridCoord = object.currentGridSquare;
    if ( this.validCoord( gridCoord ) && !this.isOccupied( gridCoord ) ) {
        this.gridMap[ gridCoord[ x ] ][ gridCoord[ y ] ] = object;
    }
}

//Assign an object a coordinate and add it to the grid
this.addToGridFromCoord = function( object, gridCoord ) {
    if ( this.validCoord( gridCoord ) && !this.isOccupied( gridCoord ) ) {
        this.gridMap[ gridCoord[ x ] ][ gridCoord[ y ] ] = object;
        object.currentGridSquare = gridCoord;
    }
}

this.removeFromGrid = function( object ) {
    for ( var i = 0; i < this.maxX; i++ ) {
        for ( var j = 0; j < this.maxY; j++ ) {
            if ( this.gridMap[ i ][ j ] === object ){
                this.gridMap[ i ][ j ] = null;
                object.currentGridSquare = null;
                return;
            }
        }
    }
}

this.checkCoord = function( gridCoord ) {
    if ( this.validCoord( gridCoord ) && this.isOccupied( gridCoord ) ) {
        return this.gridMap[ gridCoord[ x ] ][ gridCoord[ y ] ];
    }
    return null;
}


//@ sourceURL=source/grid.js