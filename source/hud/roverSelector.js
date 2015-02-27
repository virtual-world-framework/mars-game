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

this.draw = function( context, position ) {
    if ( this.icon ) {
        context.drawImage( this.icon, position.x, position.y );
    }
}

this.onClick = function( event, elementPos ) {
    // Find the rover element at mouse position (elementPos)
    //   and store the rover node in a variable
    // Set it to active
    // Set it as blockly_activeNodeID
    // Set it as the camera target
}

this.addRoverIcon = function( name, node, src ) {
    var count, keys;
    keys = Object.keys( this.rovers );
    count = 0;
    for ( var i = 0; i < keys.length; i++ ) {
        if ( this.rovers[ keys[ i ] ].enabled ) {
            count++;
        }
    }
    this.images[ name ] = src;
    this.rovers[ name ] = {
        "node": node,
        "enabled": true,
        "active": false,
        "position": {
            "x": 0,
            "y": count * 64 + count * this.verticalSpacing
        }
    };
}
this.showRoverIcon = function() {}
this.hideRoverIcon = function() {}

//@ sourceURL=source/hud/roverSelector.js