// Copyright 2014 Lockheed Martin Corporation
//
// Licensed under the Apache License, Version 2.0 (the "License"); you may 
// not use this file except in compliance with the License. You may obtain 
// a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software 
// distributed under the License is distributed on an "AS IS" BASIS, 
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and 
// limitations under the License.

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

this.actionSet.initGameOnLoad = function( params, context ) {
    if ( params && params.length !== 0 ) {
        self.logger.warnx( "initGameOnLoad", "This action takes no arguments." )
    }

    var camera = context.player.targetFollower.camera;

    return function() {
        camera.resetCameraPose();
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

this.actionSet.stopSoundGroup = function( params, context ) {
    if ( !params || ( params.length !== 1 ) ) {
        self.logger.warnx( "stopSoundGroup", "We need to know the name of the sound group to stop!" );
        return undefined;
    }

    var groupName = params[ 0 ];
    var soundMgr = getSoundMgr( context );

    if ( soundMgr ) {
        return function() { soundMgr.stopSoundGroup( groupName ); };
    } else {
        return undefined;
    }
}

this.actionSet.stopAllSounds = function( params, context ) {
    if ( !params || ( params.length !== 0 ) ) {
        self.logger.warnx( "stopAllSounds", "stopAllSounds doesn't take any parameters!" );
    }

    var soundMgr = getSoundMgr( context );

    if ( soundMgr ) {
        return function() { soundMgr.stopAllSoundInstances(); };
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

    if ( !params || ( params.length > 2 ) || !params[ 0 ] ) {
        self.logger.errorx( "writeToBlackboard", 
                            "This action takes a variable name and an " +
                            "optional value." );
        return undefined;
    } 

    var name = params[ 0 ];
    var value = params.length === 2 ? params[ 1 ] : 1;

    switch ( name ) {
        case "lastHeading$":
        case "lastRotation$":
            self.logger.errorx( "writeToBlackboard", "The '" + name + "' " +
                                "parameter is reserved for internal use." );
            return undefined;
        default:
            return function() {
                context.sceneBlackboard[ name ] = value;
            }
    }
}

this.actionSet.clearBlackboardEntry = function( params, context ) {

    if ( params && ( params.length < 1 ) ) {
        self.logger.errorx( "clearBlackboardEntry", "This action takes one " +
                            "parameter: variable name.");
        return undefined;
    }

    return function() {
        context.sceneBlackboard[ params[ 0 ] ] = undefined;
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

this.actionSet.setHUDProperty = function( params, context ) {
    if ( !params || params.length !== 3 ) {
        self.logger.errorx( "setHUDProperty", "This action takes three parameters: " +
                            "The HUD element's name, the property to change, and the " +
                            "value to set the property to.");
        return undefined;
    }

    var element = params[ 0 ];
    var property = params[ 1 ];
    var value = params[ 2 ];
    
    return function() {
        context.setHUDElementProperty( element, property, value );
    }
}

this.actionSet.panCamera = function( params, context ) {
    if ( params && params.length > 2 ) {
        self.logger.errorx( "panCamera", "This action takes two parameters: the " +
                            "path of the node to pan towards and an optional duration " +
                            "for the camera to target that node before returning to " +
                            "its original target.");
        return undefined;        
    }

    var targetPath = params[ 0 ];
    var duration = params[ 1 ];
    var targetFollower = context.player.targetFollower;

    return function() {
        var lastTargetPath = targetFollower.targetPath;
        targetFollower.camera.pointOfView = "thirdPerson";
        targetFollower.setTargetPath$( targetPath );
        if ( !isNaN( duration ) ) {
            targetFollower.future( duration ).setTargetPath$( lastTargetPath );
        }
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
    var camera = context.player.targetFollower.camera;
    var hardStopID = setTimeout( setOrbitingFalse( camera ), hardStop * 1000 );
    camera.orbiting = true;

    var callback = function() {
        if ( camera.pointOfView !== "thirdPerson" ) {
            camera.pointOfView = "thirdPerson";
        }
        camera.orbitTarget$( speed );
        if ( camera.orbiting ) {
            setTimeout( callback, 0.1 );
        } else {
            clearTimeout( hardStopID );
        }
    }

    return callback;
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

this.actionSet.resetHUDState = function( params, context ) {
    if ( params && params.length > 0 ) {
        self.logger.errorx( "resetHUDState", "This action takes no parameters.");
        return undefined;
    }

    return function() {
        context.resetHUDState();
    }
}

this.actionSet.playVideo = function( params, context ) {
    if ( !params || params.length > 1 ) {
        self.logger.errorx( "playVideo", "This action takes one parameter: the source of the video");
        return undefined;
    }

    var src = params[ 0 ];

    return function() {
        context.playVideo( src );
    }
}

this.actionSet.setCinematicCameraView = function( params, context ) {
    if ( !params || params.length !== 1 ) {
        self.logger.errorx( "setCinematicCameraView", "This action takes one parameter: An array " +
                            "containing the radius (meters), yaw (degrees), and pitch (degrees) " +
                            "of the camera." );
        return undefined;
    }

    var pose = params[ 0 ];

    return function() {
        context.setCinematicView( pose );
    }
}

this.actionSet.setThirdPersonStartPose = function( params, context ) {
    if ( !params || params.length !== 1 ) {
        self.logger.errorx( "setCinematicCameraView", "This action takes one parameter: An array " +
                            "containing the radius (meters), yaw (degrees), and pitch (degrees) " +
                            "of the camera." );
        return undefined;
    }

    var pose = params[ 0 ];
    var camera = context.player.targetFollower.camera;

    return function() {
        camera.thirdPersonStartPose = pose;
    }
}

this.actionSet.resetCameraView = function( params, context ) {
    if ( params && params.length > 0 ) {
        self.logger.warnx( "resetCameraView", "This action does not take parameters." );
    }

    return function() {
        context.resetView();
    }
}

this.actionSet.callOutObjective = function( params, context ) {
    if ( params && params.length !== 1 ) {
        self.logger.warnx( "callOutObjective", "This action takes one parameter: The " +
                                               "coordinates of the tile to be called out." );
        return undefined;
    }

    var callOutTile = context.gridTileGraph.callOutTile;
    var grid = context[ context.activeScenarioPath ].grid;
    var tileCoords = params[ 0 ];

    return function() {
        var coords = grid.getWorldFromGrid( tileCoords[ 0 ], tileCoords[ 1 ] );
        callOutTile.callOut( coords );
    }
}

this.actionSet.cancelCallOut = function( params, context ) {
    if ( params && params.length > 0 ) {
        self.logger.warnx( "cancelCallOut", "This action takes no parameters." );
    }

    var callOutTile = context.gridTileGraph.callOutTile;

    return function() {
        callOutTile.stopBlink();
    }
}

this.actionSet.setObjective = function( params, context ) {
    if ( params && params.length !== 1 ) {
        self.logger.warnx( "setObjective", "This action takes one parameter: The mission " +
                                           "objective text." );
        return undefined;
    }

    var text = params[ 0 ];

    return function() {
        context.setObjective( text );
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
