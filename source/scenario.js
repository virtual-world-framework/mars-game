var self;
var scene;
var clauseFactory;

var checkSucceededFn;
var checkFailedFn;

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

    // TODO: move the clause factory into the scenario, as we did with the
    //   startStateExecutor and the trigger Manager.  Or, get rid of it and 
    //   use triggers for everything.
    var clauseFactories = scene.find( ".//element(*,'source/triggers/booleanFunctionFactory.vwf')" );
    if ( clauseFactories.length !== 1 ) {
        self.logger.errorx( "onSceneReady", "There should be exactly one " +
                            "booleanFunctionFactory, at least for now." );
    }
    
    clauseFactory = clauseFactories[ 0 ];

    if ( scene !== undefined ) {
        if ( self.blockly && self.blockly !== '' ) {
            scene.blockly_toolbox = self.blockly;
        }
        if ( self.blocklyDefault && self.blocklyDefault !== '' ) {
            scene.blockly_defaultXml = self.blocklyDefault;
        }
    }
}

this.entering = function() {
    if ( self.startState && self.startState.length > 0 ) {
        for ( var i = 0; i < self.startState.length; ++i ) {
            var param = self.startState[ i ];
            self.startStateExecutor.executeFunction( param, scene );
        }
    }

    if ( self.successClause && self.successClause.length > 0 ) {
        if ( self.successClause.length > 1 ) {
             self.logger.errorx( "entering", "The success clause can only " +
                                 "have a single entry.  Try using AND or OR." );
        } else if ( checkSucceededFn === undefined ) {
            checkSucceededFn = 
                clauseFactory.executeFunction( self.successClause[ 0 ],
                                               scene, 
                                               self.checkForSuccess.bind( self ) );
        }
    }

    if ( self.failureClause && self.failureClause.length > 0 ) {
        if ( self.failureClause.length > 1 ) {
             self.logger.errorx( "entering", "The failure clause can only " +
                                 "have a single entry.  Try using AND or OR." );
        } else if ( checkFailedFn === undefined ) {
            checkFailedFn = 
                clauseFactory.executeFunction( self.failureClause[ 0 ],
                                               scene, 
                                               self.checkForFailure.bind( self ) );
        }
    }

    self.triggerManager.clearTriggers();
    if ( self.triggers ) {
        self.triggerManager.loadTriggers( self.triggers, scene );
    }

    // Do this last, once all configuration is done.
    self.starting( self.scenarioName );
}

this.checkForSuccess = function() {
    if ( checkSucceededFn && checkSucceededFn() ) {
        self.completed();
    }
}

this.checkForFailure = function() {
    if ( checkFailedFn && checkFailedFn() ) {
        self.failed();
    }
}

this.failed = function() {
    if ( scene ) {
        scene.stopAllExecution();

        //HACK HACK HACK - not sure if this is where we want this but rover execution seems to stop once a scenario is failed.
        var soundManager = scene.find( ".//element(*,'http://vwf.example.com/sound/soundManager.vwf')" )[ 0 ];
        soundManager.stopRoverSounds();
        soundManager.playSound( 'uiNegativeFeedback' );
    }
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
