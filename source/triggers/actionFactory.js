var self;

this.initialize = function() {
    self = this;

    self.functionSets = [];
    self.addFunctionSet(self.actionSet);
}

this.actionSet.scenarioSuccess = function( params, context ) {
    if ( params && ( params.length > 1 ) ) {
        self.logger.warnx( "scenarioSuccess", "This action takes one optional argument: a message to display." );
        return undefined;
    }

    var message = params ? params[ 0 ] : undefined;

    return function() {
        var scenario = getScenario( context );
        scenario && scenario.completed( message );
    }
}

this.actionSet.scenarioFailure = function( params, context ) {
    if ( params && ( params.length > 1 ) ) {
        self.logger.warnx( "scenarioFailure", "This action takes one optional argument: a message to display." );
        return undefined;
    }

    var message = params ? params[ 0 ] : undefined;

    return function() {
        var scenario = getScenario( context );
        scenario && scenario.failed( message );
    }
}

this.actionSet.playSound = function( params, context ) {
    if ( !params || ( params.length !== 1 ) ) {
        self.logger.warnx( "playSound", "We need to know the name of the sound to play!" );
        return undefined;
    }

    var soundName = params[ 0 ];
    var soundMgr = getSoundMgr( context );
    
    if ( soundMgr ) {
        return function() {
            // NOTE: I deliberately don't check if the sound is ready.  That 
            //  way, I'll get errors if it's not.
            soundMgr.playSound( soundName );
        };
    } else {
        return undefined;
    }
}

this.actionSet.stopSound = function( params, context ) {
    if ( !params || ( params.length !== 1 ) ) {
        self.logger.warnx( "stopSound", "We need to know the name of the sound to stop!" );
        return undefined;
    }

    var soundName = params[ 0 ];
    var soundMgr = getSoundMgr( context );

    if ( soundMgr ) {
        return function() { soundMgr.stopSoundInstance( soundName ); };
    } else {
        return undefined;
    }
}

this.actionSet.showCommsDisplay = function( params, context ) {
    if ( !params || ( params.length !== 1 ) ) {
        self.logger.warnx( "activateCommDisplay", "We need to know the path of the image to display!" );
    }

    var imagePath = params[ 0 ];
    var scenario = getScenario();

    return function() {
        scenario.showComms( imagePath );
    }
}

this.actionSet.hideCommsDisplay = function( params, context ) {
    if ( params && ( params.length !== 0 ) ) {
        self.logger.warnx( "activateCommDisplay", "This action does not take any parameters." );
    }

    var scenario = getScenario();

    return function() {
        scenario.hideComms();
    }
}

this.actionSet.delay = function( params, context ) {
    if ( params && ( params.length < 2 ) ) {
        self.logger.errorx( "delay", "This action takes two parameters: delay and action(s).");
        return undefined;
    }

    var delay = params[ 0 ];
    if ( delay <= 0 ) {
        self.logger.errorx( "delay", "The delay must be positive." );
        return undefined;
    }

    var actions = [];
    for (var i = 1; i < params.length; ++i ) {
        var action = self.executeFunction( params[ i ], context );
        actions.push( action );
    }

    if ( actions.length === 0 ) {
        return undefined;
    }

    return function() {
        for ( var i = 0; i < actions.length; ++i ) {
            setTimeout( actions[ i ], delay );
        }
    }
}


this.actionSet.writeToBlackboard = function( params, context ) {

    if ( params && ( params.length < 1 ) ) {
        self.logger.errorx( "writeToBlackboard", "This action takes one parameter: variable name.");
        return undefined;
    }

    var blackboard = context.sceneBlackboard;

    return function() {
        blackboard[ params[ 0 ] ] = 1;
    }

}

this.actionSet.incrementBlackboardValue = function( params, context ) {

    if ( params && ( params.length < 1 ) ) {
        self.logger.errorx( "incrementBlackboardValue", "This action takes one parameter: variable name.");
        return undefined;
    }

    var blackboard = context.sceneBlackboard;

    return function() {
        if ( !blackboard[ params[ 0 ] ] ){
            blackboard[ params[ 0 ] ] = 1;
        } else {
            blackboard[ params[ 0 ] ] = blackboard[ params[ 0 ] ] + 1;
        }
        
    }

}



function getScenario( context ) {
    if ( context.getCurrentScenario ){
        return context.getCurrentScenario();
    } else {
        self.logger.errorx( "getScenario", "context does not have a getCurrentScenario " +
                            "method." );
        return undefined;
    }
}

function getSoundMgr( context ) {
    return self.findTypeInContext( context, "http://vwf.example.com/sound/soundManager.vwf" );
}



//@ sourceURL=source/triggers/actionFactory.js
