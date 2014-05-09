this.initialize = function() {
	// if anyone want to spend another 8 hours figuring out why ever attempt to hide
	// this button on start up then be my guess, I give up
	console.info( "hideButton.initialize ====================================" )
	console.info( "this.children[ 'blocklyButton' ].visible = " + this.children[ 'blocklyButton' ].visible );
	this.children[ 'blocklyButton' ].visible = false;
	console.info( "this.children[ 'blocklyButton' ].visible = " + this.children[ 'blocklyButton' ].visible );
}