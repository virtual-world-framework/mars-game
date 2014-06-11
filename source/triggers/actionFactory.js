var self;

this.initialize = function() {
    self = this;

    self.functionSets = [];
    self.addFunctionSet(self.actionSet);
}

this.actionSet.scenarioSuccess = function( params, context ) {
    if ( params && ( params.length !== 0 ) ) {
        this.logger.warnx( "scenarioSuccess", "This action doesn't take any arguments." );
    }

    return function() {
        var scenario = getScenario( context );
        scenario && scenario.completed();
    }
}

this.actionSet.scenarioFailure = function( params, context ) {
    if ( params && ( params.length !== 0 ) ) {
        this.logger.warnx( "scenarioFailure", "This action doesn't take any arguments." );
    }

    return function() {
        var scenario = getScenario( context );
        scenario && scenario.failed();
    }
}

this.actionSet.playSound = function( params, context ) {
    if ( !params || ( params.length !== 1 ) ) {
        this.logger.warnx( "playSound", "We need to know the name of the sound to play!" );
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
        this.logger.warnx( "stopSound", "We need to know the name of the sound to stop!" );
        return undefined;
    }

    var soundName = params[ 0 ];
    var soundMgr = getSoundMgr( context );

    if ( soundMgr ) {
        return function() { soundMgr.stopSound( soundName ); };
    } else {
        return undefined;
    }
}

function getScenario( context ) {
    if ( context.getCurrentScenario ){
        return context.getCurrentScenario();
    } else {
        this.logger.errorx( "getScenario", "context does not have a getCurrentScenario " +
                            "method." );
        return undefined;
    }
}

function getSoundMgr( context ) {
    return self.findTypeInContext( context, "http://vwf.example.com/sound/soundManager.vwf" );
}



//@ sourceURL=source/triggers/actionFactory.js
