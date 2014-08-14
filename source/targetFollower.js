var delaySeconds = 0;
var cachedTargetNode;

this.initialize = function() {
    this.future( 0 ).onSceneReady$();
}

this.onSceneReady$ = function() {
	this.setTargetEventHandler();
	this.camera.changedPOV = this.camera.events.add( this.manageTargetVisibility, this );
}

this.setTargetPath$ = function( newTargetPath ) {
    if ( newTargetPath === this.targetPath ) {
        return;
    }

    // Put the previous target node back the way we found it
    var previousTargetNode = this.getTargetNode();
    if ( previousTargetNode ) {
        previousTargetNode.future( delaySeconds ).visible = true;
        previousTargetNode.transformChanged = previousTargetNode.events.remove( this.followTarget$ );
    }

    this.targetPath = newTargetPath;

    // Nullify the cachedTargetNode so getTargetNode will find it fresh next time it is called
    cachedTargetNode = null;

    // Attempt to set an event handler for when the target moves so the camera can follow
    // If we cannot find the target because the scene has not been fully created, the 
    // needToSetupEventHandler$ property remains true so that if the event handler will be set in
    // onSceneReady$
    this.needToSetupEventHandler$ = true;
    this.setTargetEventHandler();

    // Smoothly move the camera to the new target
    this.transformTo( this.getNewTransform(), 1 );
    
    // Hide the target if the camera is moving into first-person mode
    // Make it visible if it is in any other mode
    this.manageTargetVisibility();
}

this.followTarget$ = function() {
    this.transform = this.getNewTransform();
}

// Private functions

this.getTargetNode = function() {
    if ( !cachedTargetNode ) {
        cachedTargetNode = this.targetPath ? this.find( this.targetPath )[ 0 ] : undefined;
    }
    return cachedTargetNode;
}

this.setTargetEventHandler = function() {
    var targetNode = this.getTargetNode();
    if ( targetNode && this.needToSetupEventHandler$ ) {
        targetNode.transformChanged = targetNode.events.add( this.followTarget$, this );
        this.needToSetupEventHandler$ = false;
    }
}

this.getNewTransform = function() {
	var targetNode = this.getTargetNode();
	return targetNode && targetNode.transform;
}

this.manageTargetVisibility = function() {
    var targetNode = this.getTargetNode();
    if ( !targetNode ) {
        return;
    }

    // Hide the target at the right time if the camera is moving into first-person mode
    // Immediately make it visible if it is in any other mode
    switch ( this.camera.pointOfView ) {
        case "firstPerson":
            targetNode.future( delaySeconds ).visible = false;
            break;
        case "thirdPerson":
            targetNode.future( delaySeconds ).visible = true;
            break;
        case "topDown":
            targetNode.future( delaySeconds ).visible = true;
            break;
        default:
            this.logger.warnx( "manageTargetVisibility", "Unrecognized camera point of view: '", 
                this.pointOfView, "'" );
            break;
    }
}

//@ sourceURL=source/targetFollower.js