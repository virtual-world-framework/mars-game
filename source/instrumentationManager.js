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
var scene;
var timer;
var camera;

this.initialize = function() {
    
    self = this;
    
    if ( this.enabled === true ) {
        this.future( 0 ).onSceneLoaded();
    }
}

this.onSceneLoaded = function() {
    scene = this.find( "/" )[ 0 ];
    timer = this.find( "//timer" )[ 0 ];
    camera = this.find( "//gameCam" )[ 0 ];

    this.registerEventListeners();
}

this.registerEventListeners = function() {

    scene.gameStarted = ( function( ) {
        this.broadcastEvent( 'gameStarted', '' );
    } ).bind( this );

    scene.scenarioStarted = ( function( ) {
        this.broadcastEvent( 'scenarioStarted', scene.activeScenarioPath );
    } ).bind( this );

    scene.scenarioSucceeded = ( function( ) {
        this.broadcastEvent( 'scenarioSucceeded', scene.activeScenarioPath );
    } ).bind( this );

    scene.scenarioFailed = ( function( ) {
        this.broadcastEvent( 'scenarioFailed', scene.activeScenarioPath );
    } ).bind( this );

    scene.scenarioReset = ( function( scenarioName ) {
        this.broadcastEvent( 'scenarioReset', scenarioName );
    } ).bind( this );

    scene.missionBriefOpened = ( function() {
        this.broadcastEvent( 'missionBriefOpened', '' );
    } ).bind( this );

    scene.missionBriefClosed = ( function() {
        this.broadcastEvent( 'missionBriefClosed', '' );
    } ).bind( this );

    scene.blocklyXmlChanged = ( function( value ) {
        this.broadcastBlockly( value, scene.activeScenarioPath );
    } ).bind( this );

    camera.setCameraPose = ( function( pov ) {
        this.broadcastEvent( 'toggledCamera', pov );
    } ).bind( this );

}

this.broadcastEvent = function( event, value ) {
    var params = [ event, value ];
    this.createRequest ( 'logEvent', params );
}

this.broadcastBlockly = function( xml, scenario ) {
    var params = [ xml, scenario ];
    this.createRequest ( 'logBlockly', params );
}

this.createRequest = function( type, params ) {

    var playerId = scene.playerId;
    var version = scene.version;
    var activeScenario = scene.activeScenarioPath;
    
    var pathArray = window.location.pathname.split( '/' );
    var vwfSession = pathArray[ pathArray.length-2 ];
    
    var time = timer.scenarioElapsedTimes[ timer.currentScenario$ ];

    console.log(activeScenario);
    console.log(time);

    if ( type === 'logEvent' ) {
        if ( !params || ( params.length !== 2 ) ) {
            self.logger.warnx( "createRequest", "The logEvent request takes 2 parameters:" +
                               " an event name and a value associated with the event." );
        }
        
        var xhr = new XMLHttpRequest();
        
        var event = params[ 0 ];
        var value = params[ 1 ];
        
        xhr.open( "POST", this.logEventUrl, true );
        xhr.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
        xhr.send("vwf_session=" + vwfSession + "&player_id=" + playerId + "&action=" + 
                 event + "&value="+value+"$&version="+version+"&scenario="+activeScenario+"&scenarioTime="+time);
         
        var xhrBackup = new XMLHttpRequest();
        xhrBackup.open( "POST", this.logEventUrl2, true );
        xhrBackup.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
        xhrBackup.send("vwf_session=" + vwfSession + "&player_id=" + playerId + "&action=" + 
                event + "&value="+value+"&version="+version+"&scenario="+activeScenario+"&scenarioTime="+time);
        
        
    }
    if ( type === 'logBlockly' ) {
        if ( !params || ( params.length !== 2 ) ) {
            self.logger.warnx( "createRequest", "The logBlockly request takes 2 parameters:" +
                               " the Blockly XML and the scenario name." );
        }
        
        var xhr = new XMLHttpRequest();
        
        var xml = params[ 0 ];
        var scenario = params[ 1 ];
        
        xhr.open( "POST", this.logBlocklyUrl, true );
        xhr.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
        xhr.send("vwf_session=" + vwfSession + "&player_id=" + playerId + "&xml=" + 
                xml + "$&scenario="+scenario+"$&version="+version);
         
        var xhrBackup = new XMLHttpRequest();
        
        xhrBackup.open( "POST", this.logBlocklyUrl2, true );
        xhrBackup.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
        xhrBackup.send("vwf_session=" + vwfSession + "&player_id=" + playerId + "&xml=" + 
                xml + "&scenario="+scenario+"&version="+version);
        
    }
    if ( type === 'logInactivity' ) {
        if ( !params || params.length !== 1 ) {
            self.logger.warnx( "createRequest", "The logInactivity request takes 1 parameter:" +
                               " the activity value." );
        }
        
        var xhr = new XMLHttpRequest();
        
        var activity = params[ 0 ];
        
        xhr.open( "POST", this.logInactivityUrl, true );
        xhr.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
        xhr.send("vwf_session=" + vwfSession + "&player_id=" + playerId + "&action=" + 
                params +"$&version="+version+"$&scenario="+activeScenario);
        
    }
}

this.getRequest = function( type, params ) {

    var version = scene.version;
    
    var pathArray = window.location.pathname.split( '/' );
    var vwfSession = pathArray[ pathArray.length-2 ];
    
    var xhr = new XMLHttpRequest();
    
    if ( type == 'getPlayerState' ) {
        if ( params && ( params.length !== 2 ) ) {
            self.logger.warnx( "getRequest", "The getPlayerState request takes two parameters: " +
                               "the playerId and password." );
        }
        
        var playerId = params[ 0 ];
        var pwd = params[ 1 ];
    
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if ( xhr.readyState === 4 && xhr.status === 200 ) {
                var response = xhr.responseText;
                var scenarioName;
                if ( response === "no account" ) {
                    scene.loginFailed();
                    return;
                } else if ( response.lastIndexOf( "$" ) === response.length - 1 ) {
                    response = response.substr( 0, response.length - 1 );
                }
                if ( scene[ response ] && response !== "mainMenuScenario" ) {
                    scenarioName = response;
                }
                scene.loginSucceeded( playerId, scenarioName );
            }
        }
        
        xhr.open( "POST", this.getPlayerStateUrl, true );
        xhr.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
        xhr.send( "player_id="+playerId+ "&pwd=" + pwd );
    }
    
}

//@ sourceURL=source/instrumentationManager.js