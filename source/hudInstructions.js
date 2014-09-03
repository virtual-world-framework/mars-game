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

function createHUD() {
    createBlocklyStatus();
    createAlertText();
    createCommsDisplay();
    createRoverElement();
    createCameraSelector();

    var blocklyButton = new HUD.Element( "blocklyButton", drawIcon, 64, 64 );
    blocklyButton.icon = new Image();
    blocklyButton.icon.src = "assets/images/hud/blockly_large.png";
    blocklyButton.onMouseDown = clickBlockly;
    hud.add( blocklyButton, "right", "bottom", { "x": -32, "y": -30 } );

    var graphButton = new HUD.Element( "graphButton", drawIcon, 64, 64 );
    graphButton.icon = new Image();
    graphButton.icon.src = "assets/images/hud/graph_display.png";
    graphButton.onMouseDown = toggleGraphDisplay;
    hud.add( graphButton, "right", "bottom", { "x": -104, "y": -30 } );

    var tilesButton = new HUD.Element( "tilesButton", drawIcon, 64, 64 );
    tilesButton.icon = new Image();
    tilesButton.icon.src = "assets/images/hud/tiles_button.png";
    tilesButton.onMouseDown = toggleTiles;
    hud.add( tilesButton, "right", "bottom", { "x": -176, "y": -30 } );

    var optionsButton = new HUD.Element( "optionsButton", drawIcon, 64, 64 );
    optionsButton.icon = new Image();
    optionsButton.icon.src = "assets/images/hud/options_button.png";
    optionsButton.onMouseDown = openPauseMenu;
    hud.add( optionsButton, "right", "bottom", { "x": -248, "y": -30 } );

    var objective = new HUD.Element( "objective", drawObjective, 32, 32 );
    objective.icon = new Image();
    objective.icon.src = "assets/images/hud/objective_indicator.png";
    objective.text = "";
    objective.blinkTicks = 0;
    objective.blinkInterval = 0.5;
    objective.lastBlinkTime = 0;
    objective.opacity = 1;
    hud.add( objective, "left", "bottom", { "x": 30, "y": -172 } );

    hud.elementPreDraw = drawEnabled;
    hud.elementPostDraw = drawEnabledPost;
}

function createRoverElement() {
    var batteryMeter = new HUD.Element( "batteryMeter", drawBatteryMeter, 128, 128 );
    batteryMeter.battery = 100;
    batteryMeter.maxBattery = 100;
    batteryMeter.path = "/player/rover";
    hud.add( batteryMeter, "left", "top", { "x": 30, "y": 30 } );

    batteryMeter.frame = new Image();
    batteryMeter.frame.src = "assets/images/hud/rover_frame.png";
    batteryMeter.portrait = new Image();
    batteryMeter.portrait.src = "assets/images/hud/rover_portrait.png";
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
    selector.onMouseOver = fireElementMouseOver;
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
    commsElement.direction = 0;
}

function addImageToCommsDisplay( imagePath ) {
    var comms = hud.elements.comms;
    if ( comms ) {
        comms.characterImage.src = imagePath;
        comms.interval = 0;
        comms.direction = 1;
    }
}

function removeImageFromCommsDisplay() {
    var comms = hud.elements.comms;
    if ( comms ) {
        comms.interval = 1;
        comms.direction = -1;
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
    status.offsetIncrement = 0;
    status.range = 3;
    status.runIcon = new Image();
    status.runIcon.src = "assets/images/blockly_ui/blockly_indicator.png";
    status.numberAppendix = new Image();
    status.numberAppendix.src = "assets/images/blockly_ui/number_appendix.png";
    hud.add( status, "right", "bottom", { "x": 130, "y": -60 } );
    addBlockToImageList( "moveForward", "" );
    addBlockToImageList( "turnLeft", "" );
    addBlockToImageList( "turnRight", "" );
    addBlockToImageList( "repeatTimes", "" );
    addBlockToImageList( "number", "" );
    addBlockToImageList( "repeatUntil", "" );
    addBlockToImageList( "repeatWhile", "" );
    addBlockToImageList( "sensor", "" );
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
        status.blockStack.length = 0;
        var blocks = workspace.getTopBlocks()[ 0 ];
        addBlockToStackList( blocks );
    }
}

function addBlockToStackList( topBlock, maxLoopIndex ) {
    var status = hud.elements.blocklyStatus;
    var currentBlock = topBlock;
    while ( currentBlock ) {
        var blockType = currentBlock.type;
        var blockID = currentBlock.id;
        var blockData = {
            "name": blockType,
            "id": parseInt( blockID ),
            "alpha": 0,
            "loopIndex": maxLoopIndex > 0 ? 0 : -1,
            "maxLoopIndex": maxLoopIndex,
            "topOffset": 0
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
            var loopConnection = currentBlock.getInput( "DO" ).connection.targetConnection;
            if ( loopConnection ) {
                var firstBlockInLoop = loopConnection.sourceBlock_;
                var loopTimes = parseInt( Blockly.JavaScript.valueToCode( currentBlock, 'TIMES', Blockly.JavaScript.ORDER_ASSIGNMENT ) || '0' );
                addBlockToStackList( firstBlockInLoop, loopTimes );
            }
        } else if ( blockType === "controls_whileUntil" ) {
            blockData.name = "repeatUntil";
            status.blockStack.push( blockData );
            var loopConnection = currentBlock.getInput( "DO" ).connection.targetConnection;
            if ( loopConnection ) {
                var firstBlockInLoop = currentBlock.getInput( "DO" ).connection.targetConnection.sourceBlock_;
                addBlockToStackList( firstBlockInLoop );
            }
        } else if ( blockType === "controls_sensor" ) {
            blockData.name = "sensor";
            status.blockStack.push( blockData );
        }
        currentBlock = currentBlock.getNextBlock();
    }
}

function getBlockDataSlotFromId( id ) {
    var status = hud.elements.blocklyStatus;
    if ( status ) {
        for ( var i = 0; i < status.blockStack.length; i++ ) {
            if ( status.blockStack[ i ].id === id ) {
                return i;
            }
        }
    }
    return undefined;
}

function createAlertText() {
    var width = 0;
    var height = 50;
    var alert = new HUD.Element( "alert", drawLogger, width, height );
    alert.stackLength = loggerNodes[ alertNodeID ].logger_maxLogs;
    alert.messages = [];
    alert.lastMessage = "";
    alert.fontSize = 24;
    alert.fontStyle = alert.fontSize + "px Arial Black";
    alert.defaultDraw = drawLogger;
    alert.setDefaults = setAlertDefaults;
    alert.lastUpdateTime = Date.now() / 1000;
    alert.addedOffset;
    alert.updateIntervalTime = 0.01;
    alert.persistTimer = 3;
    hud.add( alert, "center", "top", { "x" : 0, "y": 100 } );
}

// === Draw Functions ===

function drawEnabled( context, element ) {
    context.globalAlpha = element.enabled ? 1 : 0.5;
}

function drawEnabledPost( context, element ) {
    context.globalAlpha = 1;
}

function drawBatteryMeter( context, position ) {
    var battery = this.battery;
    var maxBattery = this.maxBattery;
    var arcWidth = ( this.height + this.width ) / 4 ;
    var centerX = position.x + this.width / 2;
    var centerY = position.y + this.height / 2;
    var radius = ( this.width + this.height ) / 4 - arcWidth;
    var start = Math.PI * 1.5;
    var end = start - battery / maxBattery * Math.PI * 2;

    context.beginPath();
    context.arc( centerX, centerY, arcWidth, 0, 2 * Math.PI, false );
    context.fillStyle = "rgba(50,90,150,0.5)";
    context.fill();

    context.beginPath();
    context.arc( centerX, centerY, arcWidth / 2, start, end, true );
    context.lineWidth = arcWidth - 1;
    context.strokeStyle = "rgb(50,130,255)";
    context.stroke();

    if ( this.portrait ) {
        context.drawImage( this.portrait, centerX - this.portrait.width / 2, centerY - this.portrait.height / 2 );
    }
    if ( this.frame ) {
        context.drawImage( this.frame, position.x, position.y );
    }

    context.textBaseline = "top";
    context.font = 'bold 24px Arial';
    context.fillStyle = "rgb(255,255,255)";
    context.textAlign = "left";
    context.fillText( Math.round(battery), position.x + this.width + 3, position.y - 1 );
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
        this.interval += 0.1 * this.direction;
        if ( this.interval > 1 ) {
            this.interval = 1;
        } else if ( this.interval <= 0 && this.direction === -1 ) {
            this.interval = 0;
            this.characterImage.src = "";
        }
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

function drawBlocklyStatus( context, position ) {}

function drawBlocklyStatusAnimating( context, position ) {}

function drawIcon( context, position ) {
    if ( this.icon ) {
        context.drawImage( this.icon, position.x, position.y );
    }

}

function drawObjective( context, position ) {
    var time = vwf_view.kernel.time();
    var timeSinceLastBlink = time - this.lastBlinkTime;
    if ( this.text && this.text.length > 0 ) {
        if ( this.icon ) {
            if ( this.blinkTicks > 0 && timeSinceLastBlink >= this.blinkInterval ) {
                this.opacity = this.blinkTicks % 2 ? 1 : 0.5;
                this.blinkTicks--;
                this.lastBlinkTime = time;
            }
            context.globalAlpha = this.opacity;
            context.drawImage( this.icon, position.x, position.y );
            context.globalAlpha = 1;
        }
        context.font = '16px Arial';
        context.fillStyle = "rgb( 224, 255, 100 )";
        context.strokeStyle = "rgb( 0, 0, 0 )";
        context.lineWidth = 3;
        context.textAlign = "left";
        context.textBaseline = "top";
        context.strokeText( this.text, position.x + 40, position.y + 6 );
        context.fillText( this.text, position.x + 40, position.y + 6 );
    }
}

function drawLogger( context, position ) {
    var message;
    context.font = this.fontStyle;
    context.fillStyle = "rgb( 255, 255, 255 )";
    context.strokeStyle = "rgb( 0, 0, 0 )";
    context.textAlign = "center";
    context.lineWidth = 4;
    context.miterLimit = 2;
    for ( var i = 0; i < this.messages.length; i++ ) {
        message = this.messages[ i ];
        if ( message ) {
            context.globalAlpha = message.alpha;
            context.strokeText( message.text, position.x, position.y - message.offset );
            context.fillText( message.text, position.x, position.y - message.offset );
        }
    }
    context.globalAlpha = 1;

    // Slowly fade out the messages when nothing is being pushed, after persistTimer seconds
    var time = Date.now() / 1000;
    var delta = time - this.lastUpdateTime;
    this.lastUpdateTime = time;

    if ( this.persistTimer === undefined || this.persistTimer <= 0 ) {
        // Loop backwards to mitigate element removal
        for ( var i = this.messages.length - 1; i >= 0 ; i-- ) {
            var message = this.messages[ i ];
            if ( message ) {
                message.alpha -= delta;
                if ( message.alpha <= 0 ) {
                    removeArrayElement( this.messages, i );
                    if ( this.messages.length <= 0 && this.lastMessage ) {
                        this.lastMessage = "";
                    }
                }
            }
        }
    } else {
        this.persistTimer -= delta;
    }
}

function drawLoggerAnimating( context, position ) {
    var interval = 3;
    var time = Date.now() / 1000;
    var i;
    if ( time - this.lastUpdateTime > this.updateIntervalTime ) {
        this.lastUpdateTime = time;
        for ( i = 0; i < this.messages.length; i++ ) {
            this.messages[ i ].offset += this.fontSize / interval;
            this.messages[ i ].alpha -= 1 / this.stackLength / interval;
        }
        this.addedOffset += this.fontSize / interval;

        if ( this.addedOffset >= this.fontSize ) {
            this.draw = this.defaultDraw;
            this.setDefaults();
        }
    }

    // Draw all statuses
    context.font = this.fontStyle;
    context.fillStyle = "rgb( 255, 255, 255 )";
    context.strokeStyle = "rgb( 0, 0, 0 )";
    context.textAlign = "center";
    context.lineWidth = 4;
    context.miterLimit = 2;
    for ( i = 0; i < this.messages.length; i++ ) {
        var message = this.messages[ i ];
        if ( message ) {
            context.globalAlpha = message.alpha;
            context.strokeText( message.text, position.x, position.y - message.offset );
            context.fillText( message.text, position.x, position.y - message.offset );
        }
    }
    context.globalAlpha = 1;
}

// === HUD Event Handlers ===

function clickBlockly( event ) {
    var sceneID = vwf_view.kernel.application();
    var nodeID = currentBlocklyNodeID || vwf_view.kernel.find( "", "/player/rover" )[ 0 ];
    if ( sceneID !== undefined && nodeID !== undefined ) {
        vwf_view.kernel.setProperty( sceneID, "blockly_activeNodeID", nodeID );
    }
}

function selectCameraMode( event ) {
    var cameraNode = vwf_view.kernel.find( "", "//camera" )[ 0 ];
    vwf_view.kernel.setProperty( cameraNode, "pointOfView", this.mode );
    
    vwf_view.kernel.fireEvent( vwf_view.kernel.application(), "toggledCamera", [ this.mode ] );
    
    if ( this.mode === "topDown" ){
        vwf_view.kernel.fireEvent( vwf_view.kernel.application(), "toggledHelicam" );
    }
}

function toggleGraphDisplay( event ) {
    var sceneID = vwf_view.kernel.application();
    vwf_view.kernel.callMethod( sceneID, "displayGraph", [ !graphIsVisible ] );
}

function toggleTiles( event ) {
    var sceneID = vwf_view.kernel.application();
    vwf_view.kernel.callMethod( sceneID, "displayTiles", [ !tilesAreVisible ] );
}

// Other functions

function blinkElement( elementID ) {
    var el = hud.elements[ elementID ];
    if ( el && !el.isBlinking ) {
        el.normalDrawFunction = el.draw;
        el.lastBlinkTime = vwf_view.kernel.time();
        el.blinkInterval = 0.25;
        el.blinkDuration = 0.25;
        el.isBlinking = true;
        el.draw = drawBlink;
    }
}

function drawBlink( context, position ) {
    var time = vwf_view.kernel.time();
    if ( time  - this.lastBlinkTime > this.blinkInterval ) {
        context.globalAlpha = 0.5;
        if ( time - this.lastBlinkTime > this.blinkInterval + this.blinkDuration ) {
            this.lastBlinkTime = time;
        }
    }
    this.normalDrawFunction( context, position );
    context.globalAlpha = 1;
}

function stopElementBlinking( elementID ) {
    var el = hud.elements[ elementID ];
    if ( el.isBlinking ) {
        el.draw = el.normalDrawFunction;
        el.isBlinking = false;
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
        var index = getBlockDataSlotFromId( id );
        var blockData = statusElem.blockStack[ index ];
        var blockName = blockData.name;
        var block = statusElem.blockImages[ blockName ];
        if ( block ) {

            // If the index doesn't match, then we're looping back
            if ( index !== statusElem.index ) {             
                statusElem.index = index;
                statusElem.topOffset = blockData.topOffset;
                setBlocklyAlphas();
                statusElem.draw = statusElem.defaultDraw;                

            } else {

                // Check if block pushes are outrunning the animation
                if ( statusElem.draw === statusElem.defaultDraw ) {
                    statusElem.nextTopOffset = statusElem.topOffset + block.height;
                    statusElem.offsetIncrement = block.height / statusElem.range
                    statusElem.draw = drawBlocklyStatusAnimating;
                    blockData.topOffset = statusElem.nextTopOffset;

                // If they are, set the top right away and don't animate
                } else {
                    setBlocklyAlphas();
                    statusElem.draw = statusElem.defaultDraw;
                    statusElem.topOffset = statusElem.nextTopOffset + block.height;
                    blockData.topOffset = statusElem.topOffset;
                }
            }

            // Check if the block is associated with a loop count
            // and send to the ui display
            if ( blockData.maxLoopIndex ) {
                blockData.loopIndex++;
                if ( blockData.loopIndex > blockData.maxLoopIndex ) {
                    blockData.loopIndex = 1;
                }  
                var loopIndex = blockData.loopIndex;          
                if ( !isNaN( loopIndex ) && loopIndex >= 1 ) {
                    showBlocklyLoopCount( loopIndex, blockData.maxLoopIndex );
                } else {
                    hideBlocklyLoopCount();
                }
            } else {
                hideBlocklyLoopCount();
            }

        } else {
            statusElem.index--;
        }
        
    }
}

function clearBlocklyStatus() {
    if ( hud ) {
        var statusElem = hud.elements.blocklyStatus;
        if ( statusElem ) {
            statusElem.blockStack.length = 0;
            statusElem.index = -1;
            statusElem.topOffset = 0;
            statusElem.nextTopOffset = 0;
        }         
    }
}

function clearAlert() {
    if ( hud ) {
        var alert = hud.elements.alert;
        if ( alert ) {
            alert.messages.length = 0;
            alert.lastMessage = "";
        }
    }
}

function setAlertDefaults() {
    var alert = hud.elements.alert;
    while ( alert.messages.length > alert.stackLength ) {
        alert.messages.length--;
    }
    for ( var i = 0; i < alert.messages.length; i++ ) {
        var message = alert.messages[ i ];
        message.alpha = 1 - ( 1 / alert.stackLength ) * i;
        message.offset = alert.fontSize * i;
    }
}

function pushAlert( message ) {
    var alert = hud.elements.alert;
    if ( alert ) {
        if ( message === alert.lastMessage ) {
            alert.persistTimer = 3;
            setAlertDefaults();
        } else {
            alert.lastMessage = message;
            var messageObj = {
                "alpha": 1,
                "text": message,
                "offset": -alert.fontSize
            }
            alert.messages.unshift( messageObj );
            alert.persistTimer = 3;
            if ( alert.draw === alert.defaultDraw ) {

                // Push all the other statuses up and animate
                alert.addedOffset = 0;
                alert.draw = drawLoggerAnimating;
            } else {

                // If pushes are faster than the animation, don't animate
                setAlertDefaults();
                alert.draw = alert.defaultDraw;
            }
        }
    }
}

function setHUDElementProperty( element, property, value ) {
    hud.elements[ element ][ property ] = value;
}

function clearHUDEffects() {
    var els = hud.elements;
    for ( var id in els ) {
        if ( els[ id ].isBlinking ) {
            stopElementBlinking( id );
        }
    }
}

function setNewObjective( text ) {
    hud.elements.objective.text = text;
    hud.elements.objective.blinkTicks = 10;
}

function enableAllHUDElements() {
    if ( !hud ) {
        return;
    }
    
    var els = hud.elements;
    for ( var el in els ) {
        els[ el ].enabled = true;
    }
}

function fireElementMouseOver() {
    vwf_view.kernel.fireEvent( vwf_view.kernel.application(), "mouseOverHUD", [ this.id ] );
}

//@ sourceURL=source/hudInstructions.js