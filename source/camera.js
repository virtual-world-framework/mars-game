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

this.initialize = function() {
    this.orbiting = false;
}

this.changePointOfView$ = function( newPointOfView ) {
    if ( newPointOfView === this.pointOfView ) {
        return;
    }
    this.pointOfView = newPointOfView;

    // Cut to the new point of view
    this.transform = this.getCameraStartTransform();

    // Set the navigation mode of the camera appropriately for the new point of view
    this.setNavigationFromPOV( newPointOfView );

    this.changedPOV( newPointOfView );
}

this.setNavigationFromPOV = function( pov ) {
    pov = pov || this.pointOfView;
    switch ( pov ) {
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
            this.logger.warnx( "changePointOfView$", 
                "Unrecognized camera point of view: '", pov, "'" );
            break;
    }
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
    this.transform = multiplyMatrices( rotationMatrix, this.transform );
}

this.setCameraPose = function( pose ) {
    this.transform = this.convertPoseToTransform( pose );
}

this.resetCameraPose = function() {
    switch ( this.pointOfView ) {
        case "firstPerson":
            this.setCameraPose( this.firstPersonStartPose );
            break;
        case "thirdPerson":
            this.setCameraPose( this.thirdPersonStartPose );
            break;
        case "topDown":
            this.setCameraPose( this.topDownStartPose );
            break;
        default:
            this.logger.warnx( "resetCameraPose",
                "Unrecognized camera point of view: '", this.pointOfView, "'" );
            this.setCameraPose( [ 0, 0, 0 ] );
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

// --- Private functions ---

this.getCameraStartTransform = function() {
    var newCameraTransform;
    switch ( this.pointOfView ) {
        case "firstPerson":
            newCameraTransform = this.convertPoseToTransform( this.firstPersonStartPose );
            break;
        case "thirdPerson":
            newCameraTransform = this.convertPoseToTransform( this.thirdPersonStartPose );
            break;
        case "topDown":
            newCameraTransform = this.convertPoseToTransform( this.topDownStartPose );
            break;
        default:
            this.logger.warnx( "getCameraStartTransform",
                "Unrecognized camera point of view: '", this.pointOfView, "'" );
            newCameraTransform = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ];
            break;
    }
    return newCameraTransform;
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

//@ sourceURL=source/camera.js