var self;
var cachedScene;
var checkSucceededFn;
var checkFailedFn;

this.initialize = function() {
    self = this;
}

this.entering = function() {
    var scene = getScene();
    var clauseMgrs = scene.find( "*/element(*,'source/clauseMgr.vwf')" );
    if ( clauseMgrs.length != 1 ) {
        self.logger.errorx( "entering", "There should be exactly one clause manager." );
        return;
    }
    var clauseMgr = clauseMgrs[0];

    if ( self.successClause && self.successClause.length > 0 ) {
        if ( self.successClause.length > 1 ) {
             self.logger.errorx( "entering", "The success clause can only " +
                                 "have a single entry.  Try using AND or OR." );
        } else {
            checkSucceededFn = 
                clauseMgr.constructClause( self.successClause[ 0 ], 
                                           self.checkForSuccess.bind( self ),
                                           scene );
        }
    }

    if ( self.failureClause && self.failureClause.length > 0 ) {
        if ( self.failureClause.length > 1 ) {
             self.logger.errorx( "entering", "The failure clause can only " +
                                 "have a single entry.  Try using AND or OR." );
        } else {
            checkFailedFn = 
                clauseMgr.constructClause( self.failureClause[ 0 ], 
                                           self.checkForFailure.bind( self ),
                                           scene );
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

function getScene() {
    if ( !cachedScene ) {
        var searchArray = self.find( self.scenePath );
        if ( searchArray.length ) {
            cachedScene = searchArray[ 0 ];
        }
    }
    return cachedScene;
}

//@ sourceURL=source/scenario.js
