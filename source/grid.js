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
    if ( this.uri ) {
        return;
    }
    //Set up the grid map as a 2D array
    var tiles = new Array( this.maxX - this.minX );
    for ( var i = 0; i < tiles.length; i++ ) {
        tiles[ i ] = new Array( this.maxY - this.minY );
        for ( var j = 0; j < tiles[ i ].length; j++ ) {
            tiles[ i ][ j ] = this.createTile();
        }
    }
    this.tiles = tiles;
    this.future( 0 ).setBoundaryValues();
}

this.setBoundaryValues = function() {
    var boundaryValues = this.boundaryValues;
    var tiles = this.tiles;
    if ( boundaryValues ) {
        for ( var i = 0; i < this.maxX - this.minX; i++ ) {
            if ( boundaryValues[i] ) {
                for (var j = 0; j < this.maxY - this.minY; j++) {
                        tiles[ i ][ j ].energyRequired = boundaryValues[ i ][ j ];
                }
            }
        }
    }
}

this.clearGrid = function() {
    var tiles = this.tiles;
    for ( var i = 0; i < tiles.length; i++ ) {
        for ( var j = 0; j < tiles[ i ].length; j++ ) {
            tiles[ i ][ j ].objects.length = 0;
        }
    }
}

this.getTileFromGrid = function( gridCoord ) {
    var x, y, tile;
    x = gridCoord[ 0 ];
    y = gridCoord[ 1 ];
    var tiles = this.tiles;
    tile = tiles[ x ] && tiles[ x ][ y ] ? tiles[ x ][ y ] : null;
    return tile;
}

this.getTileFromWorld = function( worldCoord ) {
    var x, y, tile;
    x = Math.round( ( worldCoord[ 0 ] - this.gridOriginInSpace[ 0 ] ) / this.gridSquareLength );
    y = Math.round( ( worldCoord[ 1 ] - this.gridOriginInSpace[ 1 ] ) / this.gridSquareLength );
    var tiles = this.tiles;
    tile = tiles[ x ] && tiles[ x ][ y ] ? tiles[ x ][ y ] : null;
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
    if ( ( gridCoord[ 0 ] < 0 ) || 
         ( gridCoord[ 0 ] >= this.maxX - this.minX ) || 
         ( gridCoord[ 1 ] < 0 ) || 
         ( gridCoord[ 1 ] >= this.maxY - this.minY ) ) {
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
        this.getTileFromGrid( gridCoord ).addToTile( object.id );
        object.currentGridSquare = gridCoord;
        var newTranslation = this.getWorldFromGrid( gridCoord[ 0 ], gridCoord[ 1 ] );
        var baSize = object.boundingAreaSize;
        if( baSize[ 0 ] > 1 ) { 
            newTranslation[ 0 ] = newTranslation[ 0 ] + 
            //move to middle of bounding area, correct so that we are in middle of tile
            ( 0.5 * baSize[ 0 ] - 0.5 ) * this.gridSquareLength;
        }
        if( baSize[ 1 ] > 1 ) { 
            newTranslation[ 1 ] = newTranslation[ 1 ] - 
            //move to middle of bounding area, correct so that we are in middle of tile
            ( 0.5 * baSize[ 1 ] - 0.5 ) * this.gridSquareLength;
        }
        if ( object.placeOnTerrain && object.terrainName && object.terrainName !== "undefined" ) {
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

this.removeFromGrid = function( nodeID, gridCoord ) {
    var objects = this.getObjectsAtCoord( gridCoord );
    var index = objects.indexOf( nodeID );
    if ( index !== -1 ) {
        for ( var i = index; i < objects.length - 1; i++ ) {
            objects[ i ] = objects[ i + 1 ];
        }
        objects.length--;
        return true;
    }
    return false;
}

this.moveObjectOnGrid = function( nodeID, srcCoord, destCoord ) {
    var removed = this.removeFromGrid( nodeID, srcCoord );
    if ( removed ) {
        this.getTileFromGrid( destCoord ).addToTile( nodeID );
    }
}

//Places the object on the terrain according to the terrain height
this.setHeightFromTerrain = function ( object ) {
    var scene = this.find( "/" )[ 0 ];
    var origin = [ object.translation[ 0 ], object.translation[ 1 ], object.translation[ 2 ] + 15 ];
    var terrain = this.find( "//" + object.terrainName )[ 0 ];
    if ( scene && origin && terrain ) {
        var intersects = scene.raycast( origin, [ 0, 0, -1 ], 0, Infinity, true, terrain.id );
        var terrainHeight = intersects.length > 0 ? intersects[ 0 ].point[ 2 ] : object.translation[ 2 ];
        object.translation = [ origin[ 0 ], origin[ 1 ], terrainHeight ];
    }
}

//Returns the first instance of an inventoriable object on the specified grid tile
this.getInventoriables = function( gridCoord ) {
    var inventoriables = [];
    if ( this.validCoord( gridCoord ) ) {
        var tile = this.getTileFromGrid( gridCoord );
        for ( var i = 0; i < tile.objects.length; i++ ) {
            var node = tile.getNodeAtIndex( i );
            if ( node === undefined ) {
                this.logger.errorx( "getInventoriables", "Unable to find node with " +
                    "ID: " + tile.objects[ i ] );
                return null;
            } else if ( node.isInventoriable ) {
                inventoriables.push( tile.objects[ i ] );
            }
        }
    }
    return inventoriables;
}

//Returns the first instance of a collidable object on the specified grid tile
this.getCollidables = function( gridCoord ) {
    var collidables = [];
    if ( this.validCoord( gridCoord ) ) {
        var tile = this.getTileFromGrid( gridCoord );
        for ( var i = 0; i < tile.objects.length; i++ ) {
            var node = tile.getNodeAtIndex( i );
            if ( node === undefined ) {
                this.logger.errorx( "getCollidables", "Unable to find node with " +
                    "ID: " + tile.objects[ i ] );
                return null;
            } else if ( node.isCollidable ) {
                collidables.push( tile.objects[ i ] );
            }
        }
    }
    return collidables;
}


this.checkCollision = function( gridCoord, ignoreSet ) {
    var collide = false;
    if ( this.validCoord( gridCoord ) ) {
        var tile = this.getTileFromGrid( gridCoord ); //TODO: don't input gridCoord
        for ( var i = 0; i < tile.objects.length; i++ ) {
            var node = tile.getNodeAtIndex( i );
            // ignoreSet is of format:
            // ignoreSet = { objectAname : true,
            //               objectBname : true, 
            //               ...
            //               objectZname : true 
            // }  
            if( ignoreSet && ignoreSet.hasOwnProperty( node.name ) ) {
                return false;
            }
            if ( node === undefined ) {
                this.logger.errorx( "checkCollision", "Unable to find node with " +
                    "ID: " + tile.objects[ i ] );
                return null;
            } else if ( node.isCollidable ) {
                collide = true;
                break;
            }
        }
    } else {
        collide = true;
    }
    return collide;
}

this.checkCollisionArea = function( gridCoord, boundingArea, ignoreSet ) {

    for( var x = 0; x < boundingArea[ 0 ]; x++ ) { 
        for( var y = 0; y < boundingArea[ 1 ]; y++ ) { 
            var currTileCoord = [ gridCoord[ 0 ] + x , gridCoord[ 1 ] - y ]; 
            var collided = this.checkCollision( currTileCoord, ignoreSet );
            if ( collided || collided === null ) {
               return collided;
            }
        }
    }

    return false;
}

this.getEnergy = function ( gridCoord ) {
    if ( this.validCoord( gridCoord ) ) {
        return this.getTileFromGrid( gridCoord ).energyRequired;
    }
    return null;
}

this.createTile = function() {
    var self = this;
    var tile = {
        "energyRequired": 0,
        "objects": [],
        "addToTile": function( nodeID ) {
            this.objects.push( nodeID );
        },
        "getNodeAtIndex": function ( index ) {
            var nodeID = this.objects[ index ];
            var node = self.scene.findByID( self.scene, nodeID );
            return node;
        }
    }
    return tile;
}

//@ sourceURL=source/grid.js
