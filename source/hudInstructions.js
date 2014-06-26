function createHUD() {

    createRoverElement();
    createCameraSelector();
    createCommsDisplay();

    var blocklyButton = new HUD.Element( "blocklyButton", drawIcon, 64, 64 );
    blocklyButton.icon = new Image();
    blocklyButton.icon.src = "assets/images/hud/blockly_large.png";
    blocklyButton.onMouseDown = clickBlockly;
    hud.add( blocklyButton, "right", "bottom", { "x": -30, "y": -30 } );

    var graphButton = new HUD.Element( "graphButton", drawIcon, 64, 64 );
    graphButton.icon = new Image();
    graphButton.icon.src = "assets/images/hud/graph_display.png";
    graphButton.onMouseDown = toggleGraphDisplay;
    hud.add( graphButton, "right", "bottom", { "x": -102, "y": -30 } );

    var helpButton = new HUD.Element( "helpButton", drawIcon, 64, 64 );
    helpButton.icon = new Image();
    helpButton.icon.src = "assets/images/hud/help_large.png";
    helpButton.onMouseDown = showHelp;
    hud.add( helpButton, "right", "bottom", { "x": -174, "y": -30 } );

    // createInventoryHUD( 4 );

    hideCommsDisplay();

}

function createRoverElement() {
    var batteryMeter = new HUD.Element( "batteryMeter", drawBatteryMeter, 128, 128 );
    batteryMeter.battery = 100;
    batteryMeter.maxBattery = 100;
    batteryMeter.path = "/player/rover";
    batteryMeter.onMouseDown = switchTarget;
    hud.add( batteryMeter, "left", "top", { "x": 30, "y": 30 } );

    batteryMeter.frame = new Image();
    batteryMeter.frame.src = "assets/images/hud/rover_frame.png";
    batteryMeter.portrait = new Image();
    batteryMeter.portrait.src = "assets/images/hud/rover_portrait.png";
    batteryMeter.selectedIcon = new Image();
    batteryMeter.selectedIcon.src = "assets/images/hud/rover_select.png";
}

function createMiniRoverElement() {
    var miniroverElement = new HUD.Element( "minirover", drawMiniRoverElement, 88, 88 );
    miniroverElement.path = "/minirover";
    miniroverElement.onMouseDown = switchTarget;
    hud.add( miniroverElement, "left", "top", { "x": 50, "y": 168 } );

    miniroverElement.portrait = new Image();
    miniroverElement.portrait.src = "assets/images/hud/minirover_portrait.png";
    miniroverElement.frame = new Image();
    miniroverElement.frame.src = "assets/images/hud/minirover_frame.png";
    miniroverElement.selectedIcon = new Image();
    miniroverElement.selectedIcon.src = "assets/images/hud/minirover_select.png";
}

function createCameraSelector() {

    var selector = new HUD.Element( "cameraSelector", drawCameraSelector, 96, 96 );
    selector.activeMode = {
        "icon": new Image(),
        "type": "thirdPerson"
    };
    selector.activeMode.icon.src = "assets/images/hud/camera_thirdperson.png";
    selector.frame = new Image();
    selector.frame.src = "assets/images/hud/camera_selector_frame.png";
    hud.add( selector, "right", "top", { "x": -30, "y": 30 } );

    var firstPersonBtn = new HUD.Element( "camera_firstPerson", drawIcon, 22, 22 );
    firstPersonBtn.icon = new Image();
    firstPersonBtn.icon.src = "assets/images/hud/camera_firstperson.png";
    firstPersonBtn.mode = "firstPerson";
    firstPersonBtn.onMouseDown = selectCameraMode;
    hud.add( firstPersonBtn, "right", "top", { "x": -53, "y": 32 } );

    var thirdPersonBtn = new HUD.Element( "camera_thirdPerson", drawIcon, 22, 22 );
    thirdPersonBtn.icon = new Image();
    thirdPersonBtn.icon.src = "assets/images/hud/camera_thirdperson.png";
    thirdPersonBtn.mode = "thirdPerson";
    thirdPersonBtn.onMouseDown = selectCameraMode;
    hud.add( thirdPersonBtn, "right", "top", { "x": -34, "y": 54 } );

    var topDownBtn = new HUD.Element( "camera_topDown", drawIcon, 22, 22 );
    topDownBtn.icon = new Image();
    topDownBtn.icon.src = "assets/images/hud/camera_topdown.png";
    topDownBtn.mode = "topDown";
    topDownBtn.onMouseDown = selectCameraMode;
    hud.add( topDownBtn, "right", "top", { "x": -35, "y": 80 } );

}

function createCommsDisplay() {

    var commsElement = new HUD.Element( "comms", drawComms, 128, 192 );
    hud.add( commsElement, "left", "bottom", { "x": 30, "y": -30 } );

    var background = new Image();
    background.src = "assets/images/hud/communication_bg.png";
    background.onload = ( function() { commsElement.background = background; } );

    var frame = new Image();
    frame.src = "assets/images/hud/communication_frame.png";
    frame.onload = ( function() { commsElement.frame = frame; } );

    commsElement.characterImage = new Image();

}

function addImageToCommsDisplay( imagePath ) {
    var comms = hud.elements.comms; 
    if ( comms ) {
        comms.characterImage.src = imagePath;
    }
}

function showCommsDisplay() {
    var comms = hud.elements.comms;
    if ( comms ) {
        comms.visible = true;
    }
}

function hideCommsDisplay() {
    var comms = hud.elements.comms;
    if ( comms ) {
        comms.visible = false;
    }
}

function createInventoryHUD( capacity ) {

    var iconSize = 48;
    var width = iconSize * capacity;
    var height = iconSize;

    var slots = new Array();

    for ( var i = 0; i < capacity; i++ ) {
        slots[ i ] = { "item": null, "isMouseOver": false };
    }

    var inventory = new HUD.Element( "cargo", drawInventory, width, height );
    inventory.slots = slots;
    inventory.capacity = capacity;
    inventory.type = "inventory";
    inventory.label = new Image();
    inventory.label.src = "assets/images/hud/inventory_label.png";
    hud.add( inventory, "center", "bottom", { "x": 0, "y": -30 } );

    var leftEnd = new Image();
    leftEnd.src = "assets/images/hud/inventory_end_left.png";
    leftEnd.onload = ( function() { 
        inventory.leftEnd = leftEnd;
        inventory.width += leftEnd.width;
    } );

    var rightEnd = new Image();
    rightEnd.src = "assets/images/hud/inventory_end_right.png";
    rightEnd.onload = ( function() { 
        inventory.rightEnd = rightEnd;
        inventory.width += rightEnd.width;
    } );

    var separator = new Image();
    separator.src = "assets/images/hud/inventory_separator.png";
    separator.onload = ( function() { 
        inventory.separator = separator;
        inventory.width += ( capacity - 1 ) * separator.width;
    } );

}

function getInventoryHUD() {
    var inventory;
    for ( var els in hud.elements ) {
        if ( hud.elements[ els ].type === "inventory" ) {
            inventory = hud.elements[els];
            return inventory;
        }
    }
    return null;
}

function addSlotIcon( objectID, iconSrc, index, parentName ) {

    var inventory = getInventoryHUD();
    var slot;

    if ( inventory ) {

        slot = inventory.slots[ index ];

        if ( slot ){
            var icon = new Image();
            icon.src = iconSrc;
            icon.onload = ( function(){
                var inventoryItem = new HUD.Element( objectID, drawIcon, icon.width, icon.height );
                inventoryItem.icon = icon;
                inventoryItem.owner = parentName;
                slot.item = inventoryItem;
            });
        }
    }

}

function removeItemFromInventory( item ) {

    var vwfInventory = vwf_view.kernel.find( "", "//" + item.owner )[ 0 ];
    vwf_view.kernel.callMethod( vwfInventory, "remove", [ item.id ] );

}

function removeSlotIcon( objectID ) {

    var inventory = getInventoryHUD();

    if ( inventory ){

        for ( var i = 0; i < inventory.slots.length; i++ ) {

            if ( inventory.slots[ i ].item !== null && inventory.slots[ i ].item.id === objectID ){

                inventory.slots[ i ].item = null;

            }
        }
    }
}


// === Draw Functions ===

function drawBatteryMeter( context, position ) {

    var battery = this.battery;
    var maxBattery = this.maxBattery;
    var arcWidth = ( this.height + this.width ) / 4 ;
    var center = {
        "x": position.x + this.width / 2,
        "y": position.y + this.height / 2
    };
    var radius = ( ( this.width + this.height ) / 2 ) / 2 - ( arcWidth );
    var start = Math.PI * 1.5;
    var end = start - ( battery / maxBattery ) * Math.PI * 2;

    context.beginPath();
    context.arc( center.x, center.y, arcWidth, 0, 2 * Math.PI, false );
    context.fillStyle = "rgba(50,90,150,0.5)";
    context.fill();

    context.beginPath();
    context.arc( center.x, center.y, arcWidth / 2, start, end, true );
    context.lineWidth = arcWidth - 1;
    context.strokeStyle = "rgb(50,130,255)";
    context.stroke();

    if ( this.portrait ) {
        context.drawImage( this.portrait, center.x - this.portrait.width / 2, center.y - this.portrait.height / 2 );
    }

    if ( this.selectedIcon && targetPath === this.path ) {
        context.drawImage( this.selectedIcon, center.x - this.selectedIcon.width / 2, center.y - this.selectedIcon.height / 2 );
    }

    if ( this.frame ) {
        context.drawImage( this.frame, position.x, position.y );
    }

    context.textBaseline = "top";
    context.font = 'bold 24px Arial';
    context.fillStyle = "rgb(255,255,255)";
    context.fillText( Math.round(battery), position.x + this.width + 3, position.y - 1 );

}

function drawMiniRoverElement( context, position ) {
    var center = {
        "x": position.x + this.width / 2,
        "y": position.y + this.height / 2
    };

    if ( this.portrait ) {
        context.drawImage( this.portrait, center.x - this.portrait.width / 2, center.y - this.portrait.height / 2 );
    }

    if ( this.selectedIcon && targetPath === this.path ) {
        context.drawImage( this.selectedIcon, center.x - this.selectedIcon.width / 2, center.y - this.selectedIcon.height / 2 );
    }

    if ( this.frame ) {
        context.drawImage( this.frame, position.x, position.y );
    }
}

function drawComms( context, position ) {
    if ( this.background ) {
        context.drawImage( this.background, position.x, position.y );
    }

    if ( this.characterImage ) {
        context.drawImage( this.characterImage, position.x, position.y );
    }

    if ( this.frame ) {
        context.drawImage( this.frame, position.x, position.y );
    }
}

function drawCameraSelector( context, position ) {
    if ( this.frame ) {
        context.drawImage( this.frame, position.x, position.y );
    }

    if ( this.activeMode.icon ) {
        var posx = ( position.x + this.width / 2 ) - ( this.activeMode.icon.width / 2 );
        var posy = ( position.y + this.height / 2 ) - ( this.activeMode.icon.height / 2 );
        context.drawImage( this.activeMode.icon, posx, posy );
    }
}

function drawIcon( context, position ) {
    if ( this.icon ) {
        context.drawImage( this.icon, position.x, position.y );
    }

}

function drawInventory( context, position ) {

    var iconSize = 48;
    var cap = this.capacity;
    var separatorWidth = this.separator ? this.separator.width : 1;
    var elementWidth = this.capacity * iconSize + ( this.capacity - 1 ) * separatorWidth;
    var startPosition = position.x;

    context.drawImage( this.label, position.x + this.width / 2 - this.label.width / 2, position.y + 56 );

    if ( this.leftEnd ) {
        context.drawImage( this.leftEnd, position.x, position.y );
        startPosition += this.leftEnd.width;
    }

    if ( this.rightEnd ) {
        context.drawImage( this.rightEnd, startPosition + elementWidth, position.y );
    }

    for ( var i = 0; i < this.slots.length; i++ ) {

        var posX = startPosition + ( i * iconSize );
        var posY = position.y;
        var item = this.slots[ i ].item;

        if ( i > 0 ) {
            if ( this.separator ) {
                context.drawImage( this.separator, posX + ( i - 1 ) * separatorWidth, posY );
            }

            posX += i * separatorWidth;
        }

        if ( item !== null ) {

            if ( item.icon instanceof Image ) {

                context.drawImage( item.icon, posX, posY );

            }

        } else {

            context.fillStyle = "rgb(50,90,150)";
            context.fillRect( posX, posY + 5, iconSize, iconSize - 10 );

        }
    }
}


// === HUD Event Handlers ===

function clickBlockly( event ) {
    
    var sceneID = vwf_view.kernel.application();
    var targetID = vwf_view.kernel.find( "", targetPath )[ 0 ];

    if ( sceneID !== undefined && targetID !== undefined ) {
        vwf_view.kernel.setProperty( sceneID, "blockly_activeNodeID", targetID );
    }

}

function toggleGraphDisplay( event ) {

    var graphID = vwf_view.kernel.find( "", "//blocklyGraph" )[ 0 ];
    if ( graphID ) {
        vwf_view.kernel.callMethod( graphID, "toggleGraphVisibility" );
    }
}

function switchTarget( event ) {
    var cameraNode = vwf_view.kernel.find( "", "//camera" )[ 0 ];
    vwf_view.kernel.setProperty( cameraNode, "targetPath", this.path );
}

function selectCameraMode( event ) {
    var cameraNode = vwf_view.kernel.find( "", "//camera" )[ 0 ];
    vwf_view.kernel.setProperty( cameraNode, "pointOfView", this.mode );
}

function showHelp( event ) {
    var help = document.createElement( "DIV" );
    help.id = "helpScreen";
    help.className = "help";
    help.onclick = ( function() {
        var dialog = document.getElementById( "helpScreen" );
        document.body.removeChild( dialog );
    } );
    document.body.appendChild( help );
}

// Other functions

function blinkElement( elementID ) {
    var el = hud.elements[ elementID ];
    if ( el ) {
        el.currentDrawFunction = el.draw;
        el.lastBlinkTime = vwf_view.kernel.time();
        el.blinkInterval = 0.25;
        el.blinkDuration = 0.25;
        el.isBlinking = true;
        el.draw = ( function( context, position ) {
            var time = vwf_view.kernel.time();
            if ( time  - this.lastBlinkTime > this.blinkInterval ) {
                context.globalAlpha = 0.5;
                
                if ( time - this.lastBlinkTime > this.blinkInterval + this.blinkDuration ) {
                    this.lastBlinkTime = time;
                }
            }
            this.currentDrawFunction( context, position );
            context.globalAlpha = 1;
        } );
    }
}

function stopElementBlinking( elementID ) {
    var el = hud.elements[ elementID ];
    if ( el.isBlinking ) {
        el.draw = el.currentDrawFunction;
        delete el.currentDrawFunction;
        delete el.lastBlinkTime;
        delete el.blinkInterval;
        delete el.blinkDuration;
        delete el.isBlinking;
    }
}

//@ sourceURL=source/hudInstructions.js