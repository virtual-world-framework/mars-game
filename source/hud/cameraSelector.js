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
    var i, offset, mode;
    for ( i = 0; i < this.modes.length; i++ ) {
        mode = this.modes[ i ];
        offset = i * this.buttonSize + i * this.buttonSpacing;
        if ( mode === this.activeMode ) {
            context.drawImage( this.selected, position.x + offset, position.y );
        } else {
            context.drawImage( this.frame, position.x + offset, position.y );
        }
    }
}

this.setUpListeners = function() {
    var camera = this.find( "//gameCam" )[ 0 ];
    camera.mounted = this.events.add( function( mount ) {
        this.activeMode = mount.name;
    }, this );
}

//@ sourceURL=source/hud/cameraSelector.js