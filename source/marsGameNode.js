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

this.placeAtTileCoord = function( x, y, duration ) {
    var tileMap, worldPosition;
    tileMap = this.scene.tileMap;
    worldPosition = tileMap.getWorldCoordFromTile( x, y );
    this.placeAtWorldCoord( worldPosition.x, worldPosition.y, duration );
}

this.placeAtWorldCoord = function( x, y, duration ) {
    var heightMap, z;
    heightMap = this.scene.environment.heightmap;
    z = heightMap.getHeight( x, y );
    this.place( [ x, y, z ], duration );
}

this.place = function( translation, duration ) {
    this.translateTo( translation, duration );
}

this.setTilePosition = function( x, y ) {
    if ( this.scene ) {
        this.placeAtTileCoord( x, y );
    } else {
        this.future( 0.3 ).setTilePosition( x, y );
    }
}

this.getTileCoord = function() {
    var tileMap, transform, tileCoord;
    if ( this.scene ) {
        tileMap = this.scene.tileMap;
        transform = this.worldTransform;
        tileCoord = tileMap.getTileCoordFromWorld( transform[ 12 ], transform[ 13 ] );
        return tileCoord;
    }
}

//@ sourceURL=source/marsGameNode.js