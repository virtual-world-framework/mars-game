var delaySeconds = 0;
var cachedTargetNode;

this.initialize = function() {
    this.future( 0 ).onSceneReady$();
}

this.onSceneReady$ = function() {
    this.setTargetEventHandler();
    this.camera.changedPOV = this.camera.events.add( this.changePointOfView, this );
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
    var identity = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];
    var targetNode = this.getTargetNode();
    var targetTransform = targetNode ? targetNode.transform : identity;

    var newCameraTransform;
    switch ( this.camera.pointOfView ) {
        case "firstPerson":
            
            // Have the camera follow the target transform plus a position offset
            newCameraTransform = targetTransform.slice( 0 );
            newCameraTransform[ 12 ] += this.firstPersonOffset[ 0 ];
            newCameraTransform[ 13 ] += this.firstPersonOffset[ 1 ];
            newCameraTransform[ 14 ] += this.firstPersonOffset[ 2 ];
            break;

        case "thirdPerson":
            
            // Lock the camera's orientation, but have it's position follow the target 
            // (plus an offset)
            newCameraTransform = identity;
            newCameraTransform[ 12 ] += targetTransform[ 12 ];
            newCameraTransform[ 13 ] += targetTransform[ 13 ];
            newCameraTransform[ 14 ] += targetTransform[ 14 ];
            break;

        case "topDown":

            // Lock the camera's orientation, but have it's position follow the target 
            // (plus an offset)
            newCameraTransform = identity;
            newCameraTransform[ 12 ] = targetTransform[ 12 ] + this.topDownOffset[ 0 ];
            newCameraTransform[ 13 ] = targetTransform[ 13 ] + this.topDownOffset[ 1 ];
            newCameraTransform[ 14 ] = this.topDownOffset[ 2 ];
            break;

        default:
            this.logger.warnx( "changePointOfView", "Unrecognized camera point of view: '", 
                this.pointOfView, "'" );
            newCameraTransform = targetTransform;
            break;
    }

    return newCameraTransform;
}

this.changePointOfView = function() {

    // Cut to the new point of view
    this.transformTo( this.getNewTransform(), 0 );

    this.manageTargetVisibility();
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