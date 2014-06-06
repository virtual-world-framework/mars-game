var ramBarCount = document.createElement( "div" );
var ramBar = document.createElement( "div" );

function setUpBlocklyPeripherals() {

    var blocklyHandle = document.createElement( "div" );
    blocklyHandle.id = "blocklyHandle";
    $( "#blocklyWrapper" ).append( blocklyHandle );
    $( "#blocklyWrapper" ).draggable( {
        containment: "body",
        handle: "div#blocklyHandle"
    } );

    ramBar.id = "ramBar";
    ramBarCount.id = "ramBarCount";
    ramBarCount.innerHTML = 15;
    blocklyHandle.appendChild( ramBar );
    blocklyHandle.appendChild( ramBarCount );
}

function updateBlocklyRamBar() {
    if ( currentBlocklyNodeID ) {
        ramBar.style.width = 280 * ( blocklyNodes[ currentBlocklyNodeID ].ram / blocklyNodes[ currentBlocklyNodeID ].ramMax ) + "px";
        ramBarCount.innerHTML = blocklyNodes[ currentBlocklyNodeID ].ram ;
    }
}

//@ sourceURL=source/blocklyUI.js