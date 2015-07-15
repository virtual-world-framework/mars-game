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

this.setTileMapUniforms = function( canvasID, origin, size ) {
    this.scene.terrain.material.tileMap = { "canvasID": canvasID, "magFilter": "nearest", "minFilter": "nearest" };
    this.scene.terrain.material.tileMapOrigin = origin;
    this.scene.terrain.material.tileMapSize = size;
}

this.updateTexture = function() {
    this.scene.terrain.material.updateTexture( "tileMap" );
}

this.handlePointerClick = function( pointerInfo, pickInfo ) {
    var worldPosition, x, y;
    if ( pointerInfo.button === "left" && !this.isDragging$ ) {
        worldPosition = pickInfo.globalPosition.slice();
        x = Math.round( worldPosition[ 0 ] / 3 );
        y = Math.round( worldPosition[ 1 ] / 3 );
        this.tileMapped( x, y );
    }
}

this.handlePointerDown = function( pointerInfo, pickInfo ) {}

this.handlePointerMove = function( pointerInfo, pickInfo ) {
    var worldPosition, x, y;
    if ( pointerInfo.buttons.left ) {
        this.isDragging$ = true;
        worldPosition = pickInfo.globalPosition.slice();
        x = Math.round( worldPosition[ 0 ] / 3 );
        y = Math.round( worldPosition[ 1 ] / 3 );
        if ( !this.lastDragTile$ || ( x !== this.lastDragTile$[ 0 ] || y !== this.lastDragTile$[ 1 ] ) ) {
            this.tileMapped( x, y );
            this.lastDragTile$ = [ x, y ];
        }
    }
}

this.handlePointerUp = function( pointerInfo, pickInfo ) {
    this.lastDragTile$ = undefined;
    this.isDragging$ = false;
}

this.handlePointerOver = function( pointerInfo, pickInfo ) {}
this.handlePointerOut = function( pointerInfo, pickInfo ) {}
this.handlePointerWheel = function( pointerInfo, pickInfo ) {}

//@ sourceURL=editor/model/tilemapTool.js