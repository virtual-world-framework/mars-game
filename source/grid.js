// Copyright 2014 Lockheed Martin Corporation
//
// Licensed under the Apache License, Version 2.0 (the "License"); you may 
// not use this file except in compliance with the License. You may obtain 
// a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software 
// distributed under the License is distributed on an "AS IS" BASIS, 
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and 
// limitations under the License.

// TODO: Accept coordinates as individual numbers instead of
//         arrays so that we don't have to keep track of and
//         reuse unnecessary arrays.

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
            this.tiles[ i ][ j ].objects.length = 0;
        }
    }
}

this.getTileFromGrid = function( gridCoord ) {
    var x, y, tile;
    x = gridCoord[ 0 ];
    y = gridCoord[ 1 ];
    tile = this.tiles[ x ] && this.tiles[ x ][ y ] ? this.tiles[ x ][ y ] : null;
    return tile;
}

this.getTileFromWorld = function( worldCoord ) {
    var x, y, tile;
    x = Math.round( ( worldCoord[ 0 ] - this.gridOriginInSpace[ 0 ] ) / this.gridSquareLength );
    y = Math.round( ( worldCoord[ 1 ] - this.gridOriginInSpace[ 1 ] ) / this.gridSquareLength );
    tile = this.tiles[ x ] && this.tiles[ x ][ y ] ? this.tiles[ x ][ y ] : null;
    return tile;
}

this.getGridFromWorld = function( worldCoord, gridVec ) {
    var x = Math.round( ( worldCoord[ 0 ] - this.gridOriginInSpace[ 0 ] ) / this.gridSquareLength );
    var y = Math.round( ( worldCoord[ 1 ] - this.gridOriginInSpace[ 1 ] ) / this.gridSquareLength );
    if ( gridVec && gridVec instanceof Array ) {
        gridVec.length = 0;
        gridVec.push( x );
        gridVec.push( y );
    } else {
        gridVec = [ x, y ];
    }
    return gridVec;
}

this.getWorldFromGrid = function( x, y, worldVec ) {
    x = x * this.gridSquareLength + this.gridOriginInSpace[ 0 ];
    y = y * this.gridSquareLength + this.gridOriginInSpace[ 1 ];
    if ( worldVec && worldVec instanceof Array ) {
        worldVec.length = 0;
        worldVec.push( x );
        worldVec.push( y );
        worldVec.push( 0 );
    } else {
        worldVec = [ x, y, 0 ];
    }
    return worldVec;
}

this.validCoord = function( gridCoord ) {
    if ( ( gridCoord[ 0 ] < this.minX ) || 
         ( gridCoord[ 0 ] > this.maxX ) || 
         ( gridCoord[ 1 ] < this.minY ) || 
         ( gridCoord[ 1 ] > this.maxY ) ) {
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
        var newTranslation = this.getWorldFromGrid( gridCoord[ 0 ], gridCoord[ 1 ] );
        if ( object.placeOnTerrain ) {
            object.placeOnTerrain( newTranslation );
        } else {
            object.translation = newTranslation;
            this.setHeightFromTerrain( object );
        }
        object.addedToGrid( this );
    }
}

//Add an object to the grid based on its current world position
this.addToGridFromWorld = function( object, worldCoord ) {
    worldCoord = worldCoord || object.translation;
    var gridCoord = this.getGridFromWorld( worldCoord );
    if ( this.validCoord( gridCoord ) ) {
        this.addToGridFromCoord( object, gridCoord );
    }
}

this.removeFromGrid = function( object, gridCoord ) {
    var objects = this.getTileFromGrid( gridCoord ).objects;
    var index = objects.indexOf( object );
    if ( index !== -1 ) {
        var object = objects[ index ];
        for ( var i = index; i < objects.length - 1; i++ ) {
            objects[ i ] = objects[ i ] + 1;
        }
        objects.length--;
        return object;
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
    var origin = [ object.translation[ 0 ], object.translation[ 1 ], object.translation[ 2 ] + 15 ];
    var terrain = this.find( "//" + object.terrainName )[ 0 ];
    if ( scene && origin && terrain ) {
        var intersects = scene.raycast( origin, [ 0, 0, -1 ], 0, Infinity, true, terrain.id );
        var terrainHeight = intersects.length > 0 ? intersects[ 0 ].point.z : object.translation[ 2 ];
        object.translation = [ origin[ 0 ], origin[ 1 ], terrainHeight ];
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