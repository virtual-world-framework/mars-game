var ramBarCount = document.createElement( "div" );
var ramBar = document.createElement( "div" );
var currentRam = document.createElement( "div" );

function setUpBlocklyPeripherals() {

    var blocklyCloseBtn = document.createElement( "div" );
    var blocklyHelpBtn = document.createElement( "div" );
    var blocklyHandle = document.createElement( "div" );
    var blocklyHandleIcon = document.createElement( "div" );
    blocklyHandle.id = "blocklyHandle";
    blocklyHandleIcon.id = "blocklyHandleIcon";
    $( blocklyHandle ).append( blocklyHandleIcon );
    $( "#blocklyWrapper-top" ).append( blocklyHandle );
    $( "#blocklyWrapper" ).draggable( {
        handle: "div#blocklyHandle",
        scroll: false,
        drag: function( event, element ) {
            $( ".blocklyWidgetDiv" ).css( "display", "none" );
            var width = element.helper.context.clientWidth;
            var height = element.helper.context.clientHeight;
            var offscreenAllowanceWidth = width * 0.85;
            var offscreenAllowanceHeight = height * 0.95;
            if ( element.position.left < width / 2 - offscreenAllowanceWidth ) {
                element.position.left = width / 2 - offscreenAllowanceWidth;
            } else if ( element.position.left > window.innerWidth - width / 2 + offscreenAllowanceWidth ) {
                element.position.left = window.innerWidth - width / 2 + offscreenAllowanceWidth;
            }
            if ( element.position.top < height / 2 ) {
                element.position.top = height / 2;
            } else if ( element.position.top > window.innerHeight - height / 2 + offscreenAllowanceHeight) {
                element.position.top = window.innerHeight - height / 2 + offscreenAllowanceHeight;
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

    blocklyHelpBtn.id = "blocklyHelpButton";
    blocklyHelpButton.onclick = showBlocklyHelp;

    $( "#blocklyWrapper-top" ).append( blocklyCloseBtn );
    $( "#blocklyWrapper" ).append( ramBar );
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

//@ sourceURL=source/blocklyUI.js