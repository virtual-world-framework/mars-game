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

    var message = params[ 0 ] !== undefined ? params[ 0 ] : "";

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

    var message = params[ 0 ] !== undefined ? params[ 0 ] : "";

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
