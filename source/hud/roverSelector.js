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
    this.future( 0 ).initializeRovers();
}

this.initializeRovers = function() {
    var scene = this.scene;
    scene.hud.roverSelector.addRoverIcon(
        scene.player.rover,
        "assets/images/hud/portrait_rover_small.png",
        false );
    scene.hud.roverSelector.addRoverIcon(
        scene.player.rover2,
        "assets/images/hud/portrait_scout_small.png",
        false );
    scene.hud.roverSelector.addRoverIcon(
        scene.player.rover3,
        "assets/images/hud/portrait_heavy_small.png",
        false );
}

this.draw = function( context, position ) {
    var rover, icon, posx, posy, batteryPct, ramPct, meterWidth, readout;
    for ( var i = 0; i < this.rovers.length; i++ ) {
        rover = this.rovers[ i ];
        if ( rover.enabled && !rover.active ) {
            icon = this[ rover.id ];
            if ( icon ) {
                posx = position.x + rover.position.x;
                posy = position.y + rover.position.y;
                context.drawImage( icon, posx, posy );
                context.drawImage( this.frame, posx, posy );
            }
            batteryPct = rover.battery / rover.maxBattery;
            ramPct = rover.ram / rover.maxRam;
            meterWidth = this.width - this.frame.width - this.meterSpacing;
            context.textBaseline = "top";
            context.font = "7pt Arial";
            context.fillStyle = "rgb(215,248,255)";
            context.textAlign = "left";
            readout = "BATTERY: " + Math.round( rover.battery ) + " / " + rover.maxBattery;
            posx += this.frame.width + this.meterSpacing;
            posy += 12;
            context.fillText( readout, posx, posy );
            context.fillStyle = "rgb(1,211,255)";
            posy += 12;
            context.fillRect( posx, posy, meterWidth * batteryPct, this.meterThickness );
            posy += 24;
            context.fillStyle = "rgb(215,248,255)";
            readout = "BLOCKS REMAINING: " + rover.ram + " / " + rover.maxRam;
            context.fillText( readout, posx, posy );
            context.fillStyle = "rgb(235,0,0)";
            posy += 12;
            context.fillRect( posx, posy, meterWidth * ramPct, this.meterThickness );
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
            if ( this.rovers[ i ].enabled && !this.rovers[ i ].active ) {
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
    this.updateIconOrder();
}

this.addRoverIcon = function( node, src, enabled ) {
    var nodeID = node.id;
    var images = this.images;
    images[ nodeID ] = src;
    this.images = images;
    var rovers = this.rovers;
    var newRover = {
        "id": nodeID,
        "enabled": enabled,
        "active": false,
        "position": {
            "x": 0,
            "y": 0
        },
        "battery": 0,
        "maxBattery": 0,
        "ram": 0,
        "maxRam": 0
    };
    rovers.push( newRover );
    this.setUpListeners( newRover );
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
        if ( this.rovers[ i ].enabled && !this.rovers[ i ].active ) {
            this.rovers[ i ].position.y = iconIndex * ( this.iconHeight$ + this.verticalSpacing$ );
            iconIndex++;
        }
    }
    // Update element height for event handling
    this.height = iconIndex * this.iconHeight$ + ( iconIndex - 1 ) * this.verticalSpacing$;
}

this.setUpListeners = function( rover ) {
    var node = this.scene.findByID( this.scene, rover.id );
    rover.battery = node.battery;
    rover.maxBattery = node.batteryMax;
    rover.ram = node.ram;
    rover.maxRam = node.ramMax;
    node.batteryChanged = this.events.add( function( value, id ) {
        var rovers = this.rovers;
        var rover = this.getRoverByID( id, rovers );
        rover.battery = value;
        this.rovers = rovers;
    }, this );
    node.batteryMaxChanged = this.events.add( function( value, id ) {
        var rovers = this.rovers;
        var rover = this.getRoverByID( id, rovers );
        rover.maxBattery = value;
        this.rovers = rovers;
    }, this );
    node.ramChanged = this.events.add( function( value, id ) {
        var rovers = this.rovers;
        var rover = this.getRoverByID( id, rovers );
        rover.ram = value;
        this.rovers = rovers;
    }, this );
    node.ramMaxChanged = this.events.add( function( value, id ) {
        var rovers = this.rovers;
        var rover = this.getRoverByID( id, rovers );
        rover.maxRam = value;
        this.rovers = rovers;
    }, this );
}

this.getRoverByID = function( nodeID, rovers ) {
    var rover, i;
    for ( i = 0; i < rovers.length; i++ ) {
        if ( rovers[ i ].id === nodeID ) {
            rover = rovers[ i ];
            break;
        }
    }
    return rover;
}

//@ sourceURL=source/hud/roverSelector.js