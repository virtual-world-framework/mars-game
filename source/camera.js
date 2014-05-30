var durationSeconds = 1;
var delaySeconds = 0.1;
var self = this;
var cachedTargetNode;

this.initialize = function() {
    this.future( 0 ).onSceneReady$();
}

this.onSceneReady$ = function() {
    setTargetEventHandler();
}

this.changePointOfView$ = function( newPointOfView ) {
    var previousPointOfView = this.pointOfView;
    if ( newPointOfView === previousPointOfView ) {
        return;
    }
    this.pointOfView = newPointOfView;
    this.transformTo( getNewCameraTransform(), durationSeconds );
    switch ( newPointOfView ) {
        case "firstPerson":
            this.future( durationSeconds ).navmode = "walk";
            break;
        case "thirdPerson":
            this.navmode = "none";
            break;
        default:
            self.logger.warnx( "changePointOfView$", "Unrecognized camera point of view: '", 
                newPointOfView, "'" );
            break;
    }
    manageTargetVisibility();
}

this.setTargetPath$ = function( newTargetPath ) {
    var previousTargetPath = this.targetPath;
    if ( newTargetPath === previousTargetPath ) {
        return;
    }
    var previousTargetNode = getTargetNode();
    if ( previousTargetNode ) {
        previousTargetNode.future( delaySeconds ).visible = true;
        previousTargetNode.transformChanged = previousTargetNode.events.remove( this.followTarget$ );
    }
    this.targetPath = newTargetPath;
    cachedTargetNode = null;
    this.needToSetupEventHandler$ = true;
    setTargetEventHandler();
    this.transformTo( getNewCameraTransform(), durationSeconds );
    manageTargetVisibility();
}

this.followTarget$ = function() {
    this.transform = getNewCameraTransform();
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
            newCameraTransform = targetTransform;
            newCameraTransform[ 12 ] += self.firstPersonOffset[ 0 ];
            newCameraTransform[ 13 ] += self.firstPersonOffset[ 1 ];
            newCameraTransform[ 14 ] += self.firstPersonOffset[ 2 ];
            break;
        case "thirdPerson":
            var thirdPersonOrientationTransform = [ 
                0    , -1,  0    , 0, 
                0.963,  0, -0.27 , 0,
                0.27 ,  0,  0.963, 0,
                0,      0,  0,     1 ];
            newCameraTransform = thirdPersonOrientationTransform.slice( 0, 16 );
            newCameraTransform[ 12 ] = targetTransform[ 12 ] + self.thirdPersonOffset[ 0 ];
            newCameraTransform[ 13 ] = targetTransform[ 13 ] + self.thirdPersonOffset[ 1 ];
            newCameraTransform[ 14 ] = targetTransform[ 14 ] + self.thirdPersonOffset[ 2 ];
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
    switch ( self.pointOfView ) {
        case "firstPerson":
            targetNode.future( durationSeconds - delaySeconds ).visible = false;
            break;
        case "thirdPerson":
            targetNode.future( delaySeconds ).visible = true;
            break;
        default:
            self.logger.warnx( "manageTargetVisibility", "Unrecognized camera point of view: '", 
                self.pointOfView, "'" );
            break;
    }
}

//@ sourceURL=source/camera.js