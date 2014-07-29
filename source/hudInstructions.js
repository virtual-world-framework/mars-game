function createHUD() {

    createRoverElement();
    createCameraSelector();
    createCommsDisplay();
    createBlocklyStatus();
    createStatusText();

    var blocklyButton = new HUD.Element( "blocklyButton", drawIcon, 64, 64 );
    blocklyButton.icon = new Image();
    blocklyButton.icon.src = "assets/images/hud/blockly_large.png";
    blocklyButton.onMouseDown = clickBlockly;
    hud.add( blocklyButton, "right", "bottom", { "x": -30, "y": -30 } );

    var graphButton = new HUD.Element( "graphButton", drawHelicamButton, 64, 64 );
    graphButton.icon = new Image();
    graphButton.icon.src = "assets/images/hud/graph_display.png";
    graphButton.enabled = true;
    graphButton.onMouseDown = toggleGraphDisplay;
    hud.add( graphButton, "right", "bottom", { "x": -102, "y": -30 } );

    var tilesButton = new HUD.Element( "tilesButton", drawHelicamButton, 64, 64 );
    tilesButton.icon = new Image();
    tilesButton.icon.src = "assets/images/hud/tiles_button.png";
    tilesButton.enabled = true;
    tilesButton.onMouseDown = toggleTiles;
    hud.add( tilesButton, "right", "bottom", { "x": -174, "y": -30 } );

    var helpButton = new HUD.Element( "helpButton", drawIcon, 64, 64 );
    helpButton.icon = new Image();
    helpButton.icon.src = "assets/images/hud/help_large.png";
    helpButton.onMouseDown = showHelp;
    hud.add( helpButton, "right", "bottom", { "x": -246, "y": -30 } );

    // createInventoryHUD( 4 );
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

    var topDownBtn = new HUD.Element( "camera_topDown", drawHelicamButton, 22, 22 );
    topDownBtn.icon = new Image();
    topDownBtn.icon.src = "assets/images/hud/camera_topdown.png";
    topDownBtn.mode = "topDown";
    topDownBtn.enabled = true;
    topDownBtn.onMouseDown = selectCameraMode;
    hud.add( topDownBtn, "right", "top", { "x": -35, "y": 80 } );

}

function createCommsDisplay() {

    var commsElement = new HUD.Element( "comms", drawComms, 100, 150 );
    hud.add( commsElement, "left", "bottom", { "x": 10, "y": -10 } );

    var background = new Image();
    background.src = "assets/images/hud/communication_bg.png";
    background.onload = ( function() { commsElement.background = background; } );

    var frame = new Image();
    frame.src = "assets/images/hud/communication_frame.png";
    frame.onload = ( function() { commsElement.frame = frame; } );

    commsElement.characterImage = new Image();
    commsElement.interval = 0;
    commsElement.transitionHandle = null;

}

function addImageToCommsDisplay( imagePath ) {
    var comms = hud.elements.comms;
    if ( comms ) {
        comms.characterImage.src = imagePath;
        if ( comms.transitionHandle ) {
            clearInterval( comms.transitionHandle );
            comms.transitionHandle = null;
        } else {
            comms.interval = 0;
            comms.transitionHandle = setInterval( function() {
                comms.interval += 0.1;
                if ( comms.interval >= 1 ) {
                    comms.interval = 1;
                    clearInterval( comms.transitionHandle );
                    comms.transitionHandle = null;
                }
            }, 30 );
        }
    }
}

function removeImageFromCommsDisplay() {
    var comms = hud.elements.comms;
    if ( comms ) {
        if ( comms.transitionHandle ) {
            clearInterval( comms.transitionHandle );
            comms.transitionHandle = null;
        }        
        comms.interval = 1;
        comms.transitionHandle = setInterval( function() {
            comms.interval -= 0.1;
            if ( comms.interval <= 0 ) {
                comms.interval = 0;
                comms.characterImage.src = "";
                clearInterval( comms.transitionHandle );
                comms.transitionHandle = null;
            }
        }, 30 );
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

function createBlocklyStatus() {
    var status = new HUD.Element( "blocklyStatus", drawBlocklyStatus, 300, 100 );
    status.blockStack = [];
    status.blockImages = {};
    status.defaultDraw = status.draw;
    status.lastUpdateTime = vwf_view.kernel.time();
    status.updateIntervalTime = 0.01;
    status.index = -1;
    status.topOffset = 0;
    status.nextTopOffset = 0;
    status.range = 3;
    status.runIcon = new Image();
    status.runIcon.src = "assets/images/blockly_ui/blockly_indicator.png";
    hud.add( status, "right", "bottom", { "x": 130, "y": -60 } );
    addBlockToImageList( "moveForward", "assets/images/hud/blockly_move_forward.png" );
    addBlockToImageList( "turnLeft", "assets/images/hud/blockly_turn_left.png" );
    addBlockToImageList( "turnRight", "assets/images/hud/blockly_turn_right.png" );
    addBlockToImageList( "repeatTimes", "assets/images/hud/blockly_repeat_times.png" );
    addBlockToImageList( "number", "assets/images/hud/blockly_number.png" );
}

function addBlockToImageList( name, imageSrc ) {
    var status = hud.elements.blocklyStatus;
    if ( status ) {
        status.blockImages[ name ] = new Image();
        status.blockImages[ name ].src = imageSrc;
    }
}

function populateBlockStack() {
    var status = hud.elements.blocklyStatus;
    var workspace = Blockly.getMainWorkspace();
    if ( status && workspace ) {
        status.blockStack = [];
        var blocks = workspace.getTopBlocks()[ 0 ];
        addBlockToStackList( blocks );
    }
}

function addBlockToStackList( topBlock, loopCounts ) {
    loopCounts = loopCounts || [];
    var status = hud.elements.blocklyStatus;
    var currentBlock = topBlock;
    while ( currentBlock ) {
        var blockType = currentBlock.type;
        var blockID = currentBlock.id;
        var blockData = {
            "name": blockType,
            "id": parseInt( blockID ),
            "alpha": 0,
            "loopCounts": loopCounts.slice( 0 )
        };        

        if ( blockType === "rover_moveForward" ) {
            blockData.name = "moveForward";
            status.blockStack.push( blockData );
        } else if ( blockType === "rover_turn" ) {
            blockData.name = currentBlock.getFieldValue( "DIR" );
            status.blockStack.push( blockData );            
        } else if ( blockType === "controls_repeat_extended" ) {
            blockData.name = "repeatTimes";
            status.blockStack.push( blockData );

            var firstBlockInLoop = currentBlock.getInput( "DO" ).connection.targetConnection.sourceBlock_;
            var loopTimes = parseInt( Blockly.JavaScript.valueToCode( currentBlock, 'TIMES', Blockly.JavaScript.ORDER_ASSIGNMENT ) || '0' ) || 0;
            var counts = loopCounts.slice( 0 );
            for ( var i = loopTimes - 1; i >= 0; i-- ) {
                counts[ loopCounts.length ] = i;
                addBlockToStackList( firstBlockInLoop, counts );
            }
        } 

        currentBlock = currentBlock.getNextBlock();
    }
}

function createStatusText() {
    var width = 400;
    var height = 200;
    var status = new HUD.Element( "status", drawStatus, width, height );
    status.stackLength = 4;
    status.lastMessage = "";
    status.duplicateCount = 1;
    status.messages = [];
    status.fontStyle = "16px Arial Black";
    status.fontSize = parseInt( status.fontStyle ) || 16;
    status.defaultDraw = drawStatus;
    status.lastUpdateTime = vwf_view.kernel.time();
    status.updateIntervalTime = 0.01;
    hud.add( status, "center", "bottom", { "x" : width / 2, "y" : 60 } );
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

    if ( this.characterImage && this.characterImage.src ) {
        context.save();
        var opening = this.height * this.interval;
        context.beginPath();
        context.rect( position.x, position.y + ( ( this.height - opening ) / 2 ), this.width, opening );
        context.clip();
        context.drawImage( this.characterImage, position.x, position.y );
        context.restore();
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

function drawBlocklyStatus( context, position ) {
    if ( this.blockImages && this.blockStack ) {
        var lastHeight = 0;
        var offsetX = 0;
        // Draw all blocks within the range of the selected block
        for ( var i = 0; i < this.index + this.range / 2; i++ ) {
            var blockData = this.blockStack[ i ];
            if ( blockData ) {
                var alpha = blockData.alpha;
                var block = this.blockImages[ blockData.name ];
                var loopCounts = blockData.loopCounts;
                if ( alpha && block && Math.abs( i - this.index ) < this.range ) {
                    context.globalAlpha = alpha;
                    context.drawImage( block, position.x, 
                                       position.y - ( this.topOffset - lastHeight ) );
                    if ( this.index === i && loopCounts ) {
                        var numBlock = this.blockImages[ "number" ];
                        for ( var j = 0; j < loopCounts.length; j++ ) {
                            if ( loopCounts[ j ] > 0 ) {
                                offsetX += numBlock.width;
                                var posY = position.y - ( this.topOffset - lastHeight - 8 );
                                context.drawImage( numBlock, position.x - offsetX, posY );
                                context.textBaseline = "top";
                                context.font = '15px sans-serif';
                                context.fillStyle = "rgb( 0, 0, 0 )";
                                context.fillText( loopCounts[ j ], position.x - offsetX + 20, posY + 8 );
                            }
                        }
                    }
                }
                lastHeight += block.height || 0;
            }
        }       
        context.globalAlpha = 1;
        if ( this.index > -1 ) {
            offsetX += this.runIcon.width;
            var offsetY = this.runIcon.height * 1.5;
            context.drawImage( this.runIcon, position.x - offsetX, position.y - offsetY );
        }
    }
}

function drawHelicamButton( context, position ) {
    if ( this.icon ) {
        if ( this.enabled ) {
            context.drawImage( this.icon, position.x, position.y );
        } else {
            context.globalAlpha = 0.25;
            context.drawImage( this.icon, position.x, position.y );
            context.globalAlpha = 1;
        }
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

function drawStatus( context, position ) {
    context.font = this.fontStyle;
    context.fillStyle = "rgb( 255, 255, 255 )";
    context.strokeStyle = "rgb( 0, 0, 0 )";
    context.textAlign = "center";
    context.lineWidth = 4;
    context.miterLimit = 2;
    for ( var i = 0; i < this.messages.length; i++ ) {
        var message = this.messages[ i ];
        if ( message ) {
            context.globalAlpha = message.alpha;
            context.strokeText( message.text, position.x, position.y - message.offset );
            context.fillText( message.text, position.x, position.y - message.offset );
        }
    }
    context.globalAlpha = 1;

    // Slowly fade out the messages when nothing is being pushed
    var time = vwf_view.kernel.time();
    if ( time - this.lastUpdateTime > this.updateIntervalTime ) {
        this.lastUpdateTime = time;

        // Loop backwards to mitigate splicing
        for ( var i = this.messages.length - 1; i >= 0 ; i-- ) {
            var message = this.messages[ i ];
            if ( message ) {
                message.alpha -= 0.01;
                if ( message.alpha <= 0 ) {
                    this.messages.splice( i, 1 );
                    if ( this.messages.length <= 0 ) {
                        this.lastMessage = "";
                    }
                }
            }
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
    if ( !this.enabled ) {
        return;
    }
    var cameraNode = vwf_view.kernel.find( "", "//camera" )[ 0 ];
    var graphID = vwf_view.kernel.find( "", "//blocklyGraph" )[ 0 ];

    if ( cameraNode && graphID ) {
        vwf_view.kernel.callMethod( graphID, "toggleGraphVisibility" );
        vwf_view.kernel.setProperty( cameraNode, "pointOfView", "topDown" );
        isVisible.graph = !isVisible.graph;

        vwf_view.kernel.fireEvent( vwf_view.kernel.application(),
                "toggledGraph",
                [] );
    }
}

function switchTarget( event ) {
    var cameraNode = vwf_view.kernel.find( "", "//camera" )[ 0 ];
    vwf_view.kernel.setProperty( cameraNode, "targetPath", this.path );
}

function selectCameraMode( event ) {
    if ( this.mode !== "topDown" ) {
        if ( isVisible.graph ) {
            toggleGraphDisplay.bind( hud.elements.graphButton )( event );
        }
        if ( isVisible.tiles ) {
            toggleTiles.bind( hud.elements.tilesButton )( event );
        }
    } else if ( !this.enabled ) {
        return;
    }

    var cameraNode = vwf_view.kernel.find( "", "//camera" )[ 0 ];
    vwf_view.kernel.setProperty( cameraNode, "pointOfView", this.mode );

    if ( this.mode === "topDown" ){
        vwf_view.kernel.fireEvent( vwf_view.kernel.application(),
            "toggledHelicam",
            [] );
        
    }
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

function toggleTiles( event ) {
    if ( !this.enabled ) {
        return;
    }
    var cameraNode = vwf_view.kernel.find( "", "//camera" )[ 0 ];
    var graphTilesID = vwf_view.kernel.find( "", "//gridTileGraph" )[ 0 ];
    if ( cameraNode && graphTilesID ) {
        vwf_view.kernel.callMethod( graphTilesID, "toggleTileVisibility" );
        vwf_view.kernel.setProperty( cameraNode, "pointOfView", "topDown" );
        isVisible.tiles = !isVisible.tiles;

        vwf_view.kernel.fireEvent( vwf_view.kernel.application(),
            "toggledTiles",
            [] );
    }
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

function setBlocklyAlphas() {
    var statusElem = hud.elements.blocklyStatus;
    if ( statusElem ) {
        // Blocks within range of the selected block are given 0.5 opacity
        for ( var i = 0; i < statusElem.blockStack.length; i++ ) {
            var alpha = statusElem.blockStack[ i ].alpha;
            if ( i === statusElem.index ) {
                alpha = 1;
            } else if ( Math.abs( statusElem.index - i ) < statusElem.range / 2 ) {
                alpha = 0.5;
            } else {
                alpha = 0;
            }
            statusElem.blockStack[ i ].alpha = alpha;
        }
    }
}

function pushNextBlocklyStatus( id ) {
    var statusElem = hud.elements.blocklyStatus;

    if ( statusElem ) {
        statusElem.index++;
        var blockName = statusElem.blockStack[ statusElem.index ].name;
        var blockID = statusElem.blockStack[ statusElem.index ].id;
        var block = statusElem.blockImages[ blockName ];
        if ( block && blockID === id ) {

            // Check if block pushes are outrunning the animation
            if ( statusElem.draw === statusElem.defaultDraw ) {
                statusElem.nextTopOffset = statusElem.topOffset + block.height;
                var interval = statusElem.range;
                var offsetIncrement = block.height / interval;
                var alphaIncrement = 0.5 / interval;

                statusElem.draw = ( function( context, position ) {
                    var time = vwf_view.kernel.time();
                    if ( time - this.lastUpdateTime > this.updateIntervalTime ) {
                        this.lastUpdateTime = time;
                        this.topOffset += offsetIncrement;
                        for ( var i = 0; i < this.blockStack.length; i++ ) {
                            var alpha = this.blockStack[ i ].alpha;
                            if ( i < this.index ) {
                                alpha -= alphaIncrement;
                                alpha = alpha < 0 ? 0 : alpha;
                            } else if ( i > this.index ) {
                                alpha += alphaIncrement;
                            } else {
                                alpha = 1;
                            }
                            this.blockStack[ i ].alpha = alpha;
                        }
                    }

                    if ( this.topOffset >= this.nextTopOffset ) {
                        this.topOffset = this.nextTopOffset;
                        this.draw = this.defaultDraw;
                        setBlocklyAlphas();
                    }

                    this.defaultDraw( context, position );
                } );

            // If they are, set the top right away and don't animate
            } else {
                setBlocklyAlphas();
                statusElem.draw = statusElem.defaultDraw;
                statusElem.topOffset = statusElem.nextTopOffset + block.height;
            }

            
        }
    }
}

function clearBlocklyStatus() {
    if ( hud ) {
        var statusElem = hud.elements.blocklyStatus;
        if ( statusElem ) {
            statusElem.blockStack = [];
            statusElem.index = -1;
            statusElem.topOffset = 0;
            statusElem.nextTopOffset = 0;
        }         
    }
}

function clearStatus() {
    var status = hud.elements.status;
    if ( status ) {
        status.messages = [];
        status.lastMessage = "";
    }
}

function setStatusDefaults() {
    var status = hud.elements.status;
    while ( status.messages.length > 4 ) {
        status.messages.pop();
    }
    for ( var i = 0; i < status.messages.length; i++ ) {
        var message = status.messages[ i ];
        message.alpha = 1 - ( 1 / status.stackLength ) * i;
        message.offset = status.fontSize * i;
    }
}

function pushStatus( message ) {
    var status = hud.elements.status;
    if ( status ) {

        // Handle duplicate status messages
        if ( message === status.lastMessage ) {
            status.duplicateCount++;
            message += " x" + status.duplicateCount;
        } else {
            status.lastMessage = message;
            status.duplicateCount = 1;
        }

        var messageObj = {
            "alpha": 1,
            "text": message,
            "offset": -status.fontSize
        }
        status.messages.unshift( messageObj );

        if ( status.draw === status.defaultDraw ) {

            // Push all the other statuses up and animate
            var interval = 3;
            var addedOffset = 0;
            status.draw = ( function( context, position ) {
                var time = vwf_view.kernel.time();
                if ( time - this.lastUpdateTime > this.updateIntervalTime ) {
                    this.lastUpdateTime = time;
                    for ( var i = 0; i < this.messages.length; i++ ) {
                        this.messages[ i ].offset += this.fontSize / interval;
                        this.messages[ i ].alpha -= 1 / this.stackLength / interval;
                    }
                    addedOffset += this.fontSize / interval;

                    if ( addedOffset >= this.fontSize ) {
                        this.draw = this.defaultDraw;
                        setStatusDefaults();
                    }
                }

                // Draw all statuses
                context.font = this.fontStyle;
                context.fillStyle = "rgb( 255, 255, 255 )";
                context.strokeStyle = "rgb( 0, 0, 0 )";
                context.textAlign = "center";
                context.lineWidth = 4;
                context.miterLimit = 2;
                for ( var i = 0; i < this.messages.length; i++ ) {
                    var message = this.messages[ i ];
                    if ( message ) {
                        context.globalAlpha = message.alpha;
                        context.strokeText( message.text, position.x, position.y - message.offset );
                        context.fillText( message.text, position.x, position.y - message.offset );
                    }
                }
                context.globalAlpha = 1;
            } );
        } else {

            // If pushes are faster than the animation, don't animate
            setStatusDefaults();
            status.draw = status.defaultDraw;
        }
    }
}

function setHelicamButtonsEnabled( value ) {
    hud.elements[ "graphButton" ].enabled = value;
    hud.elements[ "tilesButton" ].enabled = value;
    hud.elements[ "camera_topDown" ].enabled = value;
}

//@ sourceURL=source/hudInstructions.js