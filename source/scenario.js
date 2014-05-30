var self;
var scene;
var clauseFactory;

var checkSucceededFn;
var checkFailedFn;

this.initialize = function() {
    self = this;

    this.children.create( "startStateExecutor", 
                          "source/declarativeFunctionExecutor.vwf" );

    self.future( 0 ).onSceneReady();
}

this.onSceneReady = function() {
    var searchArray = self.find( self.scenePath );
    if ( searchArray.length ) {
        scene = searchArray[ 0 ];
    } else {
        self.logger.errorx( "onSceneReady", "Failed to find the scene!" );
    }

    self.startStateExecutor.functionSets = [];
    self.startStateExecutor.addFunctionSet( self.startStateParamSet );

    var clauseFactories = scene.find( ".//element(*,'source/booleanFunctionFactory.vwf')" );
    if ( clauseFactories.length === 1 ) {
        clauseFactory = clauseFactories[0];
    } else {
        self.logger.errorx( "onSceneReady", "There should be exactly one booleanFunctionFactory, " +
                            "at least for now." );
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
        } else {
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
        } else {
            checkFailedFn = 
                clauseFactory.executeFunction( self.failureClause[ 0 ],
                                               scene, 
                                               self.checkForFailure.bind( self ) );
        }
    }
}

this.checkForSuccess = function() {
    if ( checkSucceededFn && checkSucceededFn() ) {
        self.completed();
    }
}

this.checkForFailure = function() {
    if ( checkFailedFn && checkFailedFn() ) {
        if ( scene ) {
            scene.stopAllExecution();
        }
        self.failed();
    }
}

this.startStateParamSet.battery = function( params, context ) {
    if ( !params || ( params.length != 3 ) ) {
        self.logger.errorx( "battery", 
                            "The battery start condition requires three " +
                            "arguments: the object, the starting power, " +
                            "and the max power." );
        return undefined;
    }

    var objectName = params[ 0 ];
    var starting = params[ 1 ];
    var max = params[ 2 ];

    var object = self.startStateExecutor.findInContext( context, objectName );
    object.battery = starting;
    object.batteryMax = max;
}

this.startStateParamSet.ram = function( params, context ) {
    if ( !params || ( params.length != 2 ) ) {
        self.logger.errorx( "ram", 
                            "The ram start condition requires two " +
                            "arguments: the object, and the max number of, " +
                            "Blockly commands." );
        return undefined;
    }

    var objectName = params[ 0 ];
    var startingRam = params[ 1 ];

    var object = self.startStateExecutor.findInContext( context, objectName );

    // If we want each block to take 1 unit of RAM then these values should
    //  be the same.
    object.ram = startingRam;
    object.blockly_allowedBlocks = startingRam;
}

//@ sourceURL=source/scenario.js
