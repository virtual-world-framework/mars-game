var ramBarCount = document.createElement( "div" );
var ramBar = document.createElement( "div" );
var currentRam = document.createElement( "div" );

function setUpBlocklyPeripherals() {

    var blocklyCloseBtn = document.createElement( "div" );
    var blocklyHandle = document.createElement( "div" );
    blocklyHandle.id = "blocklyHandle";
    $( "#blocklyWrapper" ).append( blocklyHandle );
    $( "#blocklyWrapper" ).draggable( {
        handle: "div#blocklyHandle",
        scroll: false,
        drag: function( event, element ) {
            var width = element.helper.context.clientWidth;
            var height = element.helper.context.clientHeight;
            if ( element.position.left < width / 2 ) {
                element.position.left = width / 2;
            } else if ( element.position.left > window.innerWidth - width / 2 ) {
                element.position.left = window.innerWidth - width / 2;
            }
            if ( element.position.top < height / 2 ) {
                element.position.top = height / 2;
            } else if ( element.position.top > window.innerHeight - height / 2 ) {
                element.position.top = window.innerHeight - height / 2;
            }
        }
    } );

    ramBar.id = "ramBar";
    ramBarCount.id = "ramBarCount";
    currentRam.id = "currentRam";
    ramBarCount.innerHTML = 15;

    blocklyCloseBtn.id = "blocklyCloseBtn";
    blocklyCloseBtn.onclick = ( function() {
        vwf_view.kernel.setProperty( vwf_view.kernel.application(), "blockly_activeNodeID", undefined );
    } );

    $( "#blocklyWrapper-top" ).append( blocklyCloseBtn );
    $( "#blocklyWrapper" ).append( ramBar );
    ramBar.appendChild( currentRam );
    ramBar.appendChild( ramBarCount );
}

function updateBlocklyRamBar() {
    if ( currentBlocklyNodeID ) {
        currentRam.style.width = ramBar.clientWidth * ( blocklyNodes[ currentBlocklyNodeID ].ram / blocklyNodes[ currentBlocklyNodeID ].ramMax ) + "px";
        ramBarCount.innerHTML = blocklyNodes[ currentBlocklyNodeID ].ram;
    }
}

//@ sourceURL=source/blocklyUI.js