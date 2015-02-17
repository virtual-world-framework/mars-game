this.blocklyButton.onClick = function() {
    var hud = this.parent;
    hud.lastBlocklyNodeID = hud.lastBlocklyNodeID || hud.scene.player.rover.id;
    if ( hud.lastBlocklyNodeID !== undefined ) {
        hud.scene.blockly_activeNodeID = hud.lastBlocklyNodeID;
    }
}

this.graphButton.onClick = function() {
    var hud = this.parent;
    hud.scene.displayGraph( !hud.blocklyGraph.graphVisible );
}

this.tilesButton.onClick = function() {
    var hud = this.parent;
    hud.scene.displayTiles( !hud.gridTileGraph.mapTiles.groupVisible );
}

this.optionsButton.onClick = function() {
    var hud = this.parent;
    hud.scene.pauseGame();
}

//@ sourceURL=source/marsGameHud.js