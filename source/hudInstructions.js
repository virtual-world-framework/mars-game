function createHUD() {

    var batteryMeter = new HUD.Element( "batteryMeter", drawBatteryMeter, 250, 40 );
    batteryMeter.battery = 30;
    batteryMeter.maxBattery = 50;
    hud.add( batteryMeter, "left", "bottom", { "x": 30, "y": -30 } );
    batteryMeter.visible = true;

    var ramMeter = new HUD.Element( "ramMeter", drawRamMeter, 250, 40 );
    ramMeter.ram = 15;
    ramMeter.maxRam = 15;
    hud.add( ramMeter, "right", "bottom", { "x": -30, "y": -30 } );
    ramMeter.visible = true;

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

    var cols = Math.round( Math.sqrt( capacity ) );
    var rows = cols * cols < capacity ? cols + 1 : cols;
    var width = 48 * cols + cols;
    var height = 48 * rows + rows;

    var grid = new Array();

    for ( var i = 0, slot = 0; i < rows; i++ ) {

        grid[i] = new Array();

        for ( var n = 0; n < cols && slot < capacity; n++, slot++ ) {

            grid[i][n] = { "item": null, "slot": slot, "isMouseOver": false };

        }

    }

    var inventory = new HUD.Element( "cargo", drawInventory, width, height );
    inventory.grid = grid;
    inventory.capacity = capacity;
    inventory.type = "inventory";
    inventory.onMouseMove = selectGrid;
    inventory.onMouseOut = deselectGrid;
    inventory.onMouseDown = selectItem;
    hud.add( inventory, "center", "bottom", { "x": 0, "y": -30 } );

}

function getInventoryHUD() {
    var inventory;
    for ( var els in hud.elements ) {
        if ( hud.elements[ els ].type === "inventory" ) {
            inventory = hud.elements[els];
        }
    }
    return inventory;
}

//Returns the first available inventory HUD slot based on current size of inventory
function getAvailableInventorySlot( inventory, inventorySize ) {

    if ( inventory ){
        var col = inventorySize % 2;
        var row = Math.floor( inventorySize / 2 ) % 2;
        return inventory.grid[ row ][ col ];
    }
    return null;

}

function addSlotIcon( objectID, iconSrc, inventorySize, parentName ) {

    var slot = getAvailableInventorySlot( getInventoryHUD(), inventorySize );

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

function removeItemFromInventory( item ) {

    var vwfInventory = vwf_view.kernel.find( "", "//" + item.owner )[ 0 ];
    vwf_view.kernel.callMethod( vwfInventory, "remove", [ item.id ] );

}

function removeSlotIcon( item, inventorySize ) {

    var inventory = hud.elements[ item.owner ];

    if ( hud.elements.hasOwnProperty( item.owner ) ) {

        for ( var r = 0; r < inventory.grid.length; r++ ) {

            for ( var c = 0; c < inventory.grid[ r ].length; c++ ) {

                if ( inventory.grid[ r ][ c ].item !== null && inventory.grid[ r ][ c ].item.id === item.id ){

                    var lastSlot = getAvailableInventorySlot( inventory, inventorySize );
                    inventory.grid[ r ][ c ] = lastSlot;
                    lastSlot = null;

                }
            }
        }
    }
}


// === Draw Functions ===

function drawBatteryMeter( context, position ) {

    var battery = this.battery;
    var maxBattery = this.maxBattery;
    var meterWidth = (this.width - 10) * battery / maxBattery;
    var meterHeight = (this.height - 10);

    context.strokeStyle = "rgb(255,255,255)";
    context.lineWidth = 3;
    context.strokeRect( position.x, position.y, this.width, this.height );
    context.fillStyle = "rgb(50,90,220)";
    context.fillRect( position.x + 5, position.y + 5, meterWidth, meterHeight );

    context.textBaseline = "bottom";
    context.font = '16px Arial';
    context.fillStyle = "rgb(255,255,255)";
    context.fillText("BATTERY", position.x, position.y - 4);

    context.textBaseline = "top";
    context.font = 'bold 28px Arial';
    context.fillStyle = "rgb(255,255,255)";
    context.fillText(Math.round(battery), position.x + 25, position.y + 4);

}

function drawRamMeter( context, position ) {

    var ram = this.ram;
    var maxRam = this.maxRam;
    var meterWidth = (this.width - 10) * ram / maxRam;
    var meterHeight = (this.height - 10);

    context.strokeStyle = "rgb(255,255,255)";
    context.lineWidth = 3;
    context.strokeRect( position.x, position.y, this.width, this.height );
    context.fillStyle = "rgb(220,90,50)";
    context.fillRect( position.x + this.width - 5, position.y + 5, -meterWidth, meterHeight );

    context.textBaseline = "bottom";
    context.font = '16px Arial';
    context.fillStyle = "rgb(255,255,255)";
    context.textAlign = "end";
    context.fillText("RAM", position.x + this.width, position.y - 4);

    context.textBaseline = "top";
    context.font = 'bold 28px Arial';
    context.fillStyle = "rgb(255,255,255)";
    context.textAlign = "end";
    context.fillText(Math.round(ram), position.x + this.width - 25, position.y + 4);

}

function drawIcon( context, position ) {

    context.drawImage( this.icon, position.x, position.y );

}

function drawInventory( context, position ) {

    var cap = this.capacity;
    context.fillStyle = "rgb(80,40,40)";
    context.fillRect( position.x - 1, position.y - 1, this.width + 1, this.height + 1);

    for ( var r = 0; r < this.grid.length; r++ ) {

        for ( var c = 0; c < this.grid[r].length; c++ ) {

            var posX = position.x + (c*48) + c;
            var posY = position.y + (r*48) + r;
            var item = this.grid[r][c].item;

            if ( item !== null ) {

                context.fillStyle = "rgb(80,80,160)";
                context.fillRect( posX, posY, 48, 48 );

                if ( item.icon instanceof Image ) {

                    context.drawImage( item.icon, posX, posY );

                }

            } else if ( this.grid[r][c].isMouseOver ) {

                context.fillStyle = "rgb(180,180,225)";
                context.fillRect( posX, posY, 48, 48 );

            } else {

                context.fillStyle = "rgb(225,225,225)";
                context.fillRect( posX, posY, 48, 48 );

            }
        }
    }
}


// === HUD Event Handlers ===

function startDrag( event ) {

    if ( event.which === 1 ) {

        this.isDragging = true;
        this.startPos.x = event.clientX;
        this.startPos.y = event.clientY;
        hud.moveToTop( this.id );

    }

}

function drag( event ) {

    if ( this.isDragging && event.which === 1 ) {

        var movX = event.clientX - this.startPos.x;
        var movY = event.clientY - this.startPos.y;

        this.offset.x += movX;
        this.offset.y += movY;

        this.startPos.x = event.clientX;
        this.startPos.y = event.clientY;

        // Prevent element from losing mouse position
        this.isMouseOver = true;
        this.position.x += movX;
        this.position.y += movY;

        var picks = hud.pick( event );
        picks.splice( picks.indexOf( this ), 1 );

        for ( var i = 0; i < picks.length; i++ ) {

            picks[i].onMouseMove( event );

        }

    } else {

        this.isDragging = false;
        hud.remove( this );

    }

}

function drop( event ) {

    this.isDragging = false;
    hud.remove( this );

    var picks = hud.pick( event );
    var inventory = null;

    for ( var i = 0; i < picks.length; i++ ) {

        if ( picks[i].hasOwnProperty("type") && picks[i].type === "inventory" ) {

            inventory = picks[i];

        }

    }

    if ( inventory !== null ) {

        var slot = getInventorySlot( event, inventory );

        if ( slot !== null ) {

            addItemToInventory( this, inventory, slot );

        }

    } else {

        removeItemFromInventory( this );

    }
}

function getInventorySlot( event, inventory ) {

    var slot = null;
    var posX = event.clientX - inventory.position.x;
    var posY = event.clientY - inventory.position.y;

    var r = Math.round( posY / 49 - 0.5 );
    var c = Math.round( posX / 49 - 0.5 );

    if ( inventory.grid[r][c] !== undefined ) {

        slot = inventory.grid[r][c];

    }

    return slot;

}

function selectGrid( event ) {

    var posX = event.clientX - this.position.x;
    var posY = event.clientY - this.position.y;

    var r = Math.round( posY / 49 - 0.5 );
    var c = Math.round( posX / 49 - 0.5 );

    for ( var rr = 0; rr < this.grid.length; rr++ ) {

        for ( var cc = 0; cc < this.grid[rr].length; cc++ ) {

            this.grid[rr][cc].isMouseOver = false;

        }

    }

    if ( this.grid[r][c] !== undefined ) {

        this.grid[r][c].isMouseOver = true;

    }
}

function deselectGrid( event ) {

    for ( var r = 0; r < this.grid.length; r++ ) {

        for ( var c = 0; c < this.grid[r].length; c++ ) {

            this.grid[r][c].isMouseOver = false;

        }

    }

}

function selectItem( event ) {

    var posX = event.clientX - this.position.x;
    var posY = event.clientY - this.position.y;

    var r = Math.round( posY / 49 - 0.5 );
    var c = Math.round( posX / 49 - 0.5 );

    if ( this.grid[r][c] !== undefined && this.grid[r][c].item !== null ) {

        var vwfID = this.grid[r][c].item.id;
        vwf_view.kernel.callMethod( vwfID, "grab", [{ "x": event.clientX, "y": event.clientY }] );

    }

}

function clickBlockly( event ) {
    
    var roverID = vwf_view.kernel.find( undefined, "/player/rover" )[ 0 ];
    var sceneID = vwf_view.kernel.application();

    if ( sceneID !== undefined && roverID !== undefined ) {
        vwf_view.kernel.setProperty( sceneID, "blocklyUiNodeID", roverID );        
    }

}

//@ sourceURL=source/hudInstructions.js