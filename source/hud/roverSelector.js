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
    var rover, icon, posx, posy;
    for ( var i = 0; i < this.rovers.length; i++ ) {
        if ( this.rovers[ i ].enabled ) {
            rover = this.rovers[ i ];
            icon = this[ rover.id ];
            if ( icon ) {
                posx = position.x + rover.position.x;
                posy = position.y + rover.position.y;
                context.drawImage( this.frame, posx, posy );
                if( rover.active ) {
                    context.drawImage( this.selectedBG, posx, posy );
                }
                context.drawImage( icon, posx, posy );
            }
        }
    }
}

this.onClick = function( elementPos ) {
    var iconIndex, iconPosition, i, enabledIndex, selectedRover;
    // Determine the potential icon index of the click
    iconIndex = Math.floor( elementPos.y / ( this.iconHeight$ + this.verticalSpacing$ ) );
    // Find the mouse y offset from the top of the icon
    iconPosition = elementPos.y - iconIndex * ( this.iconHeight$ + this.verticalSpacing$ );
    // Determine if the mouse y offset lies within the icon bounds
    if ( iconPosition <= this.iconHeight$ ) {
        // Loop through the icons, finding the one at the mouse position
        for ( i = 0, enabledIndex = 0; i < this.rovers.length; i++ ) {
            if ( this.rovers[ i ].enabled ) {
                if ( iconIndex === enabledIndex ) {
                    selectedRover = this.rovers[ i ].id;
                    break;
                }
                enabledIndex++;
            }
        }
        this.scene.selectBlocklyNode( selectedRover );
        this.selectRover( selectedRover );
    }
}

this.selectRover = function( nodeID ) {
    var rover;
    for ( var i = 0; i < this.rovers.length; i++ ) {
        rover = this.rovers[ i ];
        if ( rover.id === nodeID ) {
            rover.active = true;
        } else {
            rover.active = false;
        }
    }
}

this.addRoverIcon = function( node, src, enabled ) {
    var nodeID = node.id;
    var images = this.images;
    images[ nodeID ] = src;
    this.images = images;
    var rovers = this.rovers;
    rovers.push( {
        "id": nodeID,
        "enabled": enabled,
        "active": false,
        "position": {
            "x": 0,
            "y": 0
        }
    } );
    this.rovers = rovers;
    this.updateIconOrder();
}

// Pass a boolean to show (true) or hide (false) icons
// Pass in an array of nodeIDs to display specific icons
// Pass nothing in to display all icons
this.showRoverIcons = function( show, nodeIDs ) {
    for ( var i = 0; i < this.rovers.length; i++ ) {
        var rover = this.rovers[ i ];
        if ( !nodeIDs || nodeIDs.indexOf( rover.id ) !== -1 ) {
            rover.enabled = show;
        }
    }
    this.updateIconOrder();
}

this.updateIconOrder = function() {
    var iconIndex = 0;
    for ( var i = 0; i < this.rovers.length; i++ ) {
        if ( this.rovers[ i ].enabled ) {
            this.rovers[ i ].position.y = iconIndex * ( this.iconHeight$ + this.verticalSpacing$ );
            iconIndex++;
        }
    }
    // Update element height for event handling
    this.height = iconIndex * this.iconHeight$ + ( iconIndex - 1 ) * this.verticalSpacing$;
}

//@ sourceURL=source/hud/roverSelector.js