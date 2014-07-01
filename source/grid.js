this.initialize = function() {

    //Set up the grid map as a 2D array
    this.tiles = [];
    for ( var i = 0; i < this.maxX - this.minX; i++ ) {
        this.tiles[ i ] = [];
        for ( var j = 0; j < this.maxY - this.minY; j++ ) {
            this.tiles[ i ][ j ] = new GridTile();
        }
    }
    this.future( 0 ).setBoundaryValues();
}

this.setBoundaryValues = function() {

    if ( this.boundaryValues ) {

        for ( var i = 0; i < this.maxX - this.minX; i++ ) {

            if ( this.boundaryValues[i] ) {

                for (var j = 0; j < this.maxY - this.minY; j++) {
                        this.tiles[ i ][ j ].energyRequired = this.boundaryValues[ i ][ j ];
                }
            }
        }
    }
}

this.clearGrid = function() {
    for ( var i = 0; i < this.maxX - this.minX; i++ ) {
        for ( var j = 0; j < this.maxY - this.minY; j++ ) {
            this.tiles[ i ][ j ].objects = [];
        }
    }
}

this.getTileFromGrid = function( gridCoord ) {
    return this.tiles[ gridCoord[ 0 ] - this.minX ][ gridCoord[ 1 ] - this.minY ];
}

this.getTileFromWorld = function( worldCoord ) {
    var x = ( worldCoord[ 0 ] - this.gridOriginInSpace[ 0 ] ) / this.gridSquareLength;
    var y = ( worldCoord[ 1 ] - this.gridOriginInSpace[ 1 ] ) / this.gridSquareLength;
    return this.tiles[ x ][ y ];
}

this.getWorldFromGrid = function( gridCoord ) {
    var x = gridCoord[ 0 ] * this.gridSquareLength + this.gridOriginInSpace[ 0 ];
    var y = gridCoord[ 1 ] * this.gridSquareLength + this.gridOriginInSpace[ 1 ];
    return [ x, y, 0 ];
}

this.validCoord = function( gridCoord ) {
    if ( ( gridCoord[ 0 ] < this.minX ) || ( gridCoord[ 0 ] > this.maxX ) || ( gridCoord[ 1 ] < this.minY ) || ( gridCoord[ 1 ] > this.maxY ) ) {
        this.logger.errorx( "validCoord",
                            "The gridCoord given is not a valid " +
                            "coordinate in the current grid system." );
        return false;
    }
    return true;
}

//Return the list of objects at gridCoord, if any
this.getObjectsAtCoord = function( gridCoord ) {
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
        object.translation = this.getWorldFromGrid( gridCoord );
        this.setHeightFromTerrain( object );
        object.addedToGrid( this );
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
    if ( index !== -1 ) {
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

//Places the object on the terrain according to the terrain height
this.setHeightFromTerrain = function ( object ) {
    var scene = this.find( "/" )[ 0 ];
    var origin = [ object.translation[ 0 ], object.translation[ 1 ], object.translation[ 2 ] + 3 ];
    var terrain = this.find( "//" + object.terrainName )[ 0 ];
    if ( scene && origin && terrain ) {
        var intersects = scene.raycast( origin, [ 0, 0, -1 ], 0, Infinity, true, terrain.id );
        var terrainHeight = intersects.length > 0 ? intersects[ 0 ].point.z : object.translation[ 2 ];
        var translation = [ origin[ 0 ], origin[ 1 ], terrainHeight ];
        object.translation = translation;
    }
}

//Returns the first instance of an inventoriable object on the specified grid tile
this.getInventoriables = function( gridCoord ) {
    var inventoriables = [];
    if ( this.validCoord( gridCoord ) ) {    
        var list = this.getObjectsAtCoord( gridCoord );
        for ( var i = 0; i < list.length; i++ ) {
            if ( list[ i ].isInventoriable ) {
                inventoriables.push( list[i] );
            }
        }
    }
    return inventoriables;
}

//Returns the first instance of a collidable object on the specified grid tile
this.getCollidables = function( gridCoord ) {
    var collidables = [];
    if ( this.validCoord( gridCoord ) ) {
        var list = this.getObjectsAtCoord( gridCoord );
        for ( var i = 0; i < list.length; i++ ) {
            if ( list[ i ].isCollidable ) {
                collidables.push( list[ i ] );
            }
        }
    }
    return collidables;
}

this.getEnergy = function ( gridCoord ) {
    if ( this.validCoord( gridCoord ) ) {
        return this.getTileFromGrid( gridCoord ).energyRequired;
    }
    return null;
}

function GridTile() {
    this.energyRequired = 0;
    this.objects = [];

    this.addToTile = function( object ) {
        this.objects.push( object );
    }
}
//@ sourceURL=source/grid.js