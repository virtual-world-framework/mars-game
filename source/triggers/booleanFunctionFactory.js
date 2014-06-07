var self;

this.initialize = function() {
    self = this;

    self.functionSets = [];
    self.addFunctionSet(self.clauseSet);
}

this.clauseSet.and = function( params, context, callback ) {
    if ( !params || ( params.length < 1 ) ) {
        this.logger.errorx( "and", "This clause needs to have at " +
                            " least one (and ideally two or more) clauses " +
                            " inside of it." );
        return undefined;
    } else if ( params.length < 2 ) {
        this.logger.warnx( "and", "This clause probably ought to " +
                           "have two or more clauses inside of it." );
    }

    var clauses = [];
    for ( var i = 0; i < params.length; ++i ) {
        var clause = self.executeFunction( params[ i ], context, callback );
        clause && clauses.push( clause );
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

this.clauseSet.or = function( params, context, callback ) {
    if ( !params || ( params.length < 1 ) ) {
        this.logger.errorx( "or", "This clause needs to have at " +
                            "least one (and ideally two or more) clauses " +
                            "inside of it." );
        return undefined;
    } else if ( params.length < 2 ) {
        this.logger.warnx( "or", "This clause probably ought to " +
                           "have two or more clauses inside of it." );
    }

    var clauses = [];
    for ( var i = 0; i < params.length; ++i ) {
        var clause = self.executeFunction( params[ i ], context, callback );
        clause && clauses.push( clause );
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

this.clauseSet.not = function( params, context, callback ) {
    if ( !params || ( params.length !== 1 ) ) {
        this.logger.errorx( "not", "This clause needs to have one " +
                            "clause inside of it." );
        return undefined;
    }

    var clause = self.executeFunction( params[ 0 ], context, callback );

    return function() {
    	var result = clause();
        return !result;
    }
}

this.clauseSet.isAtPosition = function( params, context, callback ) {
    if ( !params || ( params.length !== 3 ) ) {
        self.logger.errorx( "isAtPosition", 
                            "This clause requires three " +
                            "arguments: the object, the x, and the y." );
        return undefined;
    }

    var objectName = params[ 0 ];
    var x = params[ 1 ];
    var y = params[ 2 ];

    var object = self.findInContext( context, objectName );

    if ( callback ) {
        object.moved = self.events.add( callback );
    } else {
        self.logger.warnx( "isAtPosition", "No callback defined!" );        
    }

    return function() {
        return ( object.currentGridSquare[ 0 ] === x && 
                 object.currentGridSquare[ 1 ] === y );
    };
}

this.clauseSet.hasObject = function( params, context, callback ) {
    if ( !params || ( params.length !== 2 ) ) {
        self.logger.errorx( "hasObject", 
                            "This clause requires two arguments: " +
                            "the owner and the object." );
        return undefined;
    }

    var ownerName = params[ 0 ];
    var objectName = params[ 1 ];

    var owner = self.findInContext( context, ownerName );
    var object = self.findInContext( context, objectName );

    if ( callback ) {
        object.pickedUp = self.events.add( callback );
        object.dropped = self.events.add( callback );
    } else {
        self.logger.warnx( "hasObject", "No callback defined!" );        
    }

    return function() {
        return owner.find( "*/" + objectName ).length > 0;
    };
}

this.clauseSet.moveFailed = function( params, context, callback ) {
    if ( !params || ( params.length !== 1 ) ) {
        self.logger.errorx( "moveFailed", "This clause " +
                            "requires one argument: the object." );
        return undefined;
    }

    var objectName = params[ 0 ];

    var object = self.findInContext( context, objectName );
    var moveHasFailed = false;

    if ( callback ) {
        object.moveFailed = self.events.add( function() {
                                                moveHasFailed = true;
                                                callback();
                                            } );
    } else {
        self.logger.warnx( "moveFailed", "No callback defined!" );        
    }

    return function() {
        return moveHasFailed;
    };
}

this.clauseSet.isBlocklyExecuting = function( params, context, callback ) {
    if ( !params || ( params.length !== 1 ) ) {
        self.logger.errorx( "isBlocklyExecuting", 
                            "This clause requires two arguments: " +
                            "the owner and the object." );
        return undefined;
    }

    var objectName = params[ 0 ];

    var object = self.findInContext( context, objectName );

    if ( callback ) {
        object.blocklyStarted = self.events.add( callback );
        object.blocklyStopped = self.events.add( callback );
        object.blocklyErrored = self.events.add( callback );
    } else {
        self.logger.warnx( "isBlocklyExecuting", "No callback defined!" );        
    }

    return function() {
        if (object.blockly_executing === undefined){
            self.logger.errorx( "isBlocklyExecuting", "The owner doesn't have " +
                                "a 'blockly_executing' property - does it support Blockly?" );
        }
        return object.blockly_executing;
    };
}

// arguments: scenarioName (optional)
this.clauseSet.onScenarioStart = function( params, context, callback ) {
    if ( params && ( params.length > 1 ) ) {
        self.logger.errorx( "onScenarioStart", 
                            "This clause takes at most one argument: " +
                            "the name of the scenario." );
        return undefined;
    }

    var scenarioName = params ? params[ 0 ] : undefined;

    // NOTE: what we want to do is allow this to be true only when the scenario
    //   has just started.  Right now, we do this by setting the scenario name
    //   when the event occurs, and then setting it back to undefined in the 
    //   function that we return - but that doesn't enforce the fact that it
    //   should only be true if the function is called right away.  If that 
    //   turns out to be a problem, we may need to use future() or a time 
    //   stamp.
    var scenarioStarted = undefined;

    if ( callback ) {
        var scenario = self.findTypeInContext( context, "source/scenario.vwf" );

        if ( scenario ) {
            scenario.starting = self.events.add( function( startingName ) {
                                                    scenarioStarted = startingName;
                                                    callback();
                                                } );
        }
    }

    return function() {
        var retVal = ( scenarioStarted !== undefined ) && 
                     ( !scenarioName || ( scenarioStarted === scenarioName ) );

        scenarioStarted = undefined;

        return retVal;
    };
}

//@ sourceURL=source/triggers/booleanFunctionFactory.js
