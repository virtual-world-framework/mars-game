var scene;

this.initialize = function() {
    this.future( 0 ).onSceneLoaded();
}

this.onSceneLoaded = function() {
    var searchArray = this.find( this.scenePath );
    if ( searchArray.length ) {
        scene = searchArray[ 0 ];
    } else {
        this.logger.errorx( "startScenario", "Failed to find the scene!" );
    }

    this.loadTriggers( scene );
}

//@ sourceURL=source/scenario/globalScenarioTriggers.js
