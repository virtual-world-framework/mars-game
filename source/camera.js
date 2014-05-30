this.initialize = function() {
    this.future( 0 ).onSceneReady();
}

this.onSceneReady = function() {
    this.updateCamera();
}

this.updateCamera = function() {
    var durationSeconds = 1;
    var delaySeconds = 0.1;
    var targetTransform;
    var targetNode;
    if ( this.targetPath ) {
        targetNode = this.find( this.targetPath )[ 0 ];
    }
    if ( targetNode ) {
        targetTransform = targetNode.transform.slice( 0, 16 );
    } else {
        targetTransform = [
            1, 0, 0, 0,
            0, 1, 0, 1,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    }
    switch ( this.pointOfView ) {
        case "firstPerson":
            var firstPersonOffset = [ 0, 0, 1 ];
            var firstPersonTransform = targetTransform;
            firstPersonTransform[ 12 ] += firstPersonOffset[ 0 ];
            firstPersonTransform[ 13 ] += firstPersonOffset[ 1 ];
            firstPersonTransform[ 14 ] += firstPersonOffset[ 2 ];
            this.transformTo( firstPersonTransform, durationSeconds );
            this.future( durationSeconds ).navmode = "walk";
            if ( targetNode ) {
                targetNode.future( durationSeconds - delaySeconds ).visible = false;
            }
            break;
        case "thirdPerson":
            var thirdPersonOrientationTransform = [ 
                0    , -1,  0    , 0, 
                0.963,  0, -0.27 , 0,
                0.27 ,  0,  0.963, 0,
                0,      0,  0,     1 ];
            var thirdPersonOffset = [ -15.531,  0,  5.553 ];
            var thirdPersonTransform = thirdPersonOrientationTransform.slice( 0, 16 );
            thirdPersonTransform[ 12 ] = targetTransform[ 12 ] + thirdPersonOffset[ 0 ];
            thirdPersonTransform[ 13 ] = targetTransform[ 13 ] + thirdPersonOffset[ 1 ];
            thirdPersonTransform[ 14 ] = targetTransform[ 14 ] + thirdPersonOffset[ 2 ];
            this.transformTo( thirdPersonTransform, durationSeconds );
            this.navmode = "none";
            if ( targetNode ) {
                targetNode.future( delaySeconds ).visible = true;
            }
            break;
        default:
            break;
    } 
}

//@ sourceURL=source/camera.js