/* --- Methods --- */

this.select = function() {
    var scene = this.find( "/" )[ 0 ];
    scene.selectObject( this.id );
}

this.deselect = function() {}

/* --- Events --- */

this.pointerDown = function( pointerInfo, pickInfo ) {
    var scene = this.find( "/" )[ 0 ];
    if ( pointerInfo.buttons.left && !pointerInfo.buttons.right ) {
        this.select();
    }
}

this.pointerUp = function( pointerInfo, pickInfo ) {
    var scene = this.find( "/" )[ 0 ];
    scene.pointerUp( pointerInfo, pickInfo );
}