var self;
var scene;

this.initialize = function() {

    this.children.create( "startStateExecutor", 
                          "source/triggers/declarativeFunctionExecutor.vwf" );

    this.children.create( "triggerManager", 
                          "source/triggers/triggerManager.vwf" );
}

this.startScenario = function() {
    if ( self !== this ) {
        self = this;
        var searchArray = self.find( self.scenePath );
        if ( searchArray.length ) {
            scene = searchArray[ 0 ];
        } else {
            self.logger.errorx( "startScenario", "Failed to find the scene!" );
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
    }

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

    this.enter();
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

this.startStateParamSet.addToInventory = function( params, context ) {
    if ( !params || ( params.length !== 2 ) ) {
        self.logger.errorx( "addToInventory", "The addToInventory condition " +
                            "requires 2 parameters: The path of the inventory object " +
                            "and an array of names of the objects to be added." );
        return undefined;
    }

    var inventory = self.startStateExecutor.findInContext( context, params[0] );

    var objects = params[1];
    var object;
    for ( var i = 0; i < objects.length; i++ ) {
        object = self.startStateExecutor.findInContext( context, objects[ i ] );

    }

    inventory.add( object.id );
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

this.startStateParamSet.createGraph = function( params, context ) {
    if ( params && ( params.length !== 0 ) ) {
        self.logger.errorx( "createGraph",
                            "The createGraph condition takes no arguments." );
        return undefined;
    }

    scene.createGraph();
}

//@ sourceURL=source/scenario/scenario.js
