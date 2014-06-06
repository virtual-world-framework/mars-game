var ramCount;
var ramBar;
var currentRam = 15;
var maxRam = 15;

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
    ramCount = document.createElement( "div" );
    ramCount.id = "ramCount";
    ramCount.innerHTML = currentRam;
    blocklyUI.appendChild( ramBar );
    blocklyUI.appendChild( ramCount );	
}

function updateBlocklyRamBar() {
    ramBar.style.width = 300 * ( currentRam / maxRam ) + "px";
    ramCount.innerHTML = currentRam;
}