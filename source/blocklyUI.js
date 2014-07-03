var ramBarCount = document.createElement( "div" );
var ramBar = document.createElement( "div" );
var currentRam = document.createElement( "div" );

function setUpBlocklyPeripherals() {

    centerBlocklyWindow();

    var blocklyOverlay = document.createElement( "div" );
    var blocklyFooter = document.createElement( "div" );
    var blocklyCloseBtn = document.createElement( "div" );
    var blocklyHelpButton = document.createElement( "div" );
    var blocklyHandle = document.createElement( "div" );
    var blocklyHandleIcon = document.createElement( "div" );
    var runStopContainer = document.createElement( "div" );
    var runButton = document.getElementById( "runButton" );
    var stopButton = document.createElement( "div" );
    var indicator = document.createElement( "div" );

    blocklyOverlay.id = "blocklyOverlay";
    blocklyFooter.id = "blocklyFooter";
    blocklyHandle.id = "blocklyHandle";
    blocklyHandleIcon.id = "blocklyHandleIcon";
    stopButton.id = "stopButton";
    indicator.id = "blocklyIndicator";

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

    $( "#blocklyWrapper-top" ).append( blocklyCloseBtn );
    $( "#blocklyWrapper" ).append( blocklyHelpButton );
    $( blocklyFooter ).append( ramBar );
    $( blocklyFooter ).append( runStopContainer );
    $( runStopContainer ).append( runButton );
    $( runStopContainer ).append( stopButton );
    $( "#blocklyWrapper" ).append( blocklyFooter );
    $( "#blocklyWrapper" ).append( blocklyOverlay );
    $( blocklyOverlay ).append( indicator );
    ramBar.appendChild( currentRam );
    ramBar.appendChild( ramBarCount );
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

function moveBlocklyIndicator( x, y ) {
    $( "#blocklyIndicator" ).animate( { "top" : ( y + 20 ) + "px" } );
    $( "#blocklyIndicator" ).css( "left", ( x + parseInt( $( ".blocklyFlyoutBackground" ).css( "width" ) ) + 120 ) + "px" );
}

//@ sourceURL=source/blocklyUI.js