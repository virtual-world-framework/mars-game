Blockly.inject( document.getElementById( 'blocklyDiv' ), { 
    path: './source/blockly/', 
    toolbox: document.getElementById( 'toolbox' ) 
} );

function onRun() {
    vwf_view.kernel.setProperty( vwf_view.kernel.application(), "executing", true );
}

window.addEventListener( "keyup", function (event) {
    switch ( event.keyCode ) {
        case 80:
            vwf_view.kernel.callMethod( vwf_view.kernel.find( undefined, "/player" ), "togglePerspective" );
    }
} ); //@ sourceURL=index.js
