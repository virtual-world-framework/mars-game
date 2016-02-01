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

this.getData = function( x, y ) {
    var mapData, index, pixelData;
    mapData = this.heightmap;
    index = 4 * ( this.heightmapWidth * y + x );
    if ( index < 0 || index > mapData.length - 4 ) {
        this.logger.warnx( "tileMap.getData", "Pixel ( " + x + ", "
            + y + " ) does not exist in the tileMap." );
        return null;
    }
    pixelData = {
        "r": mapData[ index ],
        "g": mapData[ index + 1 ],
        "b": mapData[ index + 2 ],
        "a": mapData[ index + 3 ]
    };
    return pixelData;
}

this.getDataAtWorldCoord = function( x, y ) {
    var tileX, tileY;
    tileX = Math.round( x / this.tileSize );
    tileY = Math.round( y / this.tileSize );
    return this.getDataAtTileCoord( tileX, tileY );
}

this.getDataAtTileCoord = function( x, y ) {
    var mapX, mapY;
    mapX = x - this.mapOrigin[ 0 ];
    mapY = ( this.mapOrigin[ 1 ] + this.mapSize[ 1 ] ) - 1 - y;
    return this.getData( mapX, mapY );
}

this.getTileCoordFromWorld = function( x, y ) {
    var tileX, tileY, coord;
    tileX = Math.round( x / this.tileSize );
    tileY = Math.round( y / this.tileSize );
    coord = [ tileX, tileY ];
    return coord;
}

this.getWorldCoordFromTile = function( x, y ) {
    var worldX, worldY, coord;
    worldX = Math.round( x * this.tileSize );
    worldY = Math.round( y * this.tileSize );
    coord = [ worldX, worldY ];
    return coord;
}

//@ sourceURL=source/tileMap.js