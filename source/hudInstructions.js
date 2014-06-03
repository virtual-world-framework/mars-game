function createHUD() {

    createRoverElement();
    createMiniRoverElement();
    createCameraSelector();
    createCommsDisplay();

    var icon = new Image();
    icon.src = "assets/hud/blockly_large.png";
    icon.onload = ( function() {

        var blocklyButton = new HUD.Element( "blocklyButton", drawIcon, icon.width, icon.height );
        blocklyButton.icon = icon;
        blocklyButton.onMouseDown = clickBlockly;
        hud.add( blocklyButton, "right", "bottom", { "x": -30, "y": -30 } );
        
    } );

    createInventoryHUD( 4 );

}

function createRoverElement() {
    var batteryMeter = new HUD.Element( "batteryMeter", drawBatteryMeter, 128, 128 );
    batteryMeter.battery = 100;
    batteryMeter.maxBattery = 100;
    batteryMeter.path = "/player/rover";
    batteryMeter.onMouseDown = switchTarget;
    hud.add( batteryMeter, "left", "top", { "x": 30, "y": 30 } );

    var roverFrame = new Image();
    roverFrame.src = "assets/hud/rover_frame.png";
    roverFrame.onload = ( function() { batteryMeter.frame = roverFrame; } );

    var roverPortrait = new Image();
    roverPortrait.src = "assets/hud/rover_portrait.png";
    roverPortrait.onload = ( function() { batteryMeter.portrait = roverPortrait; } );

    var roverDetail = new Image();
    roverDetail.src = "assets/hud/rover_frame_detail.png";
    roverDetail.onload = ( function() { batteryMeter.detail = roverDetail; } );
}

function createMiniRoverElement() {
    var miniroverElement = new HUD.Element( "minirover", drawMiniRoverElement, 88, 88 );
    miniroverElement.path = "/minirover";
    miniroverElement.onMouseDown = switchTarget;
    hud.add( miniroverElement, "left", "top", { "x": 50, "y": 168 } );

    var portrait = new Image();
    portrait.src = "assets/hud/minirover_portrait.png";
    portrait.onload = ( function() { miniroverElement.portrait = portrait; } );

    var frame = new Image();
    frame.src = "assets/hud/minirover_frame.png";
    frame.onload = ( function() { miniroverElement.frame = frame; } );
}

function createCameraSelector() {

    var largeIcon = new Image();
    largeIcon.src = "assets/hud/camera_bg_large.png";
    largeIcon.onload = ( function() {

        var selectedMode = new HUD.Element( "camera_selected", drawCameraSelector, largeIcon.width, largeIcon.height );
        selectedMode.background = largeIcon;
        selectedMode.mode = "thirdPerson";
        selectedMode.icon = undefined;
        hud.add( selectedMode, "right", "top", { "x": -80, "y": 80 } );
        
    } );

    var smallIcon1 = new Image();
    smallIcon1.src = "assets/hud/camera_bg_small.png";
    smallIcon1.onload = ( function() {

        var optionMode1 = new HUD.Element( "camera_option1", drawCameraSelector, smallIcon1.width, smallIcon1.height );
        optionMode1.background = smallIcon1;
        optionMode1.mode = "firstPerson";
        optionMode1.icon = undefined;
        optionMode1.onMouseDown = switchCameraMode;
        hud.add( optionMode1, "right", "top", { "x": -70, "y": 30 } );
        
    } );

    // var smallIcon2 = new Image();
    // smallIcon2.src = "assets/hud/camera_bg_small.png";
    // smallIcon2.onload = ( function() {

    //     var optionMode2 = new HUD.Element( "camera_option2", drawCameraSelector, smallIcon2.width, smallIcon2.height );
    //     optionMode2.background = smallIcon2;
    //     optionMode2.mode = "topDown";
    //     optionMode2.icon = undefined;
    //     optionMode2.onMouseDown = switchCameraMode;
    //     hud.add( optionMode2, "right", "top", { "x": -30, "y": 70 } );
        
    // } );
}

function createCommsDisplay() {

    var commsElement = new HUD.Element( "comms", drawComms, 128, 192 );
    hud.add( commsElement, "left", "bottom", { "x": 30, "y": -30 } );

    var background = new Image();
    background.src = "assets/hud/communication_bg.png";
    background.onload = ( function() { commsElement.background = background; } );

    var frame = new Image();
    frame.src = "assets/hud/communication_frame.png";
    frame.onload = ( function() { commsElement.frame = frame; } );

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
    hud.add( inventory, "center", "bottom", { "x": 0, "y": -30 } );

    var leftEnd = new Image();
    leftEnd.src = "assets/hud/inventory_end_left.png";
    leftEnd.onload = ( function() { 
        inventory.leftEnd = leftEnd;
        inventory.width += leftEnd.width;
    } );

    var rightEnd = new Image();
    rightEnd.src = "assets/hud/inventory_end_right.png";
    rightEnd.onload = ( function() { 
        inventory.rightEnd = rightEnd;
        inventory.width += rightEnd.width;
    } );

    var separator = new Image();
    separator.src = "assets/hud/inventory_separator.png";
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

function removeSlotIcon( item ) {

    var inventory = hud.elements[ item.owner ];

    if ( inventory ){

        for ( var i = 0; i < inventory.slots.length; i++ ) {

            if ( inventory.slots[ i ].item !== null && inventory.slots[ i ].item.id === item.id ){

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
    context.arc( center.x, center.y, arcWidth / 2, start, end, true );
    context.lineWidth = arcWidth - 1;
    context.strokeStyle = "rgb(50,90,220)";
    context.stroke();

    if ( this.portrait ) {
        context.drawImage( this.portrait, center.x - this.portrait.width / 2, center.y - this.portrait.height / 2 );
    }

    if ( this.frame ) {
        context.drawImage( this.frame, position.x, position.y );
    }

    if ( this.detail ) {
        context.drawImage( this.detail, position.x, position.y );
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

    if ( this.frame ) {
        context.drawImage( this.frame, position.x, position.y );
    }
}

function drawComms( context, position ) {
    if ( this.background ) {
        context.drawImage( this.background, position.x, position.y );
    }

    if ( this.frame ) {
        context.drawImage( this.frame, position.x, position.y );
    }
}

function drawCameraSelector( context, position ) {
    if ( this.background ) {
        context.drawImage( this.background, position.x, position.y );
    }
}

function drawIcon( context, position ) {

    context.drawImage( this.icon, position.x, position.y );

}

function drawInventory( context, position ) {

    var iconSize = 48;
    var cap = this.capacity;
    var separatorWidth = this.separator ? this.separator.width : 1;
    var elementWidth = this.capacity * iconSize + ( this.capacity - 1 ) * separatorWidth;
    var startPosition = position.x;

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

        } else if ( this.slots[ i ].isMouseOver ) {

            context.fillStyle = "rgb(180,180,225)";
            context.fillRect( posX, posY, iconSize, iconSize );

        } else {

            context.fillStyle = "rgb(50,90,220)";
            context.fillRect( posX, posY, iconSize, iconSize );

        }
    }
}


// === HUD Event Handlers ===

function clickBlockly( event ) {
    
    var sceneID = vwf_view.kernel.application();

    if ( sceneID !== undefined && targetID !== undefined ) {
        vwf_view.kernel.setProperty( sceneID, "blockly_activeNodeID", targetID );
    }

}

function switchTarget( event ) {
    var cameraNode = vwf_view.kernel.find( "", "//camera" )[ 0 ];
    vwf_view.kernel.setProperty( cameraNode, "targetPath", this.path );
}

function switchCameraMode( event ) {
    var selectedMode = hud.elements[ "camera_selected" ].mode;
    var selectedIcon = hud.elements[ "camera_selected" ].icon;
    var cameraNode = vwf_view.kernel.find( "", "//camera" )[ 0 ];
    vwf_view.kernel.setProperty( cameraNode, "pointOfView", this.mode );
    hud.elements[ "camera_selected" ].mode = this.mode;
    hud.elements[ "camera_selected" ].icon = this.icon;
    this.mode = selectedMode;
    this.icon = selectedIcon;
}

//@ sourceURL=source/hudInstructions.js