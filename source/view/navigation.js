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

var thirdPerson_ZoomLevel;
var topDown_controlRadius = 24;

// Zoom bounds in meters
var topDown_MaxAltitude = 100;
var topDown_MinAltitude = 9;
var thirdPerson_MaxZoom = 21;
var thirdPerson_MinZoom = 4;

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
                var obj = navObject.threeObject;
                var worldX = obj.matrixWorld.elements[ 12 ];
                var worldY = obj.matrixWorld.elements[ 13 ];
                var heightMod = obj.matrixWorld.elements[ 14 ] * 0.1;
                var panSpeed = translationSpeed * heightMod;
                deltaX = ( -deltaX * panSpeed + worldX ) - cameraTargetPosition[ 0 ];
                deltaY = ( deltaY * panSpeed + worldY ) - cameraTargetPosition[ 1 ];
                var dir = Math.atan2( deltaX, deltaY );
                var dist = Math.sqrt( Math.pow( deltaX, 2 ) + Math.pow( deltaY, 2 ) );
                dist = Math.min( dist, topDown_controlRadius );
                obj.matrix.elements[ 12 ] = Math.sin( dir ) * dist;
                obj.matrix.elements[ 13 ] = Math.cos( dir ) * dist;
                obj.updateMatrixWorld( true );
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
                // ---
                var origin = [
                    matrixWorld[ 12 ] - matrix[ 12 ],
                    matrixWorld[ 13 ] - matrix[ 13 ],
                    matrixWorld[ 14 ] - matrix[ 14 ]
                ];
                var distance = getNearestCollisionDistance( origin, newYaw, newPitch, thirdPerson_MinZoom, thirdPerson_MaxZoom );
                if ( !thirdPerson_ZoomLevel ) {
                    thirdPerson_ZoomLevel = radius;
                }
                if ( distance ) {
                    radius = Math.min( Math.max( thirdPerson_MinZoom, distance * 0.8 ), thirdPerson_ZoomLevel );
                } else {
                    radius = thirdPerson_ZoomLevel;
                }
                // ---
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
            var obj = navObject.threeObject;
            var deltaZ = -wheelDelta / 3;
            var worldZ = obj.matrixWorld.elements[ 14 ];
            deltaZ = Math.max( Math.min( deltaZ + worldZ, topDown_MaxAltitude ), topDown_MinAltitude ) - worldZ;
            obj.matrix.elements[ 14 ] += deltaZ;
            obj.updateMatrixWorld( true );
            break;

        case "thirdPerson":
            var obj = navObject.threeObject;
            var matrix = obj.matrix.elements;
            var matrixWorld = obj.matrixWorld.elements;
            var curPitch = Math.acos( matrix[ 10 ] );
            var yawSign = Math.asin( matrix[ 1 ] ) < 0 ? -1 : 1;
            var curYaw = yawSign * Math.acos( matrix[ 0 ] );
            var radius = matrix[ 14 ] / matrix[ 10 ];
            radius += -wheelDelta / 3;
            // ---
            var origin = [
                matrixWorld[ 12 ] - matrix[ 12 ],
                matrixWorld[ 13 ] - matrix[ 13 ],
                matrixWorld[ 14 ] - matrix[ 14 ]
            ];
            var distance = getNearestCollisionDistance( origin, curYaw, curPitch, thirdPerson_MinZoom, thirdPerson_MaxZoom );
            if ( distance ) {
                radius = Math.min( radius, distance * 0.8 );
            }
            thirdPerson_ZoomLevel = Math.max( Math.min( radius, thirdPerson_MaxZoom ), thirdPerson_MinZoom );
            // ---
            var newMatrix = getNewTransformMatrix( thirdPerson_ZoomLevel, curYaw, curPitch );
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
            defaultNav.move( deltaX, deltaY, navObject, navMode, rotationSpeed, translationSpeed, msSinceLastFrame );
            break;

        case "topDown":
            var obj = navObject.threeObject;
            var worldX = obj.matrixWorld.elements[ 12 ];
            var worldY = obj.matrixWorld.elements[ 13 ];
            var heightMod = obj.matrixWorld.elements[ 14 ] * 0.1;
            var panSpeed = translationSpeed * heightMod * Math.min( msSinceLastFrame * 0.001, 0.5 );
            deltaX = ( deltaX * panSpeed + worldX ) - cameraTargetPosition[ 0 ];
            deltaY = ( deltaY * panSpeed + worldY ) - cameraTargetPosition[ 1 ];
            var dir = Math.atan2( deltaX, deltaY );
            var dist = Math.sqrt( Math.pow( deltaX, 2 ) + Math.pow( deltaY, 2 ) );
            dist = Math.min( dist, topDown_controlRadius );
            obj.matrix.elements[ 12 ] = Math.sin( dir ) * dist;
            obj.matrix.elements[ 13 ] = Math.cos( dir ) * dist;
            obj.updateMatrixWorld( true );
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
            // ---
            var origin = [
                matrixWorld[ 12 ] - matrix[ 12 ],
                matrixWorld[ 13 ] - matrix[ 13 ],
                matrixWorld[ 14 ] - matrix[ 14 ]
            ];
            var distance = getNearestCollisionDistance( origin, newYaw, newPitch, thirdPerson_MinZoom, thirdPerson_MaxZoom );
            if ( !thirdPerson_ZoomLevel ) {
                thirdPerson_ZoomLevel = radius;
            }
            if ( distance ) {
                radius = Math.min( Math.max( thirdPerson_MinZoom, distance * 0.8 ), thirdPerson_ZoomLevel );
            } else {
                radius = thirdPerson_ZoomLevel;
            }
            // ---
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

function getNearestCollisionDistance( origin, yaw, pitch, near, far ) {
    var sy = Math.sin( yaw );
    var cy = Math.cos( yaw );
    var sp = Math.sin( pitch );
    var cp = Math.cos( pitch );
    var direction = [
        sp * sy,
        -sp * cy,
        cp
    ];
    origin = new THREE.Vector3( origin[ 0 ], origin[ 1 ], origin[ 2 ] );
    direction = new THREE.Vector3( direction[ 0 ], direction[ 1 ], direction[ 2 ] );
    direction.normalize();
    var raycaster = new THREE.Raycaster( origin, direction, near, far );
    // OPTIMIZE: Narrow down list of objects
    // TODO: Get the scene objects "the right way"
    var objects = getSceneObjects();
    var intersects = raycaster.intersectObjects( objects, true );
    var nearest = getFirstMesh( intersects );
    var result = nearest ? nearest.distance : undefined;
    return result;
}

// Call once?
function getSceneObjects() {
    var nodes = vwf.views[ 0 ].state.nodes;
    var keys = Object.keys( nodes );
    var objects = [];
    var i, nodeName, object;
    for ( i = 0; i < keys.length; i++ ) {
        nodeName = keys[ i ];
        object = nodes[ nodeName ].threeObject;
        if ( object.raycast ) {
            objects.push( object );
        }
    }
    return objects;
}

function getFirstMesh( list ) {
    var object;
    for ( var i = 0; i < list.length; i++ ) {
        object = list[ i ].object;
        if ( object instanceof THREE.Mesh ) {
            return list[ i ];
        }
    }
}

function updateCameraDistance( radius ) {
    if ( !isNaN( radius ) ) {
        thirdPerson_MinZoom = radius;
    }
}

//@ sourceURL=source/navigation.js