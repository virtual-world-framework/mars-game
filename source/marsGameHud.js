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

this.comms.addCharacterImage = function( path ) {
    this.images.characterImage.src = path;
    this.interval = 0;
    this.direction = 1;
}

this.comms.removeCharacterImage = function() {
    this.interval = 1;
    this.direction = -1;
}

this.firstPersonButton.onClick = function() {
    var hud = this.parent;
    var camera = hud.scene.gameCam;
    hud.cameraSelector.activeMode = this.mode;
    camera.setCameraMount( this.mode );
}

this.thirdPersonButton.onClick = function() {
    var hud = this.parent;
    var camera = hud.scene.gameCam;
    hud.cameraSelector.activeMode = this.mode;
    camera.setCameraMount( this.mode );
}

this.topDownButton.onClick = function() {
    var hud = this.parent;
    var camera = hud.scene.gameCam;
    hud.cameraSelector.activeMode = this.mode;
    camera.setCameraMount( this.mode );
    hud.scene.toggledHelicam();
}

//@ sourceURL=source/marsGameHud.js