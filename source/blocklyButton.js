this.pointerClick = function( pointerInfo, pickInfo ) {
    var scene = this.find( '/' )[ 0 ];
    if ( scene ) {
        scene.blocklyUiNodeID = this.parent.id;
    }
}