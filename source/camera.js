var durationSeconds = 0;
var delaySeconds = 0.1;
var self = this;
var cachedTargetNode;

this.initialize = function() {
    this.future( 0 ).onSceneReady$();
}

this.onSceneReady$ = function() {
    setTargetEventHandler();
    durationSeconds = 1;
}

this.changePointOfView$ = function( newPointOfView ) {
    var previousPointOfView = this.pointOfView;
    if ( newPointOfView === previousPointOfView ) {
        return;
    }
    this.pointOfView = newPointOfView;

    // Smoothly move the camera to the new point of view
    this.transformTo( getNewCameraTransform(), durationSeconds );

    // Set the navigation mode of the camera appropriately for the new point of view
    switch ( newPointOfView ) {
        case "firstPerson":
            this.future( durationSeconds ).navmode = "walk";
            this.translationSpeed = 0;
            break;
        case "thirdPerson":
            this.navmode = "walk";
            this.translationSpeed = 0;
            break;
        case "topDown":
            this.navmode = "topDown";
            this.translationSpeed = 10;
            break;
        default:
            self.logger.warnx( "changePointOfView$", "Unrecognized camera point of view: '", 
                newPointOfView, "'" );
            break;
    }

    // Hide the target if the camera is moving into first-person mode
    // Make it visible if it is in any other mode
    manageTargetVisibility();
}

this.setTargetPath$ = function( newTargetPath ) {
    var previousTargetPath = this.targetPath;
    if ( newTargetPath === previousTargetPath ) {
        return;
    }

    // Put the previous target node back the way we found it
    var previousTargetNode = getTargetNode();
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
    setTargetEventHandler();

    // Smoothly move the camera to the new target
    this.transformTo( getNewCameraTransform(), durationSeconds );
    
    // Hide the target if the camera is moving into first-person mode
    // Make it visible if it is in any other mode
    manageTargetVisibility();
}

this.followTarget$ = function() {
    //this.transform = getNewCameraTransform();
    this.transformTo( getNewCameraTransform(), durationSeconds );
}

function getTargetNode() {
    if ( !cachedTargetNode ) {
        cachedTargetNode = self.targetPath ? self.find( self.targetPath )[ 0 ] : undefined;
    }
    return cachedTargetNode;
}

function setTargetEventHandler() {
    var targetNode = getTargetNode();
    if ( targetNode && self.needToSetupEventHandler$ ) {
        targetNode.transformChanged = targetNode.events.add( self.followTarget$, self );
        self.needToSetupEventHandler$ = false;
    }
}

function getNewCameraTransform() {
    var targetNode = getTargetNode();
    var targetTransform = targetNode ? targetNode.transform.slice( 0, 16 ) : [
        1, 0, 0, 0,
        0, 1, 0, 1,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];
    var newCameraTransform;
    switch ( self.pointOfView ) {
        case "firstPerson":
            
            // Have the camera follow the target transform plus a position offset
            newCameraTransform = targetTransform;
            newCameraTransform[ 12 ] += self.firstPersonOffset[ 0 ];
            newCameraTransform[ 13 ] += self.firstPersonOffset[ 1 ];
            newCameraTransform[ 14 ] += self.firstPersonOffset[ 2 ];
            break;

        case "thirdPerson":
            
            // Lock the camera's orientation, but have it's position follow the target 
            // (plus an offset)
            var thirdPersonOrientationTransform = [ 
                1, 0,      0,     0, 
                0, 0.966, -0.259, 0,
                0, 0.259,  0.966, 0,
                0, 0,      0,     1 ];
            newCameraTransform = thirdPersonOrientationTransform.slice( 0, 16 );
            newCameraTransform[ 12 ] = targetTransform[ 12 ] + self.thirdPersonOffset[ 0 ];
            newCameraTransform[ 13 ] = targetTransform[ 13 ] + self.thirdPersonOffset[ 1 ];
            newCameraTransform[ 14 ] = targetTransform[ 14 ] + self.thirdPersonOffset[ 2 ];
            break;

        case "topDown":

            // Lock the camera's orientation, but have it's position follow the target 
            // (plus an offset)
            var topDownOrientationTransform = [ 
                1, 0, 0, 0, 
                0, 0, -1, 0,
                0, 1,  0, 0,
                0, 0,  0, 1 ];
            newCameraTransform = topDownOrientationTransform.slice( 0, 16 );
            newCameraTransform[ 12 ] = targetTransform[ 12 ] + self.topDownOffset[ 0 ];
            newCameraTransform[ 13 ] = targetTransform[ 13 ] + self.topDownOffset[ 1 ];
            newCameraTransform[ 14 ] = self.topDownOffset[ 2 ];
            break;

        default:
            self.logger.warnx( "getNewCameraTransform", "Unrecognized camera point of view: '", 
                self.pointOfView, "'" );
            newCameraTransform = targetTransform;
            break;
    }
    return newCameraTransform;
}

function manageTargetVisibility() {
    var targetNode = getTargetNode();
    if ( !targetNode ) {
        return;
    }

    // Hide the target at the right time if the camera is moving into first-person mode
    // Immediately make it visible if it is in any other mode
    switch ( self.pointOfView ) {
        case "firstPerson":
            targetNode.future( durationSeconds - delaySeconds ).visible = false;
            break;
        case "thirdPerson":
            targetNode.future( delaySeconds ).visible = true;
            break;
        case "topDown":
            targetNode.future( delaySeconds ).visible = true;
            break;
        default:
            self.logger.warnx( "manageTargetVisibility", "Unrecognized camera point of view: '", 
                self.pointOfView, "'" );
            break;
    }
}

//@ sourceURL=source/camera.js