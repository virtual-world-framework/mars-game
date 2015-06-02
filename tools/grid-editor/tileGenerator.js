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

this.initialize = function() {
    this.camera.transform = [
        -1,   0,    0, 0,
         0,  -1,    0, 0,
         0,   0,    1, 0,
         0, 600,  150, 1
    ];
    this.camera.far *= 4;
    this.camera.navmode = "fly";
    this.future( 0.5 ).setUpListeners();
}

this.setUpListeners = function() {
    var handler = function( pointerData, nodeData ) {
        this.drawTileToTexture( pointerData, nodeData );
    }
    this.terrain.pointerClick = this.events.add( handler, this );
}

this.drawTileToTexture = function( pointerData, nodeData ) {
    if ( pointerData.button !== "left" ) {
        return;
    }
    var worldPosition, x, y;
    worldPosition = nodeData.globalPosition.slice();
    x = Math.round( worldPosition[ 0 ] / 3 );
    y = Math.round( worldPosition[ 1 ] / 3 );
    this.tileMapped( x, y );
}

this.setTileMapUniforms = function( canvasID, origin, size ) {
    this.terrain.material.tileMap = { "canvasID": canvasID, "magFilter": "nearest", "minFilter": "nearest" };
    this.terrain.material.tileMapOrigin = origin;
    this.terrain.material.tileMapSize = size;
}

this.updateTexture = function() {
    this.terrain.material.updateTexture( "tileMap" );
}

//@ sourceURL=tileGenerator.js