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
        this.lastTargetPosition = [
            transform[ 12 ],
            transform[ 13 ],
            transform[ 14 ]
        ];
        this.transform = newTransform;
    }
}

this.attachToTarget = function() {
    for ( var i = 0; i < 3; i++ ) {
        this.lastTargetPosition[ i ] = this.target.transform[ i + 12 ];
    }
    this.target.transformChanged = this.target.events.add( function( transform ) {
        this.followTarget( transform );
    }, this );
}

this.detachFromTarget = function() {
    this.target.visible = true;
    this.target.transformChanged = this.target.events.remove( function( transform ) {
        this.followTarget( transform );
    }, this );
}

this.setCameraPose = function( pose ) {
    var poseTransform = this.convertPoseToTransform( pose );
    this.camera.transform = poseTransform;
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

//@ sourceURL=source/gameCamera.js