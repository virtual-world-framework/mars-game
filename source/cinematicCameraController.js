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

this.panToNode = function( node, duration, delay ) {
    var camera = this.scene.gameCam;
    var cameraPosition = this.getCameraPosition();
    var nodePosition = [
        node.worldTransform[ 12 ],
        node.worldTransform[ 13 ],
        node.worldTransform[ 14 ]
    ];
    this.translation = cameraPosition;
    this.copyCameraState();
    camera.setCameraTarget( this );
    this.translateTo( nodePosition, duration );
    this.future( duration + delay ).translateTo( cameraPosition, duration );
    this.future( duration * 2 + delay ).restoreCameraState();
}

this.getCameraPosition = function() {
    var position, transform, offset;
    offset = this.scene.gameCam.mount.worldOffset.slice();
    transform = this.scene.gameCam.worldTransform;
    position = [
        transform[ 12 ] - offset[ 0 ],
        transform[ 13 ] - offset[ 1 ],
        transform[ 14 ] - offset[ 2 ]
    ];
    return position;
}

this.copyCameraState = function() {
    this.cameraState.target = this.scene.gameCam.target;
    this.cameraState.mountName = this.scene.gameCam.mount.name;
    this.default.cameraPose = this.scene.gameCam.getPoseFromTransform();
    this.default.worldOffset = this.scene.gameCam.mount.worldOffset.slice();
}

this.restoreCameraState = function() {
    this.scene.gameCam.setCameraTarget( this.cameraState.target, this.cameraState.mountName );
}

//@ sourceURL=source/cinematicCameraController.js