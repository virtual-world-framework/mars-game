var currentGrid;

this.initialize = function() {

    this.future( 0 ).registerGameStartedListener();
    this.future( 0 ).registerScenarioSucceededListener();
    this.future( 0 ).registerScenarioFailedListener();
    
}

this.registerGameStartedListener = function() {
    var scene = this.find( "/" )[ 0 ];
    scene.gameStarted= ( function( ) {
        this.broadcastScenarioSucceeded( );
    } ).bind( this );
}

this.registerScenarioSucceededListener = function() {
    var scene = this.find( "/" )[ 0 ];
    scene.scenarioChanged = ( function( scenarioName ) {
        this.broadcastScenarioSucceeded( scenarioName );
    } ).bind( this );
}

this.registerScenarioFailedListener = function() {
    var scene = this.find( "/" )[ 0 ];
    scene.scenarioChanged = ( function( scenarioName ) {
        this.broadcastScenarioFailed( scenarioName );
    } ).bind( this );
}

this.broadcastScenarioSucceeded = function( scenarioName ) {
    var scenario = this.find( "//" + scenarioName )[ 0 ];
}

this.broadcastScenarioFailed = function( scenarioName ) {
    var scenario = this.find( "//" + scenarioName )[ 0 ];
}

this.broadcastGameStarted = function( ) {
    var scenario = this.find( "//" + scenarioName )[ 0 ];
    currentGrid = scenario.grid;
}

this.createRequest = function( type, params ) {
    if ( type === 'event' ) {
    
    } else if ( type === 'action' ) {
    
    }
    
}

//@ sourceURL=source/rover.js