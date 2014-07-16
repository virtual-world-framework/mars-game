/* --- Methods --- */

this.select = function() {
    var scene = this.find( "/" )[ 0 ];
    scene.selectObject( this.id );
}

/* --- Events --- */

this.pointerClick = function( pointerInfo, pickInfo ) {
    var scene = this.find( "/" )[ 0 ];
    if ( pointerInfo.button === "left" ) {
        this.select();
    }
}