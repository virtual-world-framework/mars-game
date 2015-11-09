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

var ramBarCount = document.createElement( "div" );
var ramBar = document.createElement( "div" );
var currentRam = document.createElement( "div" );
var startBlocklyButton = document.getElementById( "runButton" );
var blocklySpeedButton = document.createElement( "div" );
var blocklyResetButton = document.createElement( "div" );

function setUpBlocklyPeripherals() {

    //centerBlocklyWindow();

    var blocklyFooter = document.createElement( "div" );
    var blocklyCloseBtn = document.createElement( "div" );
    var blocklyHandle = document.createElement( "div" );
    var blocklyScrollDiv = document.createElement( "div" );
    var indicator = document.createElement( "div" );
    var indicatorCount = document.createElement( "div" );
    var procedureIndicator = document.createElement( "div" );
    var indicatorHighlighter = document.createElement( "div" );

    var toolboxDivs =  document.getElementsByClassName( "blocklyToolboxDiv" );
    var blocklyToolboxDiv = toolboxDivs[0];

    blocklyFooter.id = "blocklyFooter";
    blocklyHandle.id = "blocklyHandle";
    blocklyScrollDiv.id = "blocklyScrollDiv";
    indicator.id = "blocklyIndicator";
    indicatorCount.id = "blocklyIndicatorCount";
    indicatorCount.innerHTML = "";
    procedureIndicator.id = "blocklyProcedureIndicator";
    startBlocklyButton.id = "startBlockly";
    blocklySpeedButton.id = "blocklySpeedButton";
    blocklyResetButton.id = "blocklyResetButton";
    indicatorHighlighter.id = "blocklyHighlighter";

    indicator.appendChild( indicatorCount );
    $( "#blocklyWrapper-top" ).append( blocklyHandle )
    $( "#blocklyWrapper" ).append( indicatorHighlighter );
    $( "#blocklyWrapper" ).append( blocklyToolboxDiv );
    $( "#blocklyWrapper" ).append( indicator );
    $( "#blocklyWrapper" ).append( procedureIndicator );
    // $( "#blocklyWrapper" ).draggable( {
    //     handle: "div#blocklyHandle",
    //     scroll: false,
    //     drag: function( event, element ) {
    //         $( ".blocklyWidgetDiv" ).css( "display", "none" );
    //         var width = element.helper.context.offsetWidth;
    //         var top = 0;
    //         var bottom = window.innerHeight - blocklyHandle.offsetHeight;
    //         var left = width * -0.5;
    //         var right = window.innerWidth - width * 0.5;

    //         if ( element.position.left < left ) {
    //             element.position.left = left;
    //         } else if ( element.position.left > right ) {
    //             element.position.left = right;
    //         }
    //         if ( element.position.top < top ) {
    //             element.position.top = top;
    //         } else if ( element.position.top > bottom ) {
    //             element.position.top = bottom;
    //         }
    //     }
    // } );
    // $( "#blocklyWrapper" ).draggable( {
    //     handle: "div#blocklyHandle",
    //     scroll: false,
    //     containment: "window",
    //     drag: function( event, element ) {
    //          $( ".blocklyWidgetDiv" ).css( "display", "none" );
    //          blocklyResized();
    //     }
    // } );
    // $( "#blocklyWrapper" ).resizable({
    //     resize: function( event, ui ) {
    //         console.log('resize');
    //         blocklyResized();
    //     },
    //     stop: function( event, ui ) {
    //         console.log('resizeend');
    //         blocklyResized();
    //     }
    // });

    ramBar.id = "ramBar";
    ramBarCount.id = "ramBarCount";
    currentRam.id = "currentRam";
    ramBarCount.innerHTML = 15;

    blocklyCloseBtn.id = "blocklyCloseBtn";

    blocklyCloseBtn.onmouseover = ( function() {
        this.className = "hover";
    } ).bind( blocklyCloseBtn );

    blocklyCloseBtn.onmouseout = ( function() {
        this.className = "";
    } ).bind( blocklyCloseBtn );

    blocklyCloseBtn.onclick = ( function() {
        vwf_view.kernel.setProperty( vwf_view.kernel.application(), "blockly_interfaceVisible", false );
    } );

    startBlocklyButton.innerHTML = "";
    startBlocklyButton.className = "disabled";
    startBlocklyButton.onclick = clickStartButton;

    blocklySpeedButton.innerHTML = "";
    blocklySpeedButton.className = "normal";
    blocklySpeedButton.onclick = clickSpeedButton;

    blocklyResetButton.innerHTML = "";
    blocklyResetButton.onclick = clickBlockResetButton;

    $( "#blocklyDiv" ).wrap( blocklyScrollDiv );
    $( "#blocklyWrapper-top" ).append( blocklyCloseBtn );
    $( blocklyFooter ).append( ramBar );
    //$( blocklyFooter ).append( blocklySpeedButton );
    $( blocklyFooter ).append( blocklyResetButton );
    $( blocklyFooter ).append( startBlocklyButton );
    $( "#blocklyWrapper" ).append( blocklyFooter );
    ramBar.appendChild( currentRam );
    ramBar.appendChild( ramBarCount );

    // // Ensure that the blockly ui is accessible on smaller screens
    blocklyResized();

    window.addEventListener( 'resize', blocklyResized );
    document.addEventListener( 'mouseup', scrollIndicators );
}

function scrollIndicators() {
    //indicateBlock( currentBlockIDSelected ); 
    //indicateProcedureBlock( currentProcedureBlockID );
}

var blocklyResized = function(e) {
    // Compute the absolute coordinates and dimensions of blocklyArea.
    var blocklyArea = document.getElementById('blocklyWrapper');
    var blocklyDiv = document.getElementById('blocklyDiv');
    var blocklyHandle = document.getElementById('blocklyHandle');
    var blocklyFooter = document.getElementById('blocklyFooter');

    if ( blocklyArea && blocklyDiv && blocklyHandle && blocklyFooter ) {
        
        var element = blocklyArea;
        var x = 0;
        var y = 0;
        do {
          x += element.offsetLeft;
          y += element.offsetTop;
          element = element.offsetParent;
        } while ( element );
        // Position blocklyDiv over blocklyArea.
        blocklyDiv.style.left = '0px';
        blocklyDiv.style.top = blocklyHandle.height + 'px';
        blocklyDiv.style.width = ( blocklyArea.offsetWidth - 5) + 'px';

        var newHeight = ( blocklyArea.offsetHeight - blocklyHandle.offsetHeight - blocklyFooter.offsetHeight ) - 5;
        blocklyDiv.style.height = newHeight + 'px';
        blocklyDiv.style.zIndex = "1";

    }
    
};

// function resizeBlockly() {
//     var maxBlocklyHeight = parseInt( $( "#blocklyWrapper" ).css( "max-height") );
//     var currentHeight = parseInt( $( "#blocklyWrapper" ).css( "height") );
//     var height = window.innerHeight * 0.8 <= maxBlocklyHeight ? Math.floor( window.innerHeight * 0.8 ) : maxBlocklyHeight;

//     if ( height !== currentHeight ) {
//         var wrapperDifference = parseInt( $( "#blocklyWrapper-top" ).css( "height") ) + parseInt( $( "#blocklyFooter" ).css( "height") );        
//         $( "#blocklyWrapper" ).css( "height", height + "px" );
//         $( "#blocklyScrollDiv" ).css( "height", ( height - wrapperDifference ) + "px" );
//         centerBlocklyWindow();
//     }
// }

function keepBlocklyWithinBounds() {
    var handle = document.getElementById( "blocklyHandle" );
    var wrapper = document.getElementById( "blocklyWrapper" );
    if ( handle && wrapper ) {
        var width = wrapper.offsetWidth;
        var bottom = window.innerHeight - handle.offsetHeight;
        var left = width * -0.5;
        var right = window.innerWidth - width * 0.5;        
        if ( parseInt( wrapper.style.top ) > bottom ) {
            wrapper.style.top = bottom + "px";
        } else if ( parseInt( wrapper.style.top ) < 0 ) {
            wrapper.style.top = 0 + "px";
        }
        if ( parseInt( wrapper.style.left ) < left ) {
            wrapper.style.left = left + "px";
        } else if ( parseInt ( wrapper.style.left ) > right ) {
            wrapper.style.left = right + "px";
        }
    }
}

function updateOnBlocklyResize( event ) {
    //blocklyResized();
    //keepBlocklyWithinBounds();
    //indicateBlock( currentBlockIDSelected );
    //indicateProcedureBlock( currentProcedureBlockID );
}

function updateBlocklyRamBar() {
    if ( currentBlocklyNodeID ) {
        currentRam.style.width = ramBar.clientWidth * ( blocklyNodes[ currentBlocklyNodeID ].ram / blocklyNodes[ currentBlocklyNodeID ].ramMax ) + "px";
        ramBarCount.innerHTML = "Blocks Remaining: " + blocklyNodes[ currentBlocklyNodeID ].ram;
    }
}

function centerBlocklyWindow() {

    var blocklyUI = document.getElementById( "blocklyWrapper" );
    var top = window.innerHeight / 2 - blocklyUI.offsetHeight / 2;
    var left = window.innerWidth / 2 - blocklyUI.offsetWidth / 2;
    blocklyUI.style.top = top + "px";
    blocklyUI.style.left = left + "px";

}

function resetBlocklyIndicator() {
    $( "#blocklyIndicator" ).css( {
        "left" : 0,
        "top" : 0,
        "visibility" : "hidden"
    } );
    $( "#blocklyHighlighter" ).css( {
        "left" : 0,
        "top" : 0,
        "visibility" : "hidden"
    } );
    $( "#blocklyProcedureIndicator" ).css( {
        "left" : 0,
        "top" : 0,
        "visibility" : "hidden"
    } );
}

function showBlocklyIndicator() {
    var indicator = document.getElementById( "blocklyIndicator" );
    //var highlighter = document.getElementById( "blocklyHighlighter" );

    if ( indicator ) {
        //highlighter.style.visibility = "inherit";
        indicator.style.visibility = "inherit";
    }
}

function hideBlocklyIndicator() {
    var indicator = document.getElementById( "blocklyIndicator" );
    var highlighter = document.getElementById( "blocklyHighlighter" );

    if ( indicator ) {
        highlighter.style.visibility = "hidden";
        indicator.style.visibility = "hidden";
    }
}

function showBlocklyProcedureIndicator() {
    var indicator = document.getElementById( "blocklyProcedureIndicator" );
    if ( indicator ) {
        indicator.style.visibility = "inherit";
    }
}

function hideBlocklyProcedureIndicator() {
    var indicator = document.getElementById( "blocklyProcedureIndicator" );
    if ( indicator ) {
        indicator.style.visibility = "hidden";
    }
}

function moveBlocklyIndicator( x, y, blockHeight ) {
    var blocklyDiv = document.getElementById( "blocklyScrollDiv" );
    var toolbox = document.getElementsByClassName( "blocklyFlyoutBackground" )[ 0 ];
    var yOffset = parseInt( $( "#blocklyWrapper-top" ).css( "height" ) ) - blocklyDiv.scrollTop;
    var xOffset = toolbox.getBBox().width;
    if ( x > blocklyDiv.offsetWidth || y + yOffset > blocklyDiv.offsetHeight || y + yOffset < 0 ) {
        hideBlocklyIndicator();
    } else {
        showBlocklyIndicator();
    }
    $( "#blocklyIndicator" ).stop().animate( { 
        "top" : ( y + yOffset ) + "px",
        "left": ( x + xOffset ) + "px"
    }, "fast" );

    $( "#blocklyHighlighter" ).stop().animate( { 
        "backgroundColor" : '#FFFF00',
        "top" : ( y + yOffset ) + "px",
        "left" :( x + xOffset ) + "px",
        "height" : ( blockHeight ) + "px"
    } );
}

function changeHighlighterColor( status, speed ) {
    if ( status && speed ) {
        if ( status === 'executing' ) {
            $( "#blocklyHighlighter" ).stop().animate( { 
            "backgroundColor" : '#FFFF00'
            }, speed * 1000 );
        } else if ( status === 'executed' ) {
            $( "#blocklyHighlighter" ).stop().animate( { 
            "backgroundColor" : '#008000'
            }, speed * 1000 );
        } else if ( status === 'stopped' ) {
            $( "#blocklyHighlighter" ).stop().animate( { 
            "backgroundColor" : '#FF0000'
            }, speed * 1000 );
        }
    }  
    
}

function moveBlocklyProcedureIndicator( x, y ) {
    var blocklyDiv = document.getElementById( "blocklyScrollDiv" );
    var toolbox = document.getElementsByClassName( "blocklyFlyoutBackground" )[ 0 ];
    var yOffset = parseInt( $( "#blocklyWrapper-top" ).css( "height" ) ) - blocklyDiv.scrollTop;
    var xOffset = toolbox.getBBox().width;
    if ( x > blocklyDiv.offsetWidth || y + yOffset > blocklyDiv.offsetHeight || y + yOffset < 0 ) {
        hideBlocklyProcedureIndicator();
    } else {
        showBlocklyProcedureIndicator();
    }
    $( "#blocklyProcedureIndicator" ).stop().animate( { 
        "top" : ( y + yOffset ) + "px",
        "left": ( x + xOffset ) + "px"
    }, "fast" );
}

function showBlocklyLoopCount( count, maxCount ) {
    var indicatorCount = document.getElementById( "blocklyIndicatorCount" );
    indicatorCount.style.visibility = "inherit";
    indicatorCount.style.fontSize = '9px';
    indicatorCount.innerHTML = count + " of " + maxCount;
}

function hideBlocklyLoopCount() {
    var indicatorCount = document.getElementById( "blocklyIndicatorCount" );
    indicatorCount.innerHTML = '';
    indicatorCount.style.visibility = "hidden";
}

function clickStartButton() {

    if ( this.className === "" ) {
        vwf_view.kernel.setProperty( vwf_view.kernel.application(), "blockly_interfaceVisible", false );
        runBlockly();
    } else if ( this.className === "reset" ) {
        //NXM: We could make the "reset" button stop ALL the rovers using stopAllExecution, 
        //but for now we stop the rover that corresponds to the current active tab, since
        //this is the more inutitive behavior. (At least to me it makes more sense).
        //vwf_view.kernel.callMethod( vwf_view.kernel.application(), "stopAllExecution" );
        vwf_view.kernel.callMethod( currentBlocklyNodeID, "stopExecution");
    }
}

function clickBlockResetButton() {
    vwf_view.kernel.callMethod( vwf_view.kernel.application(), "resetBlocklyBlocks", [ currentBlocklyNodeID ] );
}

function clickSpeedButton() {
    // if ( this.className === "normal" ) {
    //     for ( var nodeID in blocklyNodes ) {
    //         vwf_view.kernel.setProperty( nodeID, "blockly_baseExecutionSpeed", 0.25 );
    //     }
    //     vwf_view.kernel.setProperty( mainRover, "executionSpeed", 0.25 );
    //     vwf_view.kernel.setProperty( perryRover, "executionSpeed", 0.25 );
    //     vwf_view.kernel.setProperty( rosieRover, "executionSpeed", 0.25 );
    //     blocklySpeedButton.className = "fast";
    // } else if ( this.className === "fast" ) {
    //     for ( var nodeID in blocklyNodes ) {
    //         vwf_view.kernel.setProperty( nodeID, "blockly_baseExecutionSpeed", 1.0 );
    //     }
    //     vwf_view.kernel.setProperty( mainRover, "executionSpeed", 1.0 );
    //     vwf_view.kernel.setProperty( perryRover, "executionSpeed", 1.0 );
    //     vwf_view.kernel.setProperty( rosieRover, "executionSpeed", 1.0 );
    //     blocklySpeedButton.className = "slow";
    // } else if ( this.className === "slow" ) {
    //     for ( var nodeID in blocklyNodes ) {
    //         vwf_view.kernel.setProperty( nodeID, "blockly_baseExecutionSpeed", 0.5 );
    //     }
    //     vwf_view.kernel.setProperty( mainRover, "executionSpeed", 0.5 );
    //     vwf_view.kernel.setProperty( perryRover, "executionSpeed", 0.5 );
    //     vwf_view.kernel.setProperty( rosieRover, "executionSpeed", 0.5 );
    //     blocklySpeedButton.className = "normal";
    // }
}

//@ sourceURL=source/blocklyUI.js
