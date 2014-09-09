var self;

this.initialize = function() {
    
    self = this;
    
    if ( this.enabled === true ) {
        this.future( 0 ).registerGameStartedListener();
        this.future( 0 ).registerScenarioStartedListener();
        this.future( 0 ).registerScenarioSucceededListener();
        this.future( 0 ).registerScenarioFailedListener();
        this.future( 0 ).registerScenarioResetListener();
        this.future( 0 ).registerVOListener();
        this.future( 0 ).registerCameraListener();
        this.future( 0 ).registerBlocklyListener();
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

this.registerVOListener = function() {
    var scene = this.find( "/" )[ 0 ];
    scene.playedVO = ( function( soundName ) {
        this.broadcastEvent( 'playedVO', soundName );
    } ).bind( this );
}

this.registerCameraListener = function() {
    var scene = this.find( "/" )[ 0 ];
    scene.toggledCamera = ( function( pov ) {
        this.broadcastEvent( 'toggledCamera', pov );
    } ).bind( this );
}

this.registerBlocklyListener = function() {
    var scene = this.find( "/" )[ 0 ];
    scene.blocklyStarted = ( function() {
        this.broadcastBlockly( scene.activeBlocklyXML, scene.activeScenarioPath );
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
    if ( type === 'logBlockly' ) {
        if ( !params || ( params.length !== 2 ) ) {
            self.logger.warnx( "createRequest", "The logBlockly request takes 2 parameters:" +
                               " the Blockly XML and the scenario name." );
        }
        var xml = params[ 0 ];
        var scenario = params[ 1 ];
        
        xhr.open( "POST", this.logBlocklyUrl, true );
        xhr.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
        xhr.send("vwf_session=" + vwfSession + "&player_id=" + playerId + "&xml=" + 
                xml + "$&scenario="+scenario+"$&version="+version);
        
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
            if ( xhr.readyState === 4 && xhr.state === 200) {
                return xhr.responseText;
            }
        }
        
        xhr.open( "POST", this.getPlayerStateUrl, true );
        xhr.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
        xhr.send( "player_id="+playerId );
    }
    
}

//@ sourceURL=source/instrumentationManager.js