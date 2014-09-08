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
    
    if ( this.enabled === true ) {
        this.future( 0 ).registerGameStartedListener();
        this.future( 0 ).registerScenarioStartedListener();
        this.future( 0 ).registerScenarioSucceededListener();
        this.future( 0 ).registerScenarioFailedListener();
        this.future( 0 ).registerScenarioResetListener();
    }
}

this.registerGameStartedListener = function() {
    var scene = this.find( "/" )[ 0 ];
    scene.gameStarted = ( function( ) {
        this.broadcastEvent( 'gameStarted', '' );
    } ).bind( this );
}

this.registerScenarioStartedListener = function() {
    var scene = this.find( "/" )[ 0 ];
    scene.scenarioStarted = ( function( ) {
        this.broadcastEvent( 'scenarioStarted', scene.activeScenarioPath );
    } ).bind( this );
}

this.registerScenarioSucceededListener = function() {
    var scene = this.find( "/" )[ 0 ];
    scene.scenarioSucceeded = ( function( ) {
        this.broadcastEvent( 'scenarioSucceeded', scene.activeScenarioPath );
    } ).bind( this );
}

this.registerScenarioFailedListener = function() {
    var scene = this.find( "/" )[ 0 ];
    scene.scenarioFailed = ( function( ) {
        this.broadcastEvent( 'scenarioFailed', scene.activeScenarioPath );
    } ).bind( this );
}

this.registerScenarioResetListener = function() {
    var scene = this.find( "/" )[ 0 ];
    scene.scenarioReset = ( function( scenarioName ) {
        this.broadcastEvent( 'scenarioReset', scenarioName );
    } ).bind( this );
}

this.broadcastEvent = function( event, value ) {
    var params = [ event, value ];
    this.createRequest ( 'logEvent', params );
}

this.createRequest = function( type, params ) {
    
    var scene = this.find( "/" )[ 0 ];
    
    var playerId = scene.playerId;
    var version = scene.version;
    
    var pathArray = window.location.pathname.split( '/' );
    var vwfSession = pathArray[ pathArray.length-2 ];
    
    var xhr = new XMLHttpRequest();
            
    if ( type === 'logEvent' ) {
        if ( !params || ( params.length !== 2 ) ) {
            self.logger.warnx( "createRequest", "The logEvent request takes 2 parameters:" +
                               " an event name and a value associated with the event." );
        }
        var event = params[ 0 ];
        var value = params[ 1 ];
        
        xhr.open( "POST", this.logEventUrl, true );
        xhr.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
        xhr.send("vwf_session=" + vwfSession + "&player_id=" + playerId + "&action=" + 
                event + "$&value="+value+"$&version="+version);
        
    }
}

this.getRequest = function( type, params ) {
    var scene = this.find( "/" )[ 0 ];
    
    var playerId = scene.playerId;
    var version = scene.version;
    
    var pathArray = window.location.pathname.split( '/' );
    var vwfSession = pathArray[ pathArray.length-2 ];
    
    var xhr = new XMLHttpRequest();
    
    if ( type == 'getPlayerState' ) {
        if ( params && ( params.length > 0 ) ) {
            self.logger.warnx( "getRequest", "The getPlayerState request takes no parameters." );
        }
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if ( xhr.readyState == 4 ) {
                var scenarioName = xhr.responseText;
                if ( scenarioName.lastIndexOf( "$" ) === scenarioName.length - 1 ) {
                    scenarioName = scenarioName.substr( 0, scenarioName.length - 1 );
                }
                if ( scene[ scenarioName ] ) {
                    scene.loginSucceeded( scenarioName );
                } else {
                    scene.loginFailed( xhr.responseText );
                }
                return xhr.responseText;
            }
        }
        
        xhr.open( "GET", this.getPlayerStateUrl, true );
        xhr.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
        xhr.send( "player_id="+playerId );
    }
    
}

//@ sourceURL=source/instrumentationManager.js