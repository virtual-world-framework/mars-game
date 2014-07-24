var activeScenario;
var scene;

this.initialize = function() {
    this.children.create( "startStateExecutor", 
                          "source/triggers/declarativeFunctionExecutor.vwf" );

    // this.children.create( "triggerManager", 
    //                       "source/triggers/triggerManager.vwf" );

    this.future( 0 ).onSceneLoaded();
}

this.onSceneLoaded = function() {
    var searchArray = this.find( this.scenePath );
    if ( searchArray.length ) {
        scene = searchArray[ 0 ];
    } else {
        this.logger.errorx( "startScenario", "Failed to find the scene!" );
    }
}

this.startScenario = function() {
    if ( activeScenario !== this ) {
        activeScenario = this;

        this.startStateExecutor.functionSets = [];
        this.startStateExecutor.addFunctionSet( this.startStateParamSet );

        if ( scene !== undefined ) {
            if ( this.blockly && this.blockly !== '' ) {
                scene.blockly_toolbox = this.blockly;
            }
            if ( this.blocklyDefault && this.blocklyDefault !== '' ) {
                scene.blockly_defaultXml = this.blocklyDefault;
            }
        }

        if ( this.grid ) {
            scene.future(0).createGridDisplay( this.grid );
        }
    }

    if ( this.startState && this.startState.length > 0 ) {
        for ( var i = 0; i < this.startState.length; ++i ) {
            var param = this.startState[ i ];
            this.startStateExecutor.executeFunction( param, scene );
        }
    }

    var globalTriggers = scene.globalTriggerManager;
    globalTriggers.clearTriggerList( globalTriggers.lateLoadTriggers );

    this.triggerManager.loadTriggers( scene );

    globalTriggers.loadTriggerList( globalTriggers.lateLoadTriggers );

    this.enter();
    scene.scenarioStarted( this );
}

this.failed = function() {
    // If we need to do anything on failure, it should go in here.
    if ( scene ) {
        scene.scenarioFailed( this );
        scene.stopAllExecution();

        this.triggerManager && this.triggerManager.future( 0 ).clearTriggers();
    }
}

this.completed = function() {
    // If we need to do anything on success, it should go in here.
    if ( scene ) {
        scene.scenarioSucceeded( this );
        this.triggerManager && this.triggerManager.future( 0 ).clearTriggers();
    }
}

this.startStateParamSet.setProperty = function( params, context ) {
    if ( !params || ( params.length !== 3 ) ) {
        activeScenario.logger.errorx( "setProperty", 
                            "The setProperty condition requires three " +
                            "arguments: the object name, the property name, " +
                            "and the property value." );
        return undefined;
    }

    var objectName = params[ 0 ];
    var propertyName = params[ 1 ];
    var value = params[ 2 ];

    var object = activeScenario.startStateExecutor.findInContext( context, objectName );
    object[ propertyName ] = value;
}

this.startStateParamSet.setSceneProperty = function( params, context ) {
    if ( !params || ( params.length !== 2 ) ) {
        activeScenario.logger.errorx( "setSceneProperty", 
                            "The setSceneProperty condition requires two " +
                            "arguments: the property name and the property " +
                            "value." );
        return undefined;
    }

    var propertyName = params[ 0 ];
    var value = params[ 1 ];
    
    context[ propertyName ] = value;
}

this.startStateParamSet.emptyInventory = function( params, context ) { 
    if ( !params || ( params.length !== 1 ) ) {
        activeScenario.logger.errorx( "emptyInventory", 
                            "The emptyInventory condition requires the path " +
                            "of the inventory object." );
        return undefined;
    }

    var inventoryPath = params[ 0 ];
    var inventory = activeScenario.startStateExecutor.findInContext( context, inventoryPath );
    inventory.empty();
}

this.startStateParamSet.addToInventory = function( params, context ) {
    if ( !params || ( params.length !== 2 ) ) {
        activeScenario.logger.errorx( "addToInventory", "The addToInventory condition " +
                            "requires 2 parameters: The path of the inventory object " +
                            "and an array of names of the objects to be added." );
        return undefined;
    }

    var inventory = activeScenario.startStateExecutor.findInContext( context, params[0] );

    var objects = params[1];
    var object;
    for ( var i = 0; i < objects.length; i++ ) {
        object = activeScenario.startStateExecutor.findInContext( context, objects[ i ] );

    }

    inventory.add( object.id );
}

this.startStateParamSet.addToGrid = function( params, context ) {
    if ( !params || ( params.length !== 2 ) ) {
        activeScenario.logger.errorx( "addToGrid",
                            "The addToGrid condition requires 2 arguments: " +
                            "the object to be added, and the coordinates of " +
                            "the grid tile." );
        return undefined;
    }

    var objectName = params[ 0 ];
    var gridCoord = params[ 1 ];

    var object = activeScenario.startStateExecutor.findInContext( context, objectName );
    activeScenario.grid.addToGridFromCoord( object, gridCoord );
}

this.startStateParamSet.createGraph = function( params, context ) {
    if ( params && ( params.length !== 0 ) ) {
        activeScenario.logger.errorx( "createGraph",
                            "The createGraph condition takes no arguments." );
        return undefined;
    }

    scene.future( 0 ).createGraph();
}

//@ sourceURL=source/scenario/scenario.js
