var delaySeconds = 0;
var self = this;
var cachedTargetNode;

this.initialize = function() {
    this.orbiting = false;
    this.future( 0 ).onSceneReady$();
}

this.onSceneReady$ = function() {
    setTargetEventHandler();
}

this.changePointOfView$ = function( newPointOfView ) {
    if ( newPointOfView === this.pointOfView ) {
        return;
    }
    this.pointOfView = newPointOfView;

    // Cut to the new point of view
    this.transform = getNewCameraTransform();

    // Set the navigation mode of the camera appropriately for the new point of view
    switch ( newPointOfView ) {
        case "firstPerson":
            this.navmode = "walk";
            this.translationSpeed = 0;
            break;
        case "thirdPerson":
            this.navmode = "thirdPerson";
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
    this.changedPOV( newPointOfView );
}

this.setTargetPath$ = function( newTargetPath ) {
    if ( newTargetPath === this.targetPath ) {
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
    this.transformTo( getNewCameraTransform(), 1 );
    
    // Hide the target if the camera is moving into first-person mode
    // Make it visible if it is in any other mode
    manageTargetVisibility();
}

this.followTarget$ = function() {
    this.transformTo( getNewCameraTransform(), 0 );
}

// Orbit the camera around the targetNode at speed radians/second
this.orbitTarget$ = function( speed ) {
    speed = speed || 1;
    if ( this.pointOfView !== "thirdPerson" ) {
        this.changePointOfView$( "thirdPerson" );
    }
    var rads = speed * 0.1;
    var rotationMatrix = [
        Math.cos( rads ), -Math.sin( -rads ), 0, 0,
        Math.sin( -rads ), Math.cos( rads ), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];
    var targetNode = getTargetNode();
    var tempTransform = this.transform.slice( 0 );
    tempTransform[ 12 ] -= targetNode.transform[ 12 ];
    tempTransform[ 13 ] -= targetNode.transform[ 13 ];
    tempTransform[ 14 ] -= targetNode.transform[ 14 ];
    tempTransform = multiplyMatrices( rotationMatrix, tempTransform );
    tempTransform[ 12 ] += targetNode.transform[ 12 ];
    tempTransform[ 13 ] += targetNode.transform[ 13 ];
    tempTransform[ 14 ] += targetNode.transform[ 14 ];    
    this.transform = tempTransform;

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
    var targetTransform = targetNode ? targetNode.transform : [
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
                0, 0.966, -0.199, 0,
                0, 0.199,  0.966, 0,
                0, 0,      0,     1 ];
            newCameraTransform = thirdPersonOrientationTransform;
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
            newCameraTransform = topDownOrientationTransform;
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
            targetNode.future( delaySeconds ).visible = false;
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

function multiplyMatrices( a, b ) {

    var ret = [];

    var a11 = a[0], a12 = a[4], a13 = a[8], a14 = a[12];
    var a21 = a[1], a22 = a[5], a23 = a[9], a24 = a[13];
    var a31 = a[2], a32 = a[6], a33 = a[10], a34 = a[14];
    var a41 = a[3], a42 = a[7], a43 = a[11], a44 = a[15];

    var b11 = b[0], b12 = b[4], b13 = b[8], b14 = b[12];
    var b21 = b[1], b22 = b[5], b23 = b[9], b24 = b[13];
    var b31 = b[2], b32 = b[6], b33 = b[10], b34 = b[14];
    var b41 = b[3], b42 = b[7], b43 = b[11], b44 = b[15];

    ret[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
    ret[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
    ret[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
    ret[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

    ret[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
    ret[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
    ret[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
    ret[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

    ret[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
    ret[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
    ret[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
    ret[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

    ret[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
    ret[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
    ret[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
    ret[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

    return ret;
}

//@ sourceURL=source/camera.js