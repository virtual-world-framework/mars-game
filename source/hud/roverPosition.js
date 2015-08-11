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
    this.future( 0 ).setUpListeners();
}

this.draw = function( context, position ) {
    var text = "( x: " + this.tilePosition[ 0 ] + ", y: " + this.tilePosition[ 1 ] + " )";
    context.font = '16px Arial';
    context.fillStyle = "rgb( 0, 0, 0 )";
    context.textAlign = "center";
    context.textBaseline = "top";
    context.fillText( "Current Position:", position.x + 2, position.y + 1 );
    context.fillText( text, position.x + 2, position.y + 25 );
    context.fillStyle = "rgb( 210, 235, 255 )";
    context.textAlign = "center";
    context.textBaseline = "top";
    context.fillText( "Current Position:", position.x, position.y );
    context.fillText( text, position.x, position.y + 24 );
}

this.setUpListeners = function() {
}

//@ sourceURL=source/hud/roverPosition.js