this.blocklyButton.onClick = function() {
    var hud = this.parent;
    hud.lastBlocklyNodeID = hud.lastBlocklyNodeID || hud.scene.player.rover.id;
    if ( hud.lastBlocklyNodeID !== undefined ) {
        hud.scene.blockly_activeNodeID = hud.lastBlocklyNodeID;
    }
}

//@ sourceURL=source/marsGameHud.js