var ramBarCount = document.createElement( "div" );
var ramBar = document.createElement( "div" );
var currentRam = document.createElement( "div" );

function setUpBlocklyPeripherals() {

    centerBlocklyWindow();

    var blocklyFooter = document.createElement( "div" );
    var blocklyCloseBtn = document.createElement( "div" );
    var blocklyHelpButton = document.createElement( "div" );
    var blocklyHandle = document.createElement( "div" );
    var blocklyHandleIcon = document.createElement( "div" );
    var blocklyScrollDiv = document.createElement( "div" );
    var runStopContainer = document.createElement( "div" );
    var runButton = document.getElementById( "runButton" );
    var stopButton = document.createElement( "div" );

    blocklyFooter.id = "blocklyFooter";
    blocklyHandle.id = "blocklyHandle";
    blocklyHandleIcon.id = "blocklyHandleIcon";
    blocklyScrollDiv.id = "blocklyScrollDiv";
    stopButton.id = "stopButton"; 

    $( blocklyHandle ).append( blocklyHandleIcon );
    $( "#blocklyWrapper-top" ).append( blocklyHandle );
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
        handles: 'n, s'
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

    blocklyHelpButton.id = "blocklyHelpButton";
    blocklyHelpButton.onclick = showBlocklyHelp;
    blocklyHelpButton.onmouseover = ( function() {
        this.className = "hover";
    } ).bind( blocklyHelpButton );

    blocklyHelpButton.onmouseout = ( function() {
        this.className = "";
    } ).bind( blocklyHelpButton );

    // Run and stop buttons
    runStopContainer.id = "runStopContainer";
    runButton.innerHTML = "";
    runButton.className = "disabled";
    stopButton.className = "disabled";

    stopButton.onclick = ( function() {
        vwf_view.kernel.callMethod( vwf_view.kernel.application(), "stopAllExecution" );
    } );

    $( "#blocklyDiv" ).wrap( blocklyScrollDiv );
    $( "#blocklyWrapper-top" ).append( blocklyCloseBtn );
    $( "#blocklyWrapper" ).append( blocklyHelpButton );
    $( blocklyFooter ).append( ramBar );
    $( blocklyFooter ).append( runStopContainer );
    $( runStopContainer ).append( runButton );
    $( runStopContainer ).append( stopButton );
    $( "#blocklyWrapper" ).append( blocklyFooter );
    ramBar.appendChild( currentRam );
    ramBar.appendChild( ramBarCount );

    // Ensure that the blockly ui is accessible on smaller screens
    resizeBlockly();

    window.addEventListener( 'resize', keepBlocklyWithinBounds );
}

function resizeBlockly() {
    var maxBlocklyHeight = parseInt( $( "#blocklyWrapper" ).css( "max-height") );
    var currentHeight = parseInt( $( "#blocklyWrapper" ).css( "height") );
    var height = window.innerHeight * 0.9 <= maxBlocklyHeight ? Math.floor( window.innerHeight * 0.9 ): maxBlocklyHeight;

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

function updateBlocklyRamBar() {
    if ( currentBlocklyNodeID ) {
        currentRam.style.width = ramBar.clientWidth * ( blocklyNodes[ currentBlocklyNodeID ].ram / blocklyNodes[ currentBlocklyNodeID ].ramMax ) + "px";
        ramBarCount.innerHTML = "RAM: " + blocklyNodes[ currentBlocklyNodeID ].ram;
    }
}

function showBlocklyHelp() {

    var help = document.createElement( "DIV" );
    help.id = "blocklyHelpScreen";
    help.className = "help";
    help.onclick = ( function() {
        var dialog = document.getElementById( "blocklyHelpScreen" );
        document.body.removeChild( dialog );
    } );
    document.body.appendChild( help );

}

function centerBlocklyWindow() {

    var blocklyUI = document.getElementById( "blocklyWrapper" );
    var top = window.innerHeight / 2 - blocklyUI.offsetHeight / 2;
    var left = window.innerWidth / 2 - blocklyUI.offsetWidth / 2;
    blocklyUI.style.top = top + "px";
    blocklyUI.style.left = left + "px";

}

//@ sourceURL=source/blocklyUI.js