Blockly.inject( document.getElementById( 'blocklyDiv' ), { 
    path: './source/blockly/', 
    toolbox: document.getElementById( 'toolbox' ) 
} );

function onRun() {
    console.info( "========= onRun =========" );
    var appId = vwf_view.kernel.find( "", "/" )[ 0 ];

    vwf_view.kernel.setProperty( appId, "executing", true );
}

window.addEventListener( "keyup", function (event) {
    switch ( event.keyCode ) {
        case 80:
            vwf_view.kernel.callMethod( vwf_view.kernel.find( undefined, "/player" ), "togglePerspective" );
    }
} ); //@ sourceURL=index.js