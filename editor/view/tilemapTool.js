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

var tilemap = {
    "vwfID": undefined,
    "inputWindow": undefined,
    "preview": undefined,
    "canvas": undefined,
    "size": 256,
    "origin": {
        "x": -128,
        "y": -128
    },
    "sizeSelector": undefined,
    "originXField": undefined,
    "originYField": undefined,
    "updateButton": undefined,
    "closeButton": undefined
}

tilemap.initialize = function() {
    this.inputWindow = document.getElementById( "tilemapInput" );
    this.preview = document.getElementById( "tilemapPreview" );
    this.canvas = document.getElementById( "tilemapCanvas" );
    this.sizeSelector = document.getElementById( "tilemapSize" );
    this.originXField = document.getElementById( "tilemapOriginX" );
    this.originYField = document.getElementById( "tilemapOriginY" );
    this.updateButton = document.getElementById( "tilemapUpdateButton" );
    this.closeButton = document.getElementById( "tilemapCloseButton" );
    this.sizeSelector.value = this.size;
    this.originXField.value = this.origin.x;
    this.originYField.value = this.origin.y;
    this.closeButton.addEventListener( "click", this.close.bind( this ) );
    this.updateButton.addEventListener( "click", this.updateValues.bind( this ) );
    this.updateCanvas();
}

tilemap.open = function() {
    this.inputWindow.style.display = "block";
    this.preview.style.display = "block";
}

tilemap.close = function() {
    this.inputWindow.style.display = "none";
    this.preview.style.display = "none";
    vwf_view.kernel.callMethod( appID, "closeActiveTool" );
}

tilemap.updateValues = function() {
    this.size = Number( this.sizeSelector.value );
    this.origin.x = Number( this.originXField.value );
    this.origin.y = Number( this.originYField.value );
    this.updateCanvas();
}

tilemap.updateCanvas = function() {
    // TODO: Preserve unaffected tiles when changing canvas size
    this.canvas.width = this.size;
    this.canvas.height = this.size;
    var context = this.canvas.getContext( "2d" );
    var imageData = context.getImageData( 0, 0, this.size, this.size );
    for ( var i = 3; i < imageData.data.length; i += 4 ) {
        imageData.data[ i ] = 255;
    }
    context.putImageData( imageData, 0, 0 );
    vwf_view.kernel.callMethod( this.vwfID, "setTileMapUniforms",
        [ this.canvas.id, [ this.origin.x, this.origin.y ], [ this.size, this.size ] ] );
}

tilemap.toggleTile = function( x, y ) {
    var mapX = x - this.origin.x;
    var mapY = this.origin.y + this.size - 1 - y;
    if ( mapX >= 0 && mapX < this.size && mapY >= 0 && mapY < this.size ) {
        var context = this.canvas.getContext( "2d" );
        var imageData = context.getImageData( mapX, mapY, 1, 1 );
        imageData.data[ 0 ] = Boolean( imageData.data[ 0 ] ) ? 0 : 255;
        imageData.data[ 1 ] = Boolean( imageData.data[ 1 ] ) ? 0 : 255;
        imageData.data[ 2 ] = Boolean( imageData.data[ 2 ] ) ? 0 : 255;
        context.putImageData( imageData, mapX, mapY );
    } else {
        console.log( "Tile Coordinate ( " + x + ", " + y + " ) is "
            + "outside the tilemap area." );
    }
    vwf_view.kernel.callMethod( this.vwfID, "updateTexture" );
}

tilemap.save = function() {
    var imageData = this.canvas.toDataURL( "image/png" );
    document.location.href = imageData.replace( "image/png", "image/octet-stream" );
}

tilemap.handleEvent = function( eventName, eventArguments ) {
    switch ( eventName ) {
        case "tileMapped":
            var tileX, tileY;
            tileX = eventArguments[ 0 ];
            tileY = eventArguments[ 1 ];
            this.toggleTile( tileX, tileY );
            break;
    }
}

//@ sourceURL=editor/view/tilemapTool.js