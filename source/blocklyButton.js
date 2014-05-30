this.pointerClick = function( pointerInfo, pickInfo ) {
    var scene = this.find( '/' )[ 0 ];
    if ( scene ) {
        scene.blockly_activeNodeID = this.parent.id;
    }
}