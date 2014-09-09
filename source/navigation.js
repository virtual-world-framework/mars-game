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

var defaultNav = {
    mouse: undefined,
    move: undefined,
    rotate: undefined,
    scroll: undefined
}

// Zoom bounds in meters
var topDown_MaxAltitude = 42;
var topDown_MinAltitude = 9;
var thirdPerson_MaxZoom = 21;
var thirdPerson_MinZoom = 6;

// Angle bounds in degrees
var thirdPerson_MaxAngle = 85;
var thirdPerson_MinAngle = 5;

function setUpNavigation() {

    var threejs = findThreejsView();

    defaultNav.mouse = threejs.handleMouseNavigation;
    defaultNav.scroll = threejs.handleScroll;
    defaultNav.move = threejs.moveNavObject;  
    defaultNav.rotate = threejs.rotateNavObjectByKey;
    
    threejs.handleMouseNavigation = handleMouseNavigation;
    threejs.handleScroll = handleScroll;
    threejs.moveNavObject = moveNavObject;
    threejs.rotateNavObjectByKey = rotateNavObject;
    threejs.appRequestsPointerLock = requestPointerLock;
}

function handleMouseNavigation( deltaX, deltaY, navObject, navMode, rotationSpeed, translationSpeed, mouseDown, mouseEventData ) {

    switch( navMode ) {

        case "walk":
        case "fly":
        case "none":
            defaultNav.mouse( deltaX, deltaY, navObject, navMode, rotationSpeed, translationSpeed, mouseDown );
            break;

        case "topDown":
            if ( mouseDown.right ) {
                var navThreeObject = navObject.threeObject;
                var navX = navThreeObject.matrixWorld.elements[ 12 ];
                var navY = navThreeObject.matrixWorld.elements[ 13 ];
                var heightModifier = navThreeObject.matrixWorld.elements[ 14 ] / 10;
                navX += -deltaX * translationSpeed * heightModifier;
                navY += deltaY * translationSpeed * heightModifier;

                // Keep the view within grid boundaries
                navX = navX < gridBounds.bottomLeft[ 0 ] ? gridBounds.bottomLeft[ 0 ] : navX;
                navX = navX > gridBounds.topRight[ 0 ] ? gridBounds.topRight[ 0 ] : navX;       
                navY = navY < gridBounds.bottomLeft[ 1 ] ? gridBounds.bottomLeft[ 1 ] : navY;
                navY = navY > gridBounds.topRight[ 1 ] ? gridBounds.topRight[ 1 ] : navY;

                navThreeObject.matrixWorld.elements[ 12 ] = navX;
                navThreeObject.matrixWorld.elements[ 13 ] = navY;
            }
            break;

        case "thirdPerson":
            if ( mouseDown.right ) {
                var navThreeObject = navObject.threeObject;
                var degreesToRadians = Math.PI / 180;
                var rotationSpeedRadians = degreesToRadians * rotationSpeed;

                navThreeObject.matrixWorld.elements[ 12 ] -= orbitTarget[ 0 ];
                navThreeObject.matrixWorld.elements[ 13 ] -= orbitTarget[ 1 ];
                navThreeObject.matrixWorld.elements[ 14 ] -= orbitTarget[ 2 ];

                // Find the pitch and constrain it to 0 - ~90 degrees
                var pitchAxis = new THREE.Vector3( navThreeObject.matrixWorld.elements[ 0 ],
                                                   navThreeObject.matrixWorld.elements[ 1 ],
                                                   0 );
                var pitchRadians = deltaY * rotationSpeedRadians;
                var currentPitch = Math.acos( navThreeObject.matrixWorld.elements[ 10 ] );
                var resultingPitch = currentPitch + pitchRadians;
                var upperBound = thirdPerson_MaxAngle * Math.PI / 180;
                var lowerBound = thirdPerson_MinAngle * Math.PI / 180;

                if ( resultingPitch > upperBound ) {
                    pitchRadians = upperBound - currentPitch;
                } else if ( resultingPitch < lowerBound ) {
                    pitchRadians = lowerBound - currentPitch;
                } else if ( isNaN( currentPitch ) && pitchRadians < 0 ) {
                    pitchRadians = 0;
                }

                var pitchQuat = new THREE.Quaternion();
                pitchQuat.setFromAxisAngle( pitchAxis, pitchRadians );
                var pitchDeltaMatrix = new THREE.Matrix4();
                pitchDeltaMatrix.makeRotationFromQuaternion( pitchQuat );
                navThreeObject.matrixWorld.multiplyMatrices( pitchDeltaMatrix, navThreeObject.matrixWorld );

                // Then find the yaw and apply it
                var yawRadians = deltaX * rotationSpeedRadians;
                var yawQuat = new THREE.Quaternion();
                yawQuat.setFromAxisAngle( new THREE.Vector3( 0, 0, 1 ), yawRadians );
                var yawDeltaMatrix = new THREE.Matrix4();
                yawDeltaMatrix.makeRotationFromQuaternion( yawQuat );
                navThreeObject.matrixWorld.multiplyMatrices( yawDeltaMatrix, navThreeObject.matrixWorld );

                navThreeObject.matrixWorld.elements[ 12 ] += orbitTarget[ 0 ];
                navThreeObject.matrixWorld.elements[ 13 ] += orbitTarget[ 1 ];
                navThreeObject.matrixWorld.elements[ 14 ] += orbitTarget[ 2 ];
            }
            break;
    }
}

function handleScroll( wheelDelta, navObject, navMode, rotationSpeed, translationSpeed, distanceToTarget ) {

    switch ( navMode ) {

        case "walk":
        case "fly":
        case "none":
            defaultNav.scroll( wheelDelta, navObject, navMode, rotationSpeed, translationSpeed, distanceToTarget );
            break;

        case "topDown":
            var numClicks = wheelDelta / 3;
            var navZ = navObject.threeObject.matrixWorld.elements[ 14 ];
            navZ -= numClicks;
            navZ = navZ > topDown_MaxAltitude ? topDown_MaxAltitude : navZ;
            navZ = navZ < topDown_MinAltitude ? topDown_MinAltitude : navZ;
            navObject.threeObject.matrixWorld.elements[ 14 ] = navZ;
            break;

        case "thirdPerson":
            var navWorldMat = navObject.threeObject.matrixWorld;
            var numClicks = -wheelDelta / 3;
            var origin = new THREE.Vector3( orbitTarget[ 0 ],
                                            orbitTarget[ 1 ],
                                            orbitTarget[ 2 ] );
            var cameraLoc = new THREE.Vector3( navWorldMat.elements[ 12 ],
                                               navWorldMat.elements[ 13 ],
                                               navWorldMat.elements[ 14 ] );
            var newCameraLoc = new THREE.Vector3( ( navWorldMat.elements[ 12 ] - orbitTarget[ 0 ] ) * 0.1,
                           ( navWorldMat.elements[ 13 ] - orbitTarget[ 1 ] ) * 0.1,
                           ( navWorldMat.elements[ 14 ] - orbitTarget[ 2 ] ) * 0.1 );
            newCameraLoc.multiplyScalar( numClicks ).add( cameraLoc );

            var dist = origin.distanceTo( newCameraLoc );
            if ( wheelDelta > 0 && cameraLoc.distanceTo( newCameraLoc ) > cameraLoc.distanceTo( origin ) ) {
                return;
            }

            if ( dist < thirdPerson_MinZoom ) {
                var heading = new THREE.Vector3();
                heading.subVectors( cameraLoc, origin ).normalize();
                newCameraLoc.addVectors( origin, heading.multiplyScalar( thirdPerson_MinZoom ) );
            } else if ( dist > thirdPerson_MaxZoom ) {
                var heading = new THREE.Vector3();
                heading.subVectors( cameraLoc, origin ).normalize();
                newCameraLoc.addVectors( origin, heading.multiplyScalar( thirdPerson_MaxZoom ) );
            }

            navWorldMat.elements[ 12 ] = newCameraLoc.x;
            navWorldMat.elements[ 13 ] = newCameraLoc.y;
            navWorldMat.elements[ 14 ] = newCameraLoc.z;

            break;
    }
}

function moveNavObject( dx, dy, navObject, navMode, rotationSpeed, translationSpeed, msSinceLastFrame ) {

    switch ( navMode ) {

        case "walk":
        case "fly":
        case "none":
            defaultNav.move( dx, dy, navObject, navMode, rotationSpeed, translationSpeed, msSinceLastFrame );
            break;

        case "topDown":
            var dist = translationSpeed * Math.min( msSinceLastFrame * 0.001, 0.5 );
            var navX = navObject.threeObject.matrixWorld.elements[ 12 ];
            var navY = navObject.threeObject.matrixWorld.elements[ 13 ];
            navX += dx * dist;
            navY += dy * dist;

            // Keep the view within grid boundaries
            navX = navX < gridBounds.bottomLeft[ 0 ] ? gridBounds.bottomLeft[ 0 ] : navX;
            navX = navX > gridBounds.topRight[ 0 ] ? gridBounds.topRight[ 0 ] : navX;       
            navY = navY < gridBounds.bottomLeft[ 1 ] ? gridBounds.bottomLeft[ 1 ] : navY;
            navY = navY > gridBounds.topRight[ 1 ] ? gridBounds.topRight[ 1 ] : navY;

            navObject.threeObject.matrixWorld.elements[ 12 ] = navX;
            navObject.threeObject.matrixWorld.elements[ 13 ] = navY;
            break;

        case "thirdPerson":

            var navThreeObject = navObject.threeObject;
            var degreesToRadians = Math.PI / 180;
            var rotationSpeedRadians = degreesToRadians * rotationSpeed * 
                                        Math.min( msSinceLastFrame * 0.001, 0.5 );

            navThreeObject.matrixWorld.elements[ 12 ] -= orbitTarget[ 0 ];
            navThreeObject.matrixWorld.elements[ 13 ] -= orbitTarget[ 1 ];
            navThreeObject.matrixWorld.elements[ 14 ] -= orbitTarget[ 2 ];

            // Find the pitch and constrain it to 0 - ~90 degrees
            var pitchAxis = new THREE.Vector3( navThreeObject.matrixWorld.elements[ 0 ],
                                               navThreeObject.matrixWorld.elements[ 1 ],
                                               0 );
            var pitchRadians = -dy * rotationSpeedRadians;

            var currentPitch = Math.acos( navThreeObject.matrixWorld.elements[ 10 ] );
            var resultingPitch = currentPitch + pitchRadians;
            var upperBound = thirdPerson_MaxAngle * Math.PI / 180;
            var lowerBound = thirdPerson_MinAngle * Math.PI / 180;

            if ( resultingPitch > upperBound ) {
                pitchRadians = upperBound - currentPitch;
            } else if ( resultingPitch < lowerBound ) {
                pitchRadians = lowerBound - currentPitch;
            } else if ( isNaN( currentPitch ) && pitchRadians < 0 ) {
                pitchRadians = 0;
            }

            var pitchQuat = new THREE.Quaternion();
            pitchQuat.setFromAxisAngle( pitchAxis, pitchRadians );
            var pitchDeltaMatrix = new THREE.Matrix4();
            pitchDeltaMatrix.makeRotationFromQuaternion( pitchQuat );
            navThreeObject.matrixWorld.multiplyMatrices( pitchDeltaMatrix, navThreeObject.matrixWorld );

            // Then find the yaw and apply it
            var yawRadians = dx * rotationSpeedRadians;
            var yawQuat = new THREE.Quaternion();
            yawQuat.setFromAxisAngle( new THREE.Vector3( 0, 0, 1 ), yawRadians );
            var yawDeltaMatrix = new THREE.Matrix4();
            yawDeltaMatrix.makeRotationFromQuaternion( yawQuat );
            navThreeObject.matrixWorld.multiplyMatrices( yawDeltaMatrix, navThreeObject.matrixWorld );

            navThreeObject.matrixWorld.elements[ 12 ] += orbitTarget[ 0 ];
            navThreeObject.matrixWorld.elements[ 13 ] += orbitTarget[ 1 ];
            navThreeObject.matrixWorld.elements[ 14 ] += orbitTarget[ 2 ];
            break;
    }

}

function rotateNavObject( direction, navObject, navMode, rotationSpeed, translationSpeed, msSinceLastFrame ){

    switch ( navMode ) {

        case "walk":
        case "fly":
        case "none":
            defaultNav.rotate( direction, navObject, navMode, rotationSpeed, translationSpeed, msSinceLastFrame );
            break;
    }
}

function requestPointerLock( navMode, mouseDown ) {

    if ( mouseDown.right && ( navMode === "walk" ) ) {
        return true;
    }
    if ( mouseDown.right && ( navMode === "thirdPerson" ) ) {
        return true;
    }
    return false;
}

//@ sourceURL=source/navigation.js