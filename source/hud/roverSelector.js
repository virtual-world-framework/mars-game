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
            icon = this[ rover.name ];
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
                    selectedRover = this.rovers[ i ];
                } else {
                    // Set other icons to inactive
                    this.rovers[ i ].active = false;
                }
                enabledIndex++;
            }
        }
        // Activate the selected rover
        selectedRover.active = true;
        this.scene.blockly_activeNodeID = selectedRover.node.id;
        this.scene.gameCam.setCameraTarget( selectedRover.node );
    }
}

this.addRoverIcon = function( name, node, src, enabled ) {
    var images = this.images;
    images[ name ] = src;
    this.images = images;
    this.rovers.push( {
        "node": node,
        "name": name,
        "enabled": enabled,
        "active": false,
        "position": {
            "x": 0,
            "y": 0
        }
    } );
    this.updateIconOrder();
}

this.showRoverIcon = function( name ) {
    for ( var i = 0; i < this.rovers.length; i++ ) {
        if ( this.rovers[ i ].name === name ) {
            this.rovers[ i ].enabled = true;
            break;
        }
    }
    this.updateIconOrder();
}

this.hideRoverIcon = function( name ) {
    for ( var i = 0; i < this.rovers.length; i++ ) {
        if ( this.rovers[ i ].name === name ) {
            this.rovers[ i ].enabled = false;
            break;
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