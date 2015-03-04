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
    scene.gameCam.transformChanged = scene.gameCam.events.add( function( transform ) {
        this.followCamera( transform );
    }, this );
}

this.followCamera = function( transform ) {
    var newPos = [ 
        transform[ 12 ] + this.offsetFromTarget[ 0 ],
        transform[ 13 ] + this.offsetFromTarget[ 1 ],
        transform[ 14 ] + this.offsetFromTarget[ 2 ]
    ];
    this.translateTo( newPos );
}

//@ sourceURL=source/dustSystem.js