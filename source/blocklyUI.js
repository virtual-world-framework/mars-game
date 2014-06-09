var ramBarCount = document.createElement( "div" );
var ramBar = document.createElement( "div" );
var currentRam = document.createElement( "div" );

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
    currentRam.id = "currentRam";
    ramBarCount.innerHTML = 15;
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