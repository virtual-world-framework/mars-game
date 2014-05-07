var self;
var cachedScene;
var checkSucceededFn;
var checkFailedFn;
var clauseConstructors = {};

this.initialize = function() {
    self = this;
}

this.entering = function() {
    if ( self.successClause && self.successClause.length > 0 ) {
        if ( self.successClause.length > 1 ) {
             self.logger.errorx( "entering", "The success clause can only " +
                                 "have a single entry.  Try using AND or OR." );
        } else {
            checkSucceededFn = parseClause( self.successClause[ 0 ], 
                                            self.checkForSuccess.bind( self ) );
        }
    }

    if ( self.failureClause && self.failureClause.length > 0 ) {
        if ( self.failureClause.length > 1 ) {
             self.logger.errorx( "entering", "The failure clause can only " +
                                 "have a single entry.  Try using AND or OR." );
        } else {
            checkFailedFn = parseClause( self.failureClause[ 0 ], 
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
        self.failed();
    }
}

function parseClause( clause, callback ) {
    // So this is a little bit ugly...
    // The first thing we're going to do is get the name of the clause, which 
    //  is done using black magic and the power of the internets, as follows:
    var clauseKeys = Object.keys( clause );
    if ( clauseKeys.length != 1 )
    {
        self.logger.errorx( "parseClause", "Malformed clause." );
        return undefined;
    }
    var clauseName = clauseKeys[ 0 ];

    // Now that we've got that, we're going to call the appropriate constructor.
    //  We can manufacture the name of the constructor at runtime - C++ macros, 
    //  eat your heart out.  Into that, we pass the array within the clause, 
    //  which is the [clauseName]'th element of clause.  Yeah, more black magic.
    var clauseParams = clause[ clauseName ];
    var clauseFn = self[ "Clause_" + clauseName ]( clauseParams, callback );
    // if (!constructorFn) {
    //     self.logger.errorx( "parseClause", "Invalid clause type: '" + 
    //                         clauseName + "'." );
    //     return undefined;
    // }

    // Don't fail if the params are invalid - in some cases, that could be 
    //  correct.  instead, guard against it in the constructors.

    // var clauseFn = constructorFn( clauseParams, callback );
    if ( !clauseFn ) {
        self.logger.errorx( "parseClause", "Failed to create clause of " +
                            "type '" + clauseName + "'." );
        return undefined;
    }

    return clauseFn;
}

function findInScene( object ) {
    var results = getScene().find( "//" + object );

    if ( results.length < 1 ) {
        self.logger.errorx( "findInScene", "Object '" + object + 
                            "' not found" );
        return undefined;
    } else if ( results.length > 1 ) {
        self.logger.errorx( "findInScene", "Multiple objects named '" + 
                            object + "' found.  Names must be unique!" );
        return undefined;
    } else {
        return results[ 0 ];
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

this.Clause_isAtPosition = function( params, callback ) {
    if ( !params || ( params.length != 3 ) ) {
         self.logger.errorx( "Clause_isAtPosition", 
                             "The isAtPosition clause requires three " +
                             "arguments: the object, the x, and the y." );
        return undefined;
    }

    var objectName = params[ 0 ];
    var x = params[ 1 ];
    var y = params[ 2 ];

    var object = findInScene( objectName );
 
    object.moved = self.events.add( callback );

    return function() {
        return ( object.currentGridSquare[ 0 ] === x && 
                 object.currentGridSquare[ 1 ] === y );
    };
}

this.Clause_hasObject = function( params, callback ) {
    if ( !params || ( params.length != 2 ) ) {
        self.logger.errorx( "Clause_hasObject", 
                            "The hasObject clause requires two arguments: " +
                            "the owner and the object." );
        return undefined;
    }

    var ownerName = params[ 0 ];
    var objectName = params[ 1 ];

    var owner = findInScene( ownerName );
    var object = findInScene( objectName );

    object.pickedUp = self.events.add( callback );
    object.dropped = self.events.add( callback );

    return function() {
        return owner.find( "*/" + objectName ).length > 0;
    };
}

this.Clause_moveFailed = function( params, callback ) {
    if ( !params || ( params.length != 1 ) ) {
        self.logger.errorx( "Clause_moveFailed", "The moveFailed clause " +
                            "requires one argument: the object." );
        return undefined;
    }

    var objectName = params[ 0 ];

    var object = findInScene( objectName );
    var moveHasFailed = false;

    object.moveFailed = self.events.add( function() {
        moveHasFailed = true;
        callback();
    } );

    return function() {
        return moveHasFailed;
    };
}

this.Clause_AND = function( params, callback ) {
    if ( !params || ( params.length < 1 ) ) {
        self.logger.errorx( "Clause_AND", "The AND clause needs to have at " +
                            " least one (and ideally two or more) clauses " +
                            " inside of it." );
        return undefined;
    } else if ( params.length < 2 ) {
        self.logger.warnx( "Clause_AND", "The AND clause probably ought to " +
                           "have two or more clauses inside of it." );
    }

    var clauses = [];
    for ( var i = 0; i < params.length; ++i ) {
        var thisClause = parseClause( params[ i ], callback );
        thisClause && clauses.push( thisClause );
    }

    return function() {
        for ( var i = 0; i < clauses.length; ++i ) {
            if ( !clauses[ i ]() ) { 
                return false;
            }
        }
        return true;
    }
}

this.Clause_OR = function( params, callback ) {
    if ( !params || ( params.length < 1 ) ) {
        self.logger.errorx( "Clause_OR", "The OR clause needs to have at " +
                            "least one (and ideally two or more) clauses " +
                            "inside of it." );
        return undefined;
    } else if ( params.length < 2 ) {
        self.logger.warnx( "Clause_OR", "The OR clause probably ought to " +
                           "have two or more clauses inside of it." );
    }

    var clauses = [];
    for ( var i = 0; i < params.length; ++i ) {
        var thisClause = parseClause( params[ i ], callback );
        thisClause && clauses.push( thisClause );
    }

   return function() {
        for ( var i = 0; i < clauses.length; ++i ) {
            if ( clauses[ i ]() ) { 
                return true;
            }
        }
        return false;
    }
}

this.Clause_NOT = function( params, callback ) {
    if ( !params || ( params.length != 1 ) ) {
        self.logger.errorx( "Clause_NOT", "The NOT clause needs to have one " +
                            "clause inside of it." );
        return undefined;
    }

    var clause = parseClause( params[ 0 ], callback );

    return function() {
        return !clause();
    }
}

//@ sourceURL=source/scenario.js
