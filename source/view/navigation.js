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
                var obj = navObject.threeObject;
                var matrix = obj.matrix.elements;
                var matrixWorld = obj.matrixWorld.elements;
                var rotSpd = rotationSpeed * Math.PI / 180;
                var pitchDelta = deltaY * rotSpd;
                var yawDelta = deltaX * rotSpd;
                var curPitch = Math.acos( matrix[ 10 ] );
                var yawSign = Math.asin( matrix[ 1 ] ) < 0 ? -1 : 1;
                var curYaw = yawSign * Math.acos( matrix[ 0 ] );
                var newPitch = curPitch + pitchDelta;
                var newYaw = curYaw + yawDelta;
                var radius = matrix[ 14 ] / matrix[ 10 ];
                var upperBound = thirdPerson_MaxAngle * Math.PI / 180;
                var lowerBound = thirdPerson_MinAngle * Math.PI / 180;
                if ( isNaN( curPitch ) && pitchDelta < 0 ) {
                    newPitch = 0;
                }
                newPitch = Math.max( Math.min( newPitch, upperBound ), lowerBound );
                var newMatrix = getNewTransformMatrix( radius, newYaw, newPitch );
                obj.matrix.copy( newMatrix );
                obj.updateMatrixWorld( true );
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
            var obj = navObject.threeObject;
            var matrix = obj.matrix.elements;
            var curPitch = Math.acos( matrix[ 10 ] );
            var yawSign = Math.asin( matrix[ 1 ] ) < 0 ? -1 : 1;
            var curYaw = yawSign * Math.acos( matrix[ 0 ] );
            var radius = matrix[ 14 ] / matrix[ 10 ];
            radius += -wheelDelta / 3;
            radius = Math.max( Math.min( radius, thirdPerson_MaxZoom ), thirdPerson_MinZoom );
            var newMatrix = getNewTransformMatrix( radius, curYaw, curPitch );
            obj.matrix.copy( newMatrix );
            obj.updateMatrixWorld( true );
            break;
    }
}

function moveNavObject( deltaX, deltaY, navObject, navMode, rotationSpeed, translationSpeed, msSinceLastFrame ) {

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
            var obj = navObject.threeObject;
            var matrix = obj.matrix.elements;
            var matrixWorld = obj.matrixWorld.elements;
            var rotSpd = rotationSpeed * Math.min( msSinceLastFrame * 0.001, 0.5 ) * Math.PI / 180;
            var pitchDelta = deltaY * rotSpd;
            var yawDelta = deltaX * rotSpd;
            var curPitch = Math.acos( matrix[ 10 ] );
            var yawSign = Math.asin( matrix[ 1 ] ) < 0 ? -1 : 1;
            var curYaw = yawSign * Math.acos( matrix[ 0 ] );
            var newPitch = curPitch + pitchDelta;
            var newYaw = curYaw + yawDelta;
            var radius = matrix[ 14 ] / matrix[ 10 ];
            var upperBound = thirdPerson_MaxAngle * Math.PI / 180;
            var lowerBound = thirdPerson_MinAngle * Math.PI / 180;
            if ( isNaN( curPitch ) && pitchDelta < 0 ) {
                newPitch = 0;
            }
            newPitch = Math.max( Math.min( newPitch, upperBound ), lowerBound );
            var newMatrix = getNewTransformMatrix( radius, newYaw, newPitch );
            obj.matrix.copy( newMatrix );
            obj.updateMatrixWorld( true );
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

function getNewTransformMatrix( radius, yaw, pitch ) {
    var sy = Math.sin( yaw );
    var cy = Math.cos( yaw );
    var sp = Math.sin( pitch );
    var cp = Math.cos( pitch );
    var x = sp * sy * radius;
    var y = -sp * cy * radius;
    var z = cp * radius;
    var matrix = new THREE.Matrix4();
    matrix.elements = [
         cy,       sy,      0,  0,
        -cp * sy,  cp * cy, sp, 0,
         sp * sy, -sp * cy, cp, 0,
         x,        y,       z,  1
    ];
    return matrix;
}

//@ sourceURL=source/navigation.js