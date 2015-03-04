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
    if ( this.frame ) {
        context.drawImage( this.frame, position.x, position.y );
    }
    if ( this.activeModeIcon ) {
        var posx = ( position.x + this.width / 2 ) - ( this.activeModeIcon.width / 2 );
        var posy = ( position.y + this.height / 2 ) - ( this.activeModeIcon.height / 2 );
        context.drawImage( this.activeModeIcon, posx, posy );
    }
}

this.setUpListeners = function() {
    var camera = this.find( "//gameCam" )[ 0 ];
    this.activeMode = "thirdPerson";
    camera.mounted = this.events.add( function( mount ) {
        this.activeMode = mount.name;
    }, this );
}

this.setActiveMode = function( mode ) {
    var src;
    switch ( mode ) {
        case "firstPerson":
        case "thirdPerson":
        case "topDown":
            src = "assets/images/hud/camera_" + mode + ".png";
            break;
        default:
            src = "";
            break;
    }
    var images = this.images;
    images.activeModeIcon = src;
    this.images = images;
}

//@ sourceURL=source/hud/cameraSelector.js