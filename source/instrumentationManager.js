this.initialize = function() {
	
	if ( this.enabled === true ) {
		this.future( 0 ).registerGameStartedListener();
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
	this.createRequest ( 'event', params );
}

this.createRequest = function( type, params ) {
	
	var scene = this.find( "/" )[ 0 ];
	
	var event = params[ 0 ];
	var value = params[ 1 ];
	
	var playerId = scene.playerId;
	var version = scene.version;
	
	//HACK HACK HACK: Should use vwf utility.resolveURI("/")
	var pathArray = window.location.pathname.split( '/' );
	var vwfSession = pathArray[pathArray.length-2];
	
    if ( type === 'event' ) {
        var xhr = new XMLHttpRequest();
		xhr.open("POST", this.url, true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.send("vwf_session="+vwfSession+"&player_id="+playerId+"&action="+event+"$&value="+value+"$&version="+version);
	}
    
}

//@ sourceURL=source/instrumentationManager.js