this.initialize = function() {

    //Set up the grid map as a 2D array
    this.objectsOnGrid = this.objectsOnGrid;
    for ( var i = 0; i < this.maxX; i++ ) {
        this.objectsOnGrid[ i ] = [];
    }
}

this.validCoord = function( gridCoord ) {
    if ( ( ( gridCoord[ 0 ] < this.minX ) || ( gridCoord[ 0 ] > this.maxX ) ) && ( ( gridCoord[ 1 ] < this.minX ) || ( gridCoord[ 1 ] > this.maxY ) ) ) {
        return false;
    }
    return true;
}

this.isOccupied = function( gridCoord ) {
    if ( this.objectsOnGrid[ gridCoord[ 0 ] ][ gridCoord[ 1 ] ] ){
        return true;
    }
    return false;
}

//Return the object at gridCoord, if any
this.checkCoord = function( gridCoord ) {
    if ( this.validCoord( gridCoord ) && this.isOccupied( gridCoord ) ) {
        return this.objectsOnGrid[ gridCoord[ 0 ] ][ gridCoord[ 1 ] ];
    }
    return null;
}

//Add an object to the grid based on its current coordinate
this.addToGrid = function( object ) {
    var gridCoord = object.currentGridSquare;
    if ( this.validCoord( gridCoord ) && !this.isOccupied( gridCoord ) ) {
        this.objectsOnGrid[ gridCoord[ 0 ] ][ gridCoord[ 1 ] ] = object;
    }
}

//Assign an object a coordinate and add it to the grid
this.addToGridFromCoord = function( object, gridCoord ) {
    if ( this.validCoord( gridCoord ) && !this.isOccupied( gridCoord ) ) {
        this.objectsOnGrid[ gridCoord[ 0 ] ][ gridCoord[ 1 ] ] = object;
        object.currentGridSquare = gridCoord;
    }
}

this.removeFromGrid = function( object ) {
    for ( var i = 0; i < this.maxX; i++ ) {
        for ( var j = 0; j < this.maxY; j++ ) {
            if ( this.objectsOnGrid[ i ][ j ] === object ){
                this.objectsOnGrid[ i ][ j ] = null;
                object.currentGridSquare = null;
                return;
            }
        }
    }
}

this.moveObjectOnGrid = function( srcCoord, destCoord ) {
    this.objectsOnGrid[ destCoord[ 0 ] ][ destCoord[ 1 ] ] = this.objectsOnGrid[ srcCoord[ 0 ] ][ srcCoord[1] ];
    this.objectsOnGrid[ srcCoord[ 0 ] ][ srcCoord[1] ] = null;
}

//@ sourceURL=source/grid.js