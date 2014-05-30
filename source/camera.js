var self = this;
var cachedTargetNode;

this.initialize = function() {
    this.future( 0 ).onSceneReady$();
}

this.onSceneReady$ = function() {
    this.updateCamera$();
}

this.setTargetPath$ = function( newTargetPath ) {
    var previousTargetPath = this.targetPath;
    if ( newTargetPath === previousTargetPath ) {
        return;
    }
    var previousTargetNode = getTargetNode();
    if ( previousTargetNode ) {
        previousTargetNode.visible = true;
        previousTargetNode.transformChanged = previousTargetNode.events.flush( this );
    }
    this.targetPath = newTargetPath;
    cachedTargetNode = null;
    this.updateCamera$();
}

this.updateCamera$ = function() {
    var durationSeconds = 1;
    var delaySeconds = 0.1;
    var targetTransform;
    var targetNode = getTargetNode();
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

function getTargetNode() {
    if ( !cachedTargetNode ) {
        cachedTargetNode = self.targetPath ? self.find( self.targetPath )[ 0 ] : undefined;
        if ( cachedTargetNode ) {
            cachedTargetNode.transformChanged = cachedTargetNode.events.add( 
                function( transform ) {
                    switch ( self.pointOfView ) {
                        case "firstPerson":
                            var firstPersonTransform = transform.slice( 0, 16 );
                            self.firstPersonOffset[ 0 ] = self.firstPersonOffset[ 0 ] || 0;
                            self.firstPersonOffset[ 1 ] = self.firstPersonOffset[ 1 ] || 0;
                            self.firstPersonOffset[ 2 ] = self.firstPersonOffset[ 2 ] || 0;
                            firstPersonTransform[ 12 ] += self.firstPersonOffset[ 0 ];
                            firstPersonTransform[ 13 ] += self.firstPersonOffset[ 1 ];
                            firstPersonTransform[ 14 ] += self.firstPersonOffset[ 2 ];
                            self.transform = firstPersonTransform;
                            break;
                        case "thirdPerson":
                            self.thirdPersonOffset[ 0 ] = self.thirdPersonOffset[ 0 ] || 0;
                            self.thirdPersonOffset[ 1 ] = self.thirdPersonOffset[ 1 ] || 0;
                            self.thirdPersonOffset[ 2 ] = self.thirdPersonOffset[ 2 ] || 0;
                            self.translation = [ 
                                transform[ 12 ] + self.thirdPersonOffset[ 0 ],
                                transform[ 13 ] + self.thirdPersonOffset[ 1 ],
                                transform[ 14 ] + self.thirdPersonOffset[ 2 ] ];
                            break;
                        default:
                            self.warnx( "camera.transformChanged-handler",
                                "Invalid pointOfView '", self.pointOfView, "'" );
                            break;
                    }
                }, self );
        }
    }
    return cachedTargetNode;
}

//@ sourceURL=source/camera.js