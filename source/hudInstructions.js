function createHUD() {

    var batteryMeter = new HUD.Element( "batteryMeter", drawBatteryMeter, 128, 128 );
    batteryMeter.battery = 100;
    batteryMeter.maxBattery = 100;
    hud.add( batteryMeter, "left", "top", { "x": 30, "y": 30 } );

    var roverIcon = new Image();
    roverIcon.src = "assets/hud/rover_frame.png";
    roverIcon.onload = ( function() {

        var roverFrame = new HUD.Element( "rover", drawIcon, roverIcon.width, roverIcon.height );
        roverFrame.icon = roverIcon;
        batteryMeter.frame = roverFrame;
        
    } );

    var roverPortrait = new Image();
    roverPortrait.src = "assets/hud/rover_portrait.png";
    roverPortrait.onload = ( function() {

        var roverp = new HUD.Element( "roverp", drawIcon, roverPortrait.width, roverPortrait.height );
        roverp.icon = roverPortrait;
        roverp.onMouseDown = clickBlockly;
        batteryMeter.portrait = roverp;
        
    } );

    var roverDetail = new Image();
    roverDetail.src = "assets/hud/rover_frame_detail.png";
    roverDetail.onload = ( function() {

        var rd = new HUD.Element( "roverDetail", drawIcon, roverPortrait.width, roverPortrait.height );
        rd.icon = roverDetail;
        batteryMeter.detail = rd;
        
    } );

    var icon = new Image();
    icon.src = "assets/images/1stPersonBlockly.png";
    icon.onload = ( function() {

        var blocklyButton = new HUD.Element( "blocklyButton", drawIcon, icon.width, icon.height );
        blocklyButton.icon = icon;
        blocklyButton.onMouseDown = clickBlockly;
        hud.add( blocklyButton, "right", "top", { "x": -30, "y": 30 } );
        
    } );

    createInventoryHUD( 4 );

}

function createInventoryHUD( capacity ) {

    var width = 48 * capacity;
    var height = 48;

    var slots = new Array();

    for ( var i = 0; i < capacity; i++ ) {
        slots[ i ] = { "item": null, "isMouseOver": false };
    }

    var inventory = new HUD.Element( "cargo", drawInventory, width, height );
    inventory.slots = slots;
    inventory.capacity = capacity;
    inventory.type = "inventory";
    hud.add( inventory, "center", "bottom", { "x": 0, "y": -30 } );

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
        context.drawImage( this.portrait.icon, center.x - this.portrait.width / 2, center.y - this.portrait.height / 2 );
    }

    if ( this.detail ) {
        context.drawImage( this.detail.icon, position.x, position.y );
    }

    if ( this.frame ) {
        context.drawImage( this.frame.icon, position.x, position.y );
    }

    context.textBaseline = "top";
    context.font = 'bold 24px Arial';
    context.fillStyle = "rgb(255,255,255)";
    context.fillText( Math.round(battery), position.x + this.width + 3, position.y - 1 );

}

function drawIcon( context, position ) {

    context.drawImage( this.icon, position.x, position.y );

}

function drawInventory( context, position ) {

    var cap = this.capacity;
    context.fillStyle = "rgb(80,40,40)";
    context.fillRect( position.x - 1, position.y - 1, this.width + this.capacity + 1, this.height + 2 );

    for ( var i = 0; i < this.slots.length; i++ ) {

        var posX = position.x + (i*48) + i;
        var posY = position.y;
        var item = this.slots[ i ].item;

        if ( item !== null ) {

            context.fillStyle = "rgb(80,80,160)";
            context.fillRect( posX, posY, 48, 48 );

            if ( item.icon instanceof Image ) {

                context.drawImage( item.icon, posX, posY );

            }

        } else if ( this.slots[ i ].isMouseOver ) {

            context.fillStyle = "rgb(180,180,225)";
            context.fillRect( posX, posY, 48, 48 );

        } else {

            context.fillStyle = "rgb(225,225,225)";
            context.fillRect( posX, posY, 48, 48 );

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

//@ sourceURL=source/hudInstructions.js