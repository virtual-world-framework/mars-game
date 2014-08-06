var self;

this.initialize = function() {
    self = this;

    self.functionSets = [];
    self.addFunctionSet(self.actionSet);
}

this.actionSet.scenarioSuccess = function( params, context ) {
    if ( params && ( params.length > 2 ) ) {
        self.logger.warnx( "scenarioSuccess", "This action takes one optional argument: "+
                            "the type of success." );
        return undefined;
    }

    var type = params && params[ 0 ] ? params[ 0 ] : undefined;

    return function() {
        var scenario = getScenario( context );
        scenario && scenario.completed( type );
    }
}

this.actionSet.scenarioFailure = function( params, context ) {
    if ( params && ( params.length > 2 ) ) {
        self.logger.warnx( "scenarioFailure", "This action takes two optional arguments: " +
                            "the type of failure, and a message to display." );
        return undefined;
    }

    var type = params[ 0 ];
    var message = params ? params[ 1 ] : undefined;

    return function() {
        var scenario = getScenario( context );
        scenario && scenario.failed( type, message );
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

this.actionSet.setMasterVolume = function( params, context ) {
    if ( !params || ( params.length !== 1 ) || ( params[ 0 ] > 1.0 ) || ( params[ 0 ] < 0.0 ) ) {
        self.logger.warnx( "setMasterVolume", "Takes a single argument 0.0 - 1.0" );
        return undefined;
    }

    var masterVolume = params[ 0 ];
    var soundMgr = getSoundMgr( context );

    if ( soundMgr ) {
        return function() { soundMgr.setMasterVolume( masterVolume ); };
    } else {
        return undefined;
    }
}

this.actionSet.delay = function( params, context ) {
    if ( params && ( params.length < 2 ) ) {
        self.logger.errorx( "delay", "This action takes two parameters: " +
                            "delay (in seconds) and action(s).");
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
            setTimeout( actions[ i ], delay * 1000 );
        }
    }
}


this.actionSet.writeToBlackboard = function( params, context ) {

    if ( params && ( params.length < 1 ) ) {
        self.logger.errorx( "writeToBlackboard", "This action takes one parameter: variable name.");
        return undefined;
    }

    return function() {
        context.sceneBlackboard[ params[ 0 ] ] = 1;
    }

}

this.actionSet.clearBlackboard = function( params, context ) {

    if ( params && ( params.length < 1 ) ) {
        self.logger.errorx( "clearBlackboard", "This action takes one parameter: variable name.");
        return undefined;
    }

    return function() {
        delete context.sceneBlackboard[ params[ 0 ] ];
    }

}

this.actionSet.incrementBlackboardValue = function( params, context ) {

    if ( params && ( params.length < 1 ) ) {
        self.logger.errorx( "incrementBlackboardValue", "This action takes one parameter: variable name.");
        return undefined;
    }

    return function() {
        if ( context.sceneBlackboard[ params[ 0 ] ] === undefined ){
            context.sceneBlackboard[ params[ 0 ] ] = 1;
        } else {
            ++context.sceneBlackboard[ params[ 0 ] ];
        }
        
    }

}

this.actionSet.waitForNode = function ( params, context ) {
    if ( params && ( params.length < 2 ) ) {
        self.logger.errorx( "waitForNode", "This action takes two parameters: The name " +
                            "of the node to wait for and action(s).");
        return undefined;
    }

    var nodeName = params[ 0 ];
    var actions = [];
    for (var i = 1; i < params.length; ++i ) {
        var action = self.executeFunction( params[ i ], context );
        actions.push( action );
    }

    if ( actions.length === 0 ) {
        return undefined;
    }

    var callBack = function() {
        var node = context.find( "//" + nodeName )[ 0 ];

        if ( node ) {
            for ( var i = 0; i < actions.length; ++i ) {
                actions[ i ]();
            }
        } else {
            setTimeout( callBack, 0.1 );
        }
    }

    return callBack;
}

this.actionSet.blinkHUDElement = function( params, context ) {
    if ( params && params.length > 1 ) {
        self.logger.errorx( "blinkHUDElement", "This action takes one parameter: HUD element ID.");
        return undefined;
    }

    var elementID = params[ 0 ];
    return function() {
        context.blinkHUD( elementID );
    }
}

this.actionSet.stopBlinkHUDElement = function( params, context ) {
    if ( params && params.length > 1 ) {
        self.logger.errorx( "stopBlinkHUDElement", "This action takes one parameter: HUD element ID.");
        return undefined;
    }

    var elementID = params[ 0 ];
    return function() {
        context.stopBlinkHUD( elementID );
    }
}

this.actionSet.blinkBlocklyTab = function( params, context ) {
    if ( params && params.length > 1 ) {
        self.logger.errorx( "blinkBlocklyTab", "This action takes one parameter: The name of the " +
                            "blockly node associated with the tab.");
        return undefined;
    }

    var objectName = params[ 0 ];
    
    return function() {
        var object = context.find( "//" + objectName  )[ 0 ];
        context.blinkTab( object.id );
    }
}

this.actionSet.stopBlinkBlocklyTab = function( params, context ) {
    if ( params && params.length > 1 ) {
        self.logger.errorx( "stopBlinkBlocklyTab", "This action takes one parameter: The name of the " +
                            "blockly node associated with the tab.");
        return undefined;
    }

    var objectName = params[ 0 ];
    
    return function() {
        var object = context.find( "//" + objectName  )[ 0 ];
        context.stopBlinkTab( object.id );
    }
}

this.actionSet.hideBlockly = function( params, context ) {
    if ( params && params.length > 0 ) {
        self.logger.errorx( "hideBlockly", "This action takes no parameters.");
        return undefined;
    }
    
    return function() {
        vwf_view.kernel.setProperty( vwf_view.kernel.application(), "blockly_activeNodeID", undefined );
    }
}

this.actionSet.clearBlockly = function( params, context ) {
    if ( params && params.length > 0 ) {
        self.logger.errorx( "clearBlockly", "This action takes no parameters.");
        return undefined;
    }
    
    return function() {
        context.clearBlockly();
    }
}

this.actionSet.disableHelicam = function( params, context ) {
    if ( params && params.length > 0 ) {
        self.logger.errorx( "disableHelicam", "This action takes no parameters.");
        return undefined;
    }
    
    return function() {
        context.disableHelicam();
    }
}

this.actionSet.enableHelicam = function( params, context ) {
    if ( params && params.length > 0 ) {
        self.logger.errorx( "enableHelicam", "This action takes no parameters.");
        return undefined;
    }
    
    return function() {
        context.enableHelicam();
    }
}

this.actionSet.panCamera = function( params, context ) {
    if ( params && params.length > 1 ) {
        self.logger.errorx( "panCamera", "This action takes one parameter: the " +
                            "path of the node to pan towards.");
        return undefined;        
    }

    var targetPath = params[ 0 ];
    var camera = context.find( "//camera" )[ 0 ];

    return function() {
        camera.setTargetPath$( targetPath );
    }
}

this.actionSet.orbitCamera = function( params, context ) {
    if ( params && params.length > 2 ) {
        self.logger.errorx( "orbitCamera", "This action takes one parameter: the " +
                            "speed at which the camera orbits the target node ( in rads/sec ), " +
                            "and the time (in seconds) to automatically stop orbiting." );
        return undefined;        
    }

    var speed = params[ 0 ];
    var hardStop = params[ 1 ];
    var camera = context.find( "//camera" )[ 0 ];
    var hardStopID = setTimeout( setOrbitingFalse( camera ), hardStop * 1000 );
    camera.orbiting = true;
    camera.pointOfView = "thirdPerson";    

    var callback = function() {
        camera.orbitTarget$( speed );
        if ( camera.orbiting ) {
            setTimeout( callback, 0.1 );
        } else {
            clearTimeout( hardStopID );
        }
    }

    return callback;
}

this.actionSet.showStatus = function( params, context ) {
    if ( !params || params.length > 1 ) {
        self.logger.errorx( "showStatus", "This action takes one parameter: the status to show." );
        return undefined;
    }

    var status = params[ 0 ];

    return function() {
        context.addStatus( status );
    }
}

this.actionSet.showAlert = function( params, context ) {
    if ( !params || params.length > 1 ) {
        self.logger.errorx( "showAlert", "This action takes one parameter: the alert to show." );
        return undefined;
    }

    var alert = params[ 0 ];

    return function() {
        context.addAlert( alert );
    }
}

this.actionSet.resetRoverSensors = function( params, context ) {
    if ( params && params.length > 0 ) {
        self.logger.errorx( "resetRoverSensors", "This action takes no parameters.");
        return undefined;
    }
    
    return function() {
        context.resetRoverSensors();
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

function setOrbitingFalse( camera ) {
    camera.orbiting && ( camera.orbiting = false );
}



//@ sourceURL=source/triggers/actionFactory.js
