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
    } 

    return function() {
        return owner.find( "*/" + objectName ).length > 0;
    };
}

this.clauseSet.moveFailed = function( params, context, callback ) {
    if ( !params || ( params.length < 1 ) || ( params.length > 2 ) ) {
        self.logger.errorx( "moveFailed", "This clause requires " + 
                            "one argument: the object, and takes " +
                            "an additional optional argument: the " +
                            "type of failure. " );
    }

    var objectName = params[ 0 ];
    var failureType = params[ 1 ];

    var object = self.findInContext( context, objectName );
    var moveHasFailed = false;

    if ( callback ) {
        object.moveFailed = self.events.add( function( situation ) {
                                                moveHasFailed = !failureType || ( failureType === situation );
                                                if ( moveHasFailed ){
                                                    callback();
                                                }
                                            } );
    }

    return function() {
        return moveHasFailed;
    }
}

this.clauseSet.isBlocklyExecuting = function( params, context, callback ) {
    var objectArray = getBlocklyObjects( params, context );

    if ( callback ) {
        for ( var i = 0; i < objectArray.length; ++i ) {
            var object = objectArray[ i ];

            object.blocklyStarted = self.events.add( callback );
            object.blocklyStopped = self.events.add( callback );
            object.blocklyErrored = self.events.add( callback );
        } 
    }

    return function() {
        for ( var i = 0; i < objectArray.length; ++i ) {
            var object = objectArray[ i ];
            if ( object.blockly_executing ) {
                return true;
            }
        }

        return false;
    };
}

this.clauseSet.onBlocklyStarted = function( params, context, callback ) {
    // Set this to the object that started when the event occurs, back to null
    //   in the function that we return (so it only fires once).
    // TODO: do we need to limit the time for which this is true?  Do we even 
    //   need this restriction?
    var triggerObject = null;
    var objectArray = getBlocklyObjects( params, context );

    onClauseCallbackWarning( callback );
    if ( callback ) {
        for ( var i = 0; i < objectArray.length; ++i ) {
            var object = objectArray[ i ];

            var fullCallback = function() {
                triggerObject = object;
                callback();
            };

            object.blocklyStarted = self.events.add( fullCallback );
        } 
    }

    return function() {
        var retVal = !!triggerObject;
        triggerObject = null;
        return retVal;
    };
}

this.clauseSet.onBlocklyStopped = function( params, context, callback ) {
    // Set this to the object that started when the event occurs, back to null
    //   in the function that we return (so it only fires once).
    // TODO: do we need to limit the time for which this is true?  Do we even 
    //   need this restriction?
    var triggerObject = null;
    var objectArray = getBlocklyObjects( params, context );

    onClauseCallbackWarning( callback );
    if ( callback ) {
        for ( var i = 0; i < objectArray.length; ++i ) {
            var object = objectArray[ i ];

            var fullCallback = function() {
                triggerObject = object;
                callback();
            };

            object.blocklyStopped = self.events.add( fullCallback );
            object.blocklyErrored = self.events.add( fullCallback );
        } 
    }

    return function() {
        var retVal = !!triggerObject;
        triggerObject = null;
        return retVal;
    };
}

this.clauseSet.onBlocklyWindowOpened = function( params, context, callback ) {
    // Set this to the object that started when the event occurs, back to null
    //   in the function that we return (so it only fires once).
    // TODO: do we need to limit the time for which this is true?  Do we even 
    //   need this restriction?
    var triggerObject = null;
    var objectArray = getBlocklyObjects( params, context );

    onClauseCallbackWarning( callback );
    if ( callback ) {
        for ( var i = 0; i < objectArray.length; ++i ) {
            var object = objectArray[ i ];

            var fullCallback = function( show ) {
                if ( show ) {
                    triggerObject = object;
                    callback();
                }
            };

            object.blocklyVisibleChanged = self.events.add( fullCallback );
        }
    }

    return function() {
        var retVal = !!triggerObject;
        triggerObject = null;
        return retVal;
    };
}

this.clauseSet.onBlocklyProgramChanged = function( params, context, callback ) {
    var objectArray = [];
    var addOrRemove = "either";
    var blockTypes = [];

    if ( params ) {
        // Get the objects that can make us fire
        objectArray = getBlocklyObjects( params, context );

        // Determine whether we should fire when a block is added, removed,
        //   or both.
        if ( params[ 1 ] ) {
            addOrRemove = params[ 1 ];
            if ( ( addOrRemove !== "add" ) && ( addOrRemove !== "remove" ) &&
                 ( addOrRemove !== "either" ) ) {
                this.logger.errorx( "onBlocklyProgramChanged", 
                                    "The second parameter should be 'add', " +
                                    "'remove', or 'either', indicating when " +
                                    "this trigger should fire." );
                addOrRemove = "either";
            }
        }

        // Get the list of blocks that can make us fire (an empty list means
        //   any block will do).
        var blockTypeParam = params[ 2 ];
        if( typeof blockTypeParam === 'string' ) {
            blockTypes = [ blockTypeParam ];
        } else if ( Object.prototype.toString.call( blockTypeParam ) === '[object Array]' ) {
            blockTypes = blockTypeParam;
        } else if ( !!blockTypeParam ) {
            this.logger.errorx( "onBlocklyProgramChanged", 
                                "Unable to parse the array of block types." );
        }
    }

    // Set this to the object and block type that we get from the event, then 
    //   clear it if this trigger fires.
    // TODO: do we need to limit the time for which this is true?  Do we even 
    //   need this restriction?
    var triggerObject = null;
    var triggerBlockType = undefined;

    onClauseCallbackWarning( callback );
    if ( callback ) {
        for ( var i = 0; i < objectArray.length; ++i ) {
            var object = objectArray[ i ];

            var fullCallback = function( ignoreMe, blockType ) {
                triggerObject = object;
                triggerBlockType = blockType;
                callback();
            };

            // Warning - I'm getting fancy here. The logic is twisted around
            //   backwards. :)
            if ( addOrRemove !== "add" ) {
                object.blocklyBlockRemoved = self.events.add( fullCallback );
            }
            if (addOrRemove !== "remove" ) {
                object.blocklyBlockAdded = self.events.add( fullCallback );
            }
        }
    }

    return function() {
        var retVal = true;
        if ( !triggerObject ) {
            retVal = false;
        } else if ( blockTypes.length > 0 ) {
            var blockTypeFound = false;
            for ( var i = 0; i < blockTypes.length && !blockTypeFound; ++i ) {
                if ( triggerBlockType === blockTypes[ i ] ) {
                    blockTypeFound = true;
                }
            }
            retVal = blockTypeFound;
        }

        triggerObject = null;
        triggerBlockType = undefined;

        return retVal;
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

    onClauseCallbackWarning( callback );
    if ( callback ) {
        var scenario = self.findInContext( context, context.activeScenarioPath );

        if ( scenario ) {
            scenario.entering = self.events.add( function( startingName ) {
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

this.clauseSet.onIntroScreensComplete = function( params, context, callback ) {
    if ( params ) {
        self.logger.warnx( "onIntroScreensComplete", 
                           "This clause doesn't take any arguments." );
    }

    var introScreensComplete = false;

    onClauseCallbackWarning( callback );
    if ( callback ) {
        if ( context && context.introScreensComplete ) {
            context.introScreensComplete = self.events.add( function() {
                                                                introScreensComplete = true;
                                                                callback();
                                                            } );
        }
    }

    return function() {
        var retVal = introScreensComplete;
        introScreensComplete = false;
        return retVal;
    };
}

this.clauseSet.doOnce = function( params, context, callback ) {
    if ( params ) {
        self.logger.warnx( "doOnce", "This clause doesn't take any arguments." );
    }

    if ( callback ) {
        self.logger.warnx( "doOnce", "This clause can't do anything with a callback." );
    }

    var wasDone = false;

    return function() {
        var retVal = !wasDone;
        wasDone = true;
        return retVal;
    };
}

function onClauseCallbackWarning( callback ) {
      if ( !callback ) {
        self.logger.warnx( "onClauseCallbackWarning", 
                           "The on... clauses are meant to be immediate triggers, " +
                           "but no callback was found.");
    }  
}

function getBlocklyObjects( params, context ) {
    var objectParam = params ? params[ 0 ] : undefined;

    // if the objectParam is undefined, we return all of the blockly objects
    if ( !objectParam || ( objectParam.length === 0 ) ) {
        if (!context) {
            self.logger.errorx( "getBlocklyObjects", "Context  is undefined!" );
            return undefined;
        }

        return context.find( ".//element(*,'http://vwf.example.com/blockly/controller.vwf')" );
    }

    // if the objectParam is a string, look up that particular blockly object and
    //   return it in an array
    if( typeof objectParam === 'string' ) {
        return [ self.findInContext( context, objectParam ) ];
    }

    // if the objectParam is an array, look up the blockly object for each entry in
    //   that array, and return an array of the results.
    if ( Object.prototype.toString.call( objectParam ) === '[object Array]' ) {
        var retVal = [];
        for ( var i = 0; i < objectParam.length; ++i ) {
            var object = self.findInContext( context, objectParam[ i ] );
            object && retVal.push( object );
        }

        return retVal;
    }

    self.logger.errorx( "getBlocklyObjects", "Unable to parse objectParam!" );
    return undefined;
}

//@ sourceURL=source/triggers/booleanFunctionFactory.js
