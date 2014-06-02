this.initialize = function() {
    self = this;

    this.children.create( "startStateExecutor", 
                          "source/declarativeFunctionExecutor.vwf" );

    self.future( 0 ).onReady();
}

this.findAndSetUpGridManager = function() {
    var managerObject = this.find( "//element(*,'source/gridManager.vwf')" )[ 0 ];
    if ( managerObject ) {
        managerObject.currentGrid = self.grid;
        managerObject.gridSquareLength = self.grid.gridSquareLength;
    }
    else {
        self.logger.errorx( "findAndSetUpGridManager", "Failed to find the grid manager." );
    }
}

this.onReady = function() {
	this.onSceneReady();
	this.findAndSetUpGridManager();
}

//@ sourceURL=source/gridScenario.js