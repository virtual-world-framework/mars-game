var ramBarCount;
var ramBar;
var ramBarCurrentLength = 15;
var ramBarMaxLength = 15;

function setUpBlocklyUI() {

    var blocklyUI = document.createElement( "div" );
    blocklyUI.id = "blocklyUI";
    $( "#blocklyWrapper" ).append( blocklyUI )
    $( "#blocklyWrapper" ).draggable( {
        containment: "body",
        handle: "div#blocklyUI"
    } );

    ramBar = document.createElement( "div" );
    ramBar.id = "ramBar";
    ramBarCount = document.createElement( "div" );
    ramBarCount.id = "ramBarCount";
    ramBarCount.innerHTML = ramBarCurrentLength;
    blocklyUI.appendChild( ramBar );
    blocklyUI.appendChild( ramBarCount );	
}

function updateBlocklyRamBar() {
    ramBar.style.width = 280 * ( ramBarCurrentLength / ramBarMaxLength ) + "px";
    ramBarCount.innerHTML = ramBarCurrentLength;
}