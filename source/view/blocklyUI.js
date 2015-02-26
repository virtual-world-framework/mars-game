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

function setUpBlocklyPeripherals() {

    centerBlocklyWindow();

    var blocklyFooter = document.createElement( "div" );
    var blocklyCloseBtn = document.createElement( "div" );
    var blocklyHandle = document.createElement( "div" );
    var blocklyScrollDiv = document.createElement( "div" );
    var indicator = document.createElement( "div" );
    var indicatorCount = document.createElement( "div" );
    var procedureIndicator = document.createElement( "div" );

    blocklyFooter.id = "blocklyFooter";
    blocklyHandle.id = "blocklyHandle";
    blocklyScrollDiv.id = "blocklyScrollDiv";
    indicator.id = "blocklyIndicator";
    indicatorCount.id = "blocklyIndicatorCount";
    indicatorCount.innerHTML = "";
    procedureIndicator.id = "blocklyProcedureIndicator";
    startBlocklyButton.id = "startBlockly";

    indicator.appendChild( indicatorCount );
    $( "#blocklyWrapper-top" ).append( blocklyHandle )
    $( "#blocklyWrapper" ).append( indicator );
    $( "#blocklyWrapper" ).append( procedureIndicator );
    $( "#blocklyWrapper" ).draggable( {
        handle: "div#blocklyHandle",
        scroll: false,
        drag: function( event, element ) {
            $( ".blocklyWidgetDiv" ).css( "display", "none" );
            var width = element.helper.context.offsetWidth;
            var top = 0;
            var bottom = window.innerHeight - blocklyHandle.offsetHeight;
            var left = width * -0.5;
            var right = window.innerWidth - width * 0.5;

            if ( element.position.left < left ) {
                element.position.left = left;
            } else if ( element.position.left > right ) {
                element.position.left = right;
            }
            if ( element.position.top < top ) {
                element.position.top = top;
            } else if ( element.position.top > bottom ) {
                element.position.top = bottom;
            }
        }
    } );
    $( "#blocklyWrapper" ).resizable( {
        alsoResize: "#blocklyScrollDiv",
        handles: 'n, s',
        resize: updateOnBlocklyResize,
        stop: keepBlocklyWithinBounds
    } );

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
        vwf_view.kernel.setProperty( vwf_view.kernel.application(), "blockly_activeNodeID", undefined );
    } );

    startBlocklyButton.innerHTML = "";
    startBlocklyButton.className = "disabled";
    startBlocklyButton.onclick = clickStartButton;

    $( "#blocklyDiv" ).wrap( blocklyScrollDiv );
    $( "#blocklyWrapper-top" ).append( blocklyCloseBtn );
    $( blocklyFooter ).append( ramBar );
    $( blocklyFooter ).append( startBlocklyButton );
    $( "#blocklyWrapper" ).append( blocklyFooter );
    ramBar.appendChild( currentRam );
    ramBar.appendChild( ramBarCount );

    $( "#blocklyScrollDiv" ).on( "scroll", function() {
        indicateBlock( currentBlockIDSelected );
    });    

    // Ensure that the blockly ui is accessible on smaller screens
    resizeBlockly();

    window.addEventListener( 'resize', keepBlocklyWithinBounds );
}

function resizeBlockly() {
    var maxBlocklyHeight = parseInt( $( "#blocklyWrapper" ).css( "max-height") );
    var currentHeight = parseInt( $( "#blocklyWrapper" ).css( "height") );
    var height = window.innerHeight * 0.8 <= maxBlocklyHeight ? Math.floor( window.innerHeight * 0.8 ) : maxBlocklyHeight;

    if ( height !== currentHeight ) {
        var wrapperDifference = parseInt( $( "#blocklyWrapper-top" ).css( "height") ) + parseInt( $( "#blocklyFooter" ).css( "height") );        
        $( "#blocklyWrapper" ).css( "height", height + "px" );
        $( "#blocklyScrollDiv" ).css( "height", ( height - wrapperDifference ) + "px" );
        centerBlocklyWindow();
    }
}

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
    keepBlocklyWithinBounds();
    indicateBlock( currentBlockIDSelected );
}

function updateBlocklyRamBar() {
    if ( currentBlocklyNodeID ) {
        currentRam.style.width = ramBar.clientWidth * ( blocklyNodes[ currentBlocklyNodeID ].ram / blocklyNodes[ currentBlocklyNodeID ].ramMax ) + "px";
        ramBarCount.innerHTML = "RAM: " + blocklyNodes[ currentBlocklyNodeID ].ram;
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
    $( "#blocklyProcedureIndicator" ).css( {
        "left" : 0,
        "top" : 0,
        "visibility" : "hidden"
    } );
}

function showBlocklyIndicator() {
    var indicator = document.getElementById( "blocklyIndicator" );
    if ( indicator ) {
        indicator.style.visibility = "inherit";
    }
}

function hideBlocklyIndicator() {
    var indicator = document.getElementById( "blocklyIndicator" );
    if ( indicator ) {
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

function moveBlocklyIndicator( x, y ) {
    var blocklyDiv = document.getElementById( "blocklyScrollDiv" );
    var toolbox = document.getElementsByClassName( "blocklyFlyoutBackground" )[ 0 ];
    var yOffset = parseInt( $( "#blocklyWrapper-top" ).css( "height" ) ) - blocklyDiv.scrollTop;
    var xOffset = toolbox.getBBox().width;
    if ( x > blocklyDiv.offsetWidth || y + yOffset - 20 > blocklyDiv.offsetHeight || y + yOffset < 0 ) {
        hideBlocklyIndicator();
    } else {
        showBlocklyIndicator();
    }
    $( "#blocklyIndicator" ).stop().animate( { 
        "top" : ( y + yOffset ) + "px",
        "left": ( x + xOffset ) + "px"
    } );
}

function moveBlocklyProcedureIndicator( x, y ) {
    var blocklyDiv = document.getElementById( "blocklyScrollDiv" );
    var toolbox = document.getElementsByClassName( "blocklyFlyoutBackground" )[ 0 ];
    var yOffset = parseInt( $( "#blocklyWrapper-top" ).css( "height" ) ) - blocklyDiv.scrollTop;
    var xOffset = toolbox.getBBox().width;
    if ( x > blocklyDiv.offsetWidth || y + yOffset - 20 > blocklyDiv.offsetHeight || y + yOffset < 0 ) {
        hideBlocklyProcedureIndicator();
    } else {
        showBlocklyProcedureIndicator();
    }
    $( "#blocklyProcedureIndicator" ).stop().animate( { 
        "top" : ( y + yOffset ) + "px",
        "left": ( x + xOffset ) + "px"
    } );
}

function showBlocklyLoopCount( count, maxCount ) {
    var indicatorCount = document.getElementById( "blocklyIndicatorCount" );
    indicatorCount.style.visibility = "inherit";
    indicatorCount.innerHTML = count + " of " + maxCount;
}

function hideBlocklyLoopCount() {
    var indicatorCount = document.getElementById( "blocklyIndicatorCount" );
    indicatorCount.style.visibility = "hidden";
}

function clickStartButton() {
    if ( this.className === "" ) {
        runBlockly();
    } else if ( this.className === "reset" ) {
        vwf_view.kernel.callMethod( vwf_view.kernel.application(), "stopAllExecution" );
    }
}

//@ sourceURL=source/blocklyUI.js