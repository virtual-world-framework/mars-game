// Copyright 2014 Lockheed Martin Corporation
//
// Licensed under the Apache License, Version 2.0 (the "License"); you may 
// not use this file except in compliance with the License. You may obtain 
// a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software 
// distributed under the License is distributed on an "AS IS" BASIS, 
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and 
// limitations under the License.

this.setCameraTarget = function( node, mountName ) {
    if ( !node || !node.getMount ) {
        this.logger.errorx( "setCameraTarget", "This function requires a cameraTarget node." );
    } else {
        if ( this.target ) {
            this.detachFromTarget();
        }
        this.target = node;
        this.setCameraMount( mountName );
        this.attachToTarget();
    }
}

this.setCameraMount = function( mountName ) {
    var mount;
    mount = this.target.getMount( mountName );
    if ( !mount ) {
        this.logger.errorx( "setCameraMount", "No camera mount could be found!" );
    } else {
        mount.mountCamera( this );
    }
}

this.followTarget = function( transform ) {
    var newTransform = this.transform.slice();
    if ( this.followingTarget ) {
        if ( this.followRotation ) {
            for ( var i = 0; i < 12; i++ ) {
                newTransform[ i ] = transform[ i ];
            }
        }
        newTransform[ 12 ] += transform[ 12 ] - this.lastTargetPosition[ 0 ];
        newTransform[ 13 ] += transform[ 13 ] - this.lastTargetPosition[ 1 ];
        newTransform[ 14 ] += transform[ 14 ] - this.lastTargetPosition[ 2 ];
        this.transformTo( newTransform );
    }
    this.lastTargetPosition = [
        transform[ 12 ],
        transform[ 13 ],
        transform[ 14 ]
    ];
    var cameraPose = this.getPoseFromTransform( this.camera.transform );
    this.setCameraPose( cameraPose );
}

this.attachToTarget = function() {
    for ( var i = 0; i < 3; i++ ) {
        this.lastTargetPosition[ i ] = this.target.transform[ i + 12 ];
    }
    var self = this;
    this.target.transformChanged = this.events.add( this.followTarget, this,
        function( id ) {
            self.listenerID$ = id;
        } );
}

this.detachFromTarget = function() {
    this.target.visible = true;
    this.target.transformChanged = this.events.remove( this.listenerID$ );
}

this.setCameraPose = function( pose ) {
    var poseTransform = this.convertPoseToTransform( pose );
    this.getNearestCollisionDistance( pose[ 1 ], pose[ 2 ], 3, 1000);
    this.camera.transformTo( poseTransform );
}

this.convertPoseToTransform = function( pose ) {
    // A pose is of the form [ radius, yawAngle, pitchAngle ]
    var degreesToRadians = Math.PI / 180;
    var radius = pose[ 0 ];
    var yawRadians = pose[ 1 ] * degreesToRadians;
    var pitchRadians = pose[ 2 ] * degreesToRadians;
    var cosYaw = Math.cos( yawRadians );
    var sinYaw = Math.sin( yawRadians );
    var cosPitch = Math.cos( pitchRadians );
    var sinPitch = Math.sin( pitchRadians );
    return [
         cosYaw,                      sinYaw,                      0,                 0,
        -cosPitch * sinYaw,           cosPitch * cosYaw,           sinPitch,          0,
         sinPitch * sinYaw,          -sinPitch * cosYaw,           cosPitch,          0,
         radius * cosPitch * sinYaw, -radius * cosPitch * cosYaw, -radius * sinPitch, 1
    ];
}

this.mounted = function( mount ) {
    this.mountName = mount.name;
}

this.getPoseFromTransform = function( transform ) {
    var pitch = Math.acos( transform[ 10 ] );
    var yawSign = Math.asin( transform[ 1 ] ) < 0 ? -1 : 1;
    var yaw = yawSign * Math.acos( transform[ 0 ] );
    var radius = transform[ 12 ] / transform[ 10 ] / transform[ 1 ];
    return [ radius, yaw, pitch ];
}

this.getNearestCollisionDistance = function( yaw, pitch, near, far ) {
    var sy = Math.sin( yaw );
    var cy = Math.cos( yaw );
    var sp = Math.sin( pitch );
    var cp = Math.cos( pitch );
    var direction = [
        sp * sy,
        -sp * cy,
        cp
    ];
    var objectsToCheck = [
        this.scene.environment.id,
        this.scene.player.id,
        this.scene.pickups.id
    ];
    var origin = [
        this.target.worldTransform[ 12 ],
        this.target.worldTransform[ 13 ],
        this.target.worldTransform[ 14 ]
    ];
    var results = this.scene.raycast( origin, direction, near, far, true, objectsToCheck );
    console.log( results );

//@ sourceURL=source/gameCamera.js