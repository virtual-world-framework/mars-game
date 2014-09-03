var self;

this.initialize = function() {
    self = this;

    self.functionSets = [];
    self.addFunctionSet(self.clauseSet);
}

this.clauseSet.and = function( params, context, callback ) {
    if ( !params || ( params.length < 1 ) ) {
        self.logger.errorx( "and", "This clause needs to have at " +
                            " least one (and ideally two or more) clauses " +
                            " inside of it." );
        return undefined;
    } else if ( params.length < 2 ) {
        self.logger.warnx( "and", "This clause probably ought to " +
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
        self.logger.errorx( "or", "This clause needs to have at " +
                            "least one (and ideally two or more) clauses " +
                            "inside of it." );
        return undefined;
    } else if ( params.length < 2 ) {
        self.logger.warnx( "or", "This clause probably ought to " +
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
        self.logger.errorx( "not", "This clause needs to have one " +
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

this.clauseSet.hasHeading = function( params, context, callback ) {
    if ( !params || ( params.length !== 2 ) ) {
        self.logger.errorx( "hasHeading", 
                            "This clause requires two " +
                            "arguments: the object and the heading." );
        return undefined;
    }

    var objectName = params[ 0 ];
    var heading = params[ 1 ];

    var object = self.findInContext( context, objectName );

    if ( callback ) {
        object.moved = self.events.add( callback );
    } 

    return function() {
        return ( object.heading === heading );
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

this.clauseSet.onMoved = function( params, context, callback ) {
    if ( !params || ( params.length !== 1 ) ) {
        self.logger.errorx( "onMoved", "this clause requires " +
                            "one argument: the obect." );
    }

    var object = self.findInContext( context, params[ 0 ] );
    var hasMoved = false;

    onClauseCallbackWarning( callback );
    if ( callback ) {
        object.moved = self.events.add( function() {
                                            hasMoved = true;
                                            callback();
                                        } );
    }

    return function() {
        var retVal = hasMoved;
        hasMoved = false;
        return retVal;
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

    onClauseCallbackWarning( callback );
    if ( callback ) {
        // HACK HACK HACK
        // The graph will not exist yet when scenario 2 is setup, but we 
        //  need a callback on it.  This is an awful way to fix that, but
        //  it will get us through the formative study.
        var fullCallback = function( show ) {
            if ( show ) {
                triggerObject = true;
                callback();
            }
        };

        setupOnBlocklyWindowOpenedCallbacks( params, context, fullCallback, 2 );
    }

    return function() {
        var retVal = !!triggerObject;
        triggerObject = null;
        return retVal;
    };
}

function setupOnBlocklyWindowOpenedCallbacks( params, context, callback, tryTime ) {
    var objectArray = getBlocklyObjects( params, context );
    if ( !objectArray ) {
        if ( tryTime > 0 ) {
            setTimeout( function() {
                            setupOnBlocklyWindowOpenedCallbacks( params, 
                                                                 context, 
                                                                 callback, 
                                                                 tryTime - 0.5 );
                        }, 
                        0.5 );
        }
        return;
    }
    for ( var i = 0; i < objectArray.length; ++i ) {
        var object = objectArray[ i ];

        object.blocklyVisibleChanged = self.events.add( callback );
    }
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

// arguments: scenarioToCheck (optional)
this.clauseSet.onScenarioStart = function( params, context, callback ) {
    if ( params && ( params.length > 1 ) ) {
        self.logger.errorx( "onScenarioStart", 
                            "This clause takes at most one argument: " +
                            "the name of the scenario." );
        return undefined;
    }

    var scenarioToCheck = params ? params[ 0 ] : undefined;

    // NOTE: what we want to do is allow this to be true only when the event
    //   has just happened.  Right now, we do this by setting the scenario name
    //   when the event occurs, and then setting it back to undefined in the 
    //   function that we return - but that doesn't enforce the fact that it
    //   should only be true if the function is called right away.  If that 
    //   turns out to be a problem, we may need to use future() or a time 
    //   stamp.
    var scenarioStarted = undefined;

    onClauseCallbackWarning( callback );
    if ( callback ) {
        var localCallback = function( scenario ) {
            var scenarioName = scenario && scenario.scenarioName 
                                ? scenario.scenarioName
                                : "unnamed";
            scenarioStarted = scenarioName;

            callback();
        };

        context.scenarioStarted = self.events.add( localCallback );
    }

    return function() {
        var retVal = ( scenarioStarted !== undefined ) && 
                     ( !scenarioToCheck || ( scenarioStarted === scenarioToCheck ) );

        scenarioStarted = undefined;

        return retVal;
    };
}

// arguments: scenarioToCheck (optional)
this.clauseSet.onScenarioSucceeded = function( params, context, callback ) {
    if ( params && ( params.length > 1 ) ) {
        self.logger.errorx( "onScenarioStart", 
                            "This clause takes at most one argument: " +
                            "the name of the scenario." );
        return undefined;
    }

    var scenarioToCheck = params ? params[ 0 ] : undefined;

    // NOTE: what we want to do is allow this to be true only when the event
    //   has just happened.  Right now, we do this by setting the scenario name
    //   when the event occurs, and then setting it back to undefined in the 
    //   function that we return - but that doesn't enforce the fact that it
    //   should only be true if the function is called right away.  If that 
    //   turns out to be a problem, we may need to use future() or a time 
    //   stamp.
    var scenarioSucceeded = undefined;

    onClauseCallbackWarning( callback );
    if ( callback ) {
        var localCallback = function( scenario ) {
            var scenarioName = scenario && scenario.scenarioName 
                                ? scenario.scenarioName
                                : "unnamed";
            scenarioSucceeded = scenarioName;

            callback();
        };

        context.scenarioSucceeded = self.events.add( localCallback );
    }

    return function() {
        var retVal = ( scenarioSucceeded !== undefined ) && 
                     ( !scenarioToCheck || ( scenarioSucceeded === scenarioToCheck ) );

        scenarioSucceeded = undefined;

        return retVal;
    };
}

// arguments: scenarioToCheck (optional)
this.clauseSet.onScenarioFailed = function( params, context, callback ) {
    if ( params && ( params.length > 1 ) ) {
        self.logger.errorx( "onScenarioStart", 
                            "This clause takes at most one argument: " +
                            "the name of the scenario." );
        return undefined;
    }

    var scenarioToCheck = params ? params[ 0 ] : undefined;

    // NOTE: what we want to do is allow this to be true only when the event
    //   has just happened.  Right now, we do this by setting the scenario name
    //   when the event occurs, and then setting it back to undefined in the 
    //   function that we return - but that doesn't enforce the fact that it
    //   should only be true if the function is called right away.  If that 
    //   turns out to be a problem, we may need to use future() or a time 
    //   stamp.
    var scenarioFailed = undefined;

    onClauseCallbackWarning( callback );
    if ( callback ) {
        var localCallback = function( scenario ) {
            var scenarioName = scenario && scenario.scenarioName 
                                ? scenario.scenarioName
                                : "unnamed";
            scenarioFailed = scenarioName;

            callback();
        };

        context.scenarioFailed = self.events.add( localCallback );
    }

    return function() {
        var retVal = ( scenarioFailed !== undefined ) && 
                     ( !scenarioToCheck || ( scenarioFailed === scenarioToCheck ) );

        scenarioFailed = undefined;

        return retVal;
    };
}

this.clauseSet.onScenarioChanged = function( params, context, callback ) {
    if ( params && ( params.length > 0 ) ) {
        self.logger.errorx( "onScenarioChanged", 
                            "This clause takes no arguments." );
        return undefined;
    }

    onClauseCallbackWarning( callback );
    if ( callback ) {
        context.scenarioChanged = self.events.add( callback );
    }

    return function() {
        return true;
    };
}

this.clauseSet.onVideoPlayed = function( params, context, callback ) {
    if ( !params || params.length !== 1 ) {
        self.logger.warnx( "onIntroScreensComplete", 
                           "This clause takes one argument: The video source." );
        return undefined;
    }

    var videoPlayed = false;
    var videoSrc = params[ 0 ];

    onClauseCallbackWarning( callback );
    if ( callback ) {
        if ( context && context.videoPlayed ) {
            context.videoPlayed = self.events.add( function( src ) {
                                                                if ( src === videoSrc ) {
                                                                    videoPlayed = true;
                                                                }
                                                                callback();
                                                            } );
        }
    }

    return function() {
        var retVal = videoPlayed;
        videoPlayed = false;
        return retVal;
    };
}

this.clauseSet.onHelicamToggle = function( params, context, callback ) {
    if ( params ) {
        self.logger.warnx( "onHelicamToggle", 
                           "This clause doesn't take any arguments." );
    }

    var toggledHelicam = false;

    onClauseCallbackWarning( callback );
    if ( callback ) {
        if ( context && context.toggledHelicam ) {
            context.toggledHelicam = self.events.add( function() {
                toggledHelicam = true;
                callback();
            } );
        }
    }

    return function() {
        var retVal = toggledHelicam;
        toggledHelicam = false;
        return retVal;
    };
}

this.clauseSet.onGraphToggle = function( params, context, callback ) {
    if ( params ) {
        self.logger.warnx( "onGraphToggle", 
                           "This clause doesn't take any arguments." );
    }

    var toggledGraph = false;

    onClauseCallbackWarning( callback );
    if ( callback ) {
        if ( context && context.toggledGraph ) {
            context.toggledGraph = self.events.add( function( value ) {
                if ( value ) {
                    toggledGraph = true;
                    callback();
                }
            } );
        }
    }

    return function() {
        var retVal = toggledGraph;
        toggledGraph = false;
        return retVal;
    };
}

this.clauseSet.onTilesToggle = function( params, context, callback ) {
    if ( params ) {
        self.logger.warnx( "onTilesToggle", 
                           "This clause doesn't take any arguments." );
    }

    var toggledTiles = false;

    onClauseCallbackWarning( callback );
    if ( callback ) {
        if ( context && context.toggledTiles ) {
            context.toggledTiles = self.events.add( function( value ) {
                if ( value ) {
                    toggledTiles = true;
                    callback();
                }
            } );
        }
    }

    return function() {
        var retVal = toggledTiles;
        toggledTiles = false;
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

this.clauseSet.blocklyLineEval = function( params, context, callback ) {
    if ( !params || params.length !== 1 || 
         !params[ 0 ].length || !params[ 0 ].length === 2 ) {
        self.logger.errorx( "blocklyLineEval", "This clause requires an array " +
                            "with the x,y position you want to check against.");
        return undefined;
    }

    var targetPos = params[ 0 ];

    // TODO: should we not hardcode the name?
    var blocklyLine = self.findInContext( context, "blocklyLine" );
    if ( !blocklyLine ) {
        self.logger.errorx( "blocklyLineEval", "Line not found!" );
        return undefined;
    }

    if ( callback ) {
        blocklyLine.lineGraphed = self.events.add( function() {
                                                    callback();
                                                } );
    }

    return function() {
        var x = targetPos[ 0 ];
        var actualPos = blocklyLine.evaluateLineAtPoint( [ x ] );

        return ( targetPos [ 0 ] === actualPos[ 0 ] ) &&
               ( targetPos [ 1 ] === actualPos[ 1 ] );
    }
}

// arguments: variableName
this.clauseSet.readBlackboard = function( params, context ) {
    if ( ( params.length < 1 ) || ( params.length > 2 ) ) {
        self.logger.errorx( "readBlackboard", 
                            "This clause takes one argument: the name of the variable" +
                            " and optionally a second argument for occurance count if" + 
                            " using an incrementing blackboard value" );
        return undefined;
    }

    return function() {
    
        var checkedValue = context.sceneBlackboard[ params[ 0 ] ];

        if ( params[ 1 ] !== undefined ) {
            var retVal = ( checkedValue !== undefined && 
                           checkedValue < params[ 1 ] );
        } else {
            var retVal = ( checkedValue !== undefined );  
        }

        return retVal;
    };
}

this.clauseSet.delay = function( params, context, callback ) {
    if ( params.length !== 1 ) {
        self.logger.errorx( "delay", "This clause takes exactly one argument: " +
                            "the amount of time to delay (in seconds).");
        return undefined;
    }

    var delayTime = params[ 0 ];

    var delayComplete = false;
    var onDelayComplete = function() {
        delayComplete = true;
        callback && callback();
    }
    setTimeout( onDelayComplete, delayTime * 1000 )

    return function() {
        return delayComplete;
    }
}

this.clauseSet.onGameStarted = function( params, context, callback ) {
    if ( params ) {
        self.logger.warnx( "onGameStarted", 
                           "This clause doesn't take any arguments." );
    }

    var gameStarted = false;

    onClauseCallbackWarning( callback );
    if ( callback ) {
        if ( context && context.gameStarted ) {
            context.gameStarted = self.events.add( function() {
                gameStarted = true;
                callback();
            } );
        }
    }

    return function() {
        var retVal = gameStarted;
        gameStarted = false;
        return retVal;
    };
}

this.clauseSet.onHUDMouseOver = function( params, context, callback ) {
    if ( !params || params.length !== 1 ) {
        self.logger.warnx( "onHUDMouseOver", 
                           "This clause takes one argument: The HUD element name." );
    }

    var elementID;

    onClauseCallbackWarning( callback );
    if ( callback ) {
        if ( context && context.mouseOverHUD ) {
            context.mouseOverHUD = self.events.add( function( id ) {
                elementID = id;
                callback();
            } );
        }
    }

    return function() {
        var retVal = params[ 0 ] === elementID;
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
            self.logger.errorx( "getBlocklyObjects", "Context is undefined!" );
            return undefined;
        }

        return context.find( ".//element(*,'http://vwf.example.com/blockly/controller.vwf')" );
    }

    // if the objectParam is a string, look up that particular blockly object and
    //   return it in an array
    if( typeof objectParam === 'string' ) {
        var object = self.findInContext( context, objectParam );
        return !!object ? [ self.findInContext( context, objectParam ) ] : undefined;
    }

    // if the objectParam is an array, look up the blockly object for each entry in
    //   that array, and return an array of the results.
    if ( Object.prototype.toString.call( objectParam ) === '[object Array]' ) {
        var retVal = [];
        for ( var i = 0; i < objectParam.length; ++i ) {
            var object = self.findInContext( context, objectParam[ i ] );
            retVal.push( object );
        }

        return retVal;
    }

    self.logger.errorx( "getBlocklyObjects", "Unable to parse objectParam!" );
    return undefined;
}


//@ sourceURL=source/triggers/booleanFunctionFactory.js
