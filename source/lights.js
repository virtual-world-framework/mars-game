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
    this.future( 0 ).setUpEvents();
}

this.setUpEvents = function() {
    var scene = this.find( "/" )[ 0 ];
    if ( !scene || scene.name !== "application" ) {
        return;
    }
    scene.camera.transformChanged = scene.camera.events.add( this.followCamera, this );
}

this.followCamera = function( transform ) {
    var camPos = [
        Math.round( transform[ 12 ] ),
        Math.round( transform[ 13 ] ),
        0
    ];
    var newPos = [ 
        camPos[ 0 ] + this.offsetFromTarget[ 0 ],
        camPos[ 1 ] + this.offsetFromTarget[ 1 ],
        camPos[ 2 ] + this.offsetFromTarget[ 2 ]
    ];
    // cameraPos[ 0 ] = Math.round( tf.transform[ 12 ] + cam.transform[ 12 ] );
    // cameraPos[ 1 ] = Math.round( tf.transform[ 13 ] + cam.transform[ 13 ] );
    // cameraPos[ 2 ] = 0;
    // var offset = this.offsetFromTarget;
    // newPos[ 0 ] = cameraPos[ 0 ] + offset[ 0 ];
    // newPos[ 1 ] = cameraPos[ 1 ] + offset[ 1 ];
    // newPos[ 2 ] = cameraPos[ 2 ] + offset[ 2 ];
    this.target = camPos;
    this.translateTo( newPos );
}

//@ sourceURL=source/lights.js