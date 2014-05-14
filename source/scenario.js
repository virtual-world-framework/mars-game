var self;
var scene;
var clauseFactory;

var checkSucceededFn;
var checkFailedFn;

this.initialize = function() {
    self = this;
    self.future(0).onSceneReady();
}

this.onSceneReady = function() {
    var searchArray = self.find( self.scenePath );
    if ( searchArray.length ) {
        scene = searchArray[ 0 ];
    }

    var clauseFactories = scene.find( ".//element(*,'source/booleanFunctionFactory.vwf')" );
    if ( clauseFactories.length === 1 ) {
        clauseFactory = clauseFactories[0];
    } else {
        self.logger.errorx( "entering", "There should be exactly one booleanFunctionFactory, " +
                            "at least for now." );
    }
}

this.entering = function() {
    if ( self.successClause && self.successClause.length > 0 ) {
        if ( self.successClause.length > 1 ) {
             self.logger.errorx( "entering", "The success clause can only " +
                                 "have a single entry.  Try using AND or OR." );
        } else {
            checkSucceededFn = 
                clauseFactory.executeFunction( self.successClause[ 0 ],
                                               scene, 
                                               self.checkForSuccess.bind( self ));
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
                                               self.checkForFailure.bind( self ));
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
        self.failed();
    }
}

//@ sourceURL=source/scenario.js
