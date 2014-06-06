var ramBarCount;
var ramBar;

function setUpBlocklyPeripherals() {

    var blocklyHandle = document.createElement( "div" );
    blocklyHandle.id = "blocklyHandle";
    $( "#blocklyWrapper" ).append( blocklyHandle )
    $( "#blocklyWrapper" ).draggable( {
        containment: "body",
        handle: "div#blocklyHandle"
    } );

    ramBar = document.createElement( "div" );
    ramBar.id = "ramBar";
    ramBarCount = document.createElement( "div" );
    ramBarCount.id = "ramBarCount";
    ramBarCount.innerHTML = 15;
    blocklyHandle.appendChild( ramBar );
    blocklyHandle.appendChild( ramBarCount );
}

function updateBlocklyRamBar() {
    ramBar.style.width = 280 * ( blocklyNodes[ currentBlocklyNodeID ].ram / blocklyNodes[ currentBlocklyNodeID ].ramMax ) + "px";
    ramBarCount.innerHTML = blocklyNodes[ currentBlocklyNodeID ].ram ;
}

//@ sourceURL=source/blocklyUI.js