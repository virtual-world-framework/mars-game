var self;
var scene;

var soundsLoaded = false;

this.initialize = function() {
    self = this;

    this.children.create( "startStateExecutor", 
                          "source/triggers/declarativeFunctionExecutor.vwf" );

    this.children.create( "triggerManager", 
                          "source/triggers/triggerManager.vwf" );

    this.future( 0 ).onSceneReady();
}

this.onSceneReady = function() {
    var searchArray = self.find( self.scenePath );
    if ( searchArray.length ) {
        scene = searchArray[ 0 ];
    } else {
        self.logger.errorx( "onSceneReady", "Failed to find the scene!" );
    }

    this.startStateExecutor.functionSets = [];
    this.startStateExecutor.addFunctionSet( this.startStateParamSet );

    if ( scene !== undefined ) {
        if ( self.blockly && self.blockly !== '' ) {
            scene.blockly_toolbox = self.blockly;
        }
        if ( self.blocklyDefault && self.blocklyDefault !== '' ) {
            scene.blockly_defaultXml = self.blocklyDefault;
        }
    }

    // HACK HACK HACK
    // Temporarily loading sound assets here, since I don't have Spencer's changes yet.
    // TODO: do this the right way
    var soundManager = scene.find( ".//element(*,'http://vwf.example.com/sound/soundManager.vwf')" )[ 0 ];
    if ( soundManager && !soundsLoaded ) {
        soundsLoaded = true;

        var soundDefinition = { soundName: undefined, soundURL: undefined };

        soundDefinition.soundName = "L1VO1_Rover_f"
        soundDefinition.soundURL = "assets/sounds/VO/L1VO1_Rover_f.mp3"
        soundManager.loadSound( soundDefinition );

        soundDefinition.soundName = "L1VO2_Rover_f"
        soundDefinition.soundURL = "assets/sounds/VO/L1VO2_Rover_f.mp3"
        soundManager.loadSound( soundDefinition );

        soundDefinition.soundName = "L1VO3_Rover_f"
        soundDefinition.soundURL = "assets/sounds/VO/L1VO3_Rover_f.mp3"
        soundManager.loadSound( soundDefinition );

        soundDefinition.soundName = "L1VO4_Rover_f"
        soundDefinition.soundURL = "assets/sounds/VO/L1VO4_Rover_f.mp3"
        soundManager.loadSound( soundDefinition );

        soundDefinition.soundName = "L1VO6_Control_f"
        soundDefinition.soundURL = "assets/sounds/VO/L1VO6_Control_f.mp3"
        soundManager.loadSound( soundDefinition );
    }
}

this.entering = function() {
    if ( self.startState && self.startState.length > 0 ) {
        for ( var i = 0; i < self.startState.length; ++i ) {
            var param = self.startState[ i ];
            self.startStateExecutor.executeFunction( param, scene );
        }
    }

    self.triggerManager.clearTriggers();
    if ( self.triggers ) {
        self.triggerManager.loadTriggers( self.triggers, scene );
    }

    // Do this last, once all configuration is done.
    // TODO: rather than do this, should we make these triggers fire when created?
    self.starting( self.scenarioName );
}

this.failed = function() {
    // If we need to do anything on failure, it should go in here.
    if ( scene ) {
        scene.stopAllExecution();
    }
}

this.completed = function() {
    // If we need to do anything on success, it should go in here.
}

this.startStateParamSet.setProperty = function( params, context ) {
    if ( !params || ( params.length != 3 ) ) {
        self.logger.errorx( "setProperty", 
                            "The setProperty condition requires three " +
                            "arguments: the object name, the property name, " +
                            "and the property value." );
        return undefined;
    }

    var objectName = params[ 0 ];
    var propertyName = params[ 1 ];
    var value = params[ 2 ];

    var object = self.startStateExecutor.findInContext( context, objectName );
    object[ propertyName ] = value;
}

this.startStateParamSet.emptyInventory = function( params, context ) { 
    if ( !params || ( params.length !== 1 ) ) {
        self.logger.errorx( "emptyInventory", 
                            "The emptyInventory condition requires the path " +
                            "of the inventory object." );
        return undefined;
    }

    var inventoryPath = params[ 0 ];
    var inventory = self.startStateExecutor.findInContext( context, inventoryPath );
    inventory.empty();
}

this.startStateParamSet.addToGrid = function( params, context ) {
    if ( !params || ( params.length !== 2 ) ) {
        self.logger.errorx( "addToGrid",
                            "The addToGrid condition requires 2 arguments: " +
                            "the object to be added, and the coordinates of " +
                            "the grid tile." );
        return undefined;
    }

    var objectName = params[ 0 ];
    var gridCoord = params[ 1 ];

    var object = self.startStateExecutor.findInContext( context, objectName );
    self.grid.addToGridFromCoord( object, gridCoord );
}

//@ sourceURL=source/scenario.js
