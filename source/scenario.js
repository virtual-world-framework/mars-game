var self;
var scene;
var clauseMgr;

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

    var clauseMgrs = scene.find( ".//element(*,'source/clauseMgr.vwf')" );
    if ( clauseMgrs.length == 1 ) {
        clauseMgr = clauseMgrs[0];
    } else {
        self.logger.errorx( "entering", "There should be exactly one clause manager." );
    }
}

this.entering = function() {
    clauseMgr.addClauseSet(self.clauseSet);

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

this.clauseSet.isAtPosition = function( params, callback, context ) {
    if ( !params || ( params.length != 3 ) ) {
        self.logger.errorx( "isAtPosition", 
                            "The isAtPosition clause requires three " +
                            "arguments: the object, the x, and the y." );
        return undefined;
    }

    var objectName = params[ 0 ];
    var x = params[ 1 ];
    var y = params[ 2 ];

    var object = clauseMgr.findInContext( context, objectName );
 
    object.moved = self.events.add( callback );

    return function() {
        return ( object.currentGridSquare[ 0 ] === x && 
                 object.currentGridSquare[ 1 ] === y );
    };
}

this.clauseSet.hasObject = function( params, callback, context ) {
    if ( !params || ( params.length != 2 ) ) {
        self.logger.errorx( "hasObject", 
                            "The hasObject clause requires two arguments: " +
                            "the owner and the object." );
        return undefined;
    }

    var ownerName = params[ 0 ];
    var objectName = params[ 1 ];

    var owner = clauseMgr.findInContext( context, ownerName );
    var object = clauseMgr.findInContext( context, objectName );

    object.pickedUp = self.events.add( callback );
    object.dropped = self.events.add( callback );

    return function() {
        return owner.find( "*/" + objectName ).length > 0;
    };
}

this.clauseSet.moveFailed = function( params, callback, context ) {
    if ( !params || ( params.length != 1 ) ) {
        self.logger.errorx( "moveFailed", "The moveFailed clause " +
                            "requires one argument: the object." );
        return undefined;
    }

    var objectName = params[ 0 ];

    var object = clauseMgr.findInContext( context, objectName );
    var moveHasFailed = false;

    object.moveFailed = self.events.add( function() {
        moveHasFailed = true;
        callback();
    } );

    return function() {
        return moveHasFailed;
    };
}

this.clauseSet.isBlocklyExecuting = function( params, callback, context ) {
    if ( !params || ( params.length != 1 ) ) {
        self.logger.errorx( "isBlocklyExecuting", 
                            "The hasObject clause requires two arguments: " +
                            "the owner and the object." );
        return undefined;
    }

    var objectName = params[ 0 ];

    var object = clauseMgr.findInContext( context, objectName );

    object.blocklyStarted = self.events.add( callback );
    object.blocklyStopped = self.events.add( callback );
    object.blocklyErrored = self.events.add( callback );

    return function() {
        if (object.executing === undefined){
            self.logger.errorx( "isBlocklyExecuting", "The owner doesn't have " +
                                "an 'executing' property - does if support Blockly?" );
        }
        return object.executing;
    };
}

//@ sourceURL=source/scenario.js
