this.initialize = function() {
    this.batteryMeter.future( 0 ).setUpListeners();
    this.cameraSelector.future( 0 ).setUpListeners();
}

this.setAllBlinking = function( value ) {
    var elements = this.children;
    for ( var i = 0; i < elements.length; i++ ) {
        elements[ i ].isBlinking = value;
    }
}

this.setAllEnabled = function( value ) {
    var elements = this.children;
    for ( var i = 0; i < elements.length; i++ ) {
        elements[ i ].enabled = value;
    }
}

this.batteryMeter.setUpListeners = function() {
    var rover = this.find( "//rover" )[ 0 ];
    this.battery = rover.battery;
    this.maxBattery = rover.batterMax;
    rover.batteryChanged = this.events.add( function( value ) {
        this.battery = value;
    }, this );
    rover.batteryMaxChanged = this.events.add( function( value ) {
        this.maxBattery = value;
    }, this );
}

this.cameraSelector.setUpListeners = function() {
    var camera = this.find( "//gameCam" )[ 0 ];
    this.activeMode = "thirdPerson";
    camera.mounted = this.events.add( function( mount ) {
        this.activeMode = mount.name;
    }, this );
}

this.blocklyButton.onClick = function() {
    var hud = this.parent;
    hud.lastBlocklyNodeID = hud.lastBlocklyNodeID || hud.scene.player.rover.id;
    if ( hud.lastBlocklyNodeID !== undefined ) {
        hud.scene.blockly_activeNodeID = hud.lastBlocklyNodeID;
    }
}

this.graphButton.onClick = function() {
    var hud = this.parent;
    hud.scene.displayGraph( !hud.scene.blocklyGraph.graphVisible );
}

this.tilesButton.onClick = function() {
    var hud = this.parent;
    hud.scene.displayTiles( !hud.scene.gridTileGraph.mapTiles.groupVisible );
}

this.optionsButton.onClick = function() {
    var hud = this.parent;
    hud.scene.pauseGame();
}

this.comms.addCharacterImage = function( path ) {
    var images = this.images;
    images.characterImage = path;
    this.images = images;
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
    camera.setCameraMount( this.mode );
}

this.thirdPersonButton.onClick = function() {
    var hud = this.parent;
    var camera = hud.scene.gameCam;
    camera.setCameraMount( this.mode );
}

this.topDownButton.onClick = function() {
    var hud = this.parent;
    var camera = hud.scene.gameCam;
    camera.setCameraMount( this.mode );
    hud.scene.toggledHelicam();
}

//@ sourceURL=source/marsGameHud.js