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

var camera;

this.isBlinking = false;

this.initialize = function() {
    this.blink();
}

this.callOut = function( coords ) {
    camera = this.find( "/nomadCam" )[ 0 ];
    coords[ 0 ] /= this.parent.graphScale;
    coords[ 1 ] /= this.parent.graphScale;
    coords[ 2 ] /= this.parent.graphScale;
    this.origin = coords;
    this.isBlinking = true;
}

this.blink = function() {
    if ( this.isBlinking ) {
        if ( camera.mountName === "topDown" ) {
            this.visible = !this.visible;
        } else {
            this.visible = false;
        }
    } else {
        this.visible = false;
    }
    this.future( 0.5 ).blink();
}
this.stopBlink = function() {
    this.isBlinking = false;
}

//@ sourceURL=source/callouttile.js