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

this.mountCamera = function( cameraNode ) {
    var offsetTransform = [];
    if ( this.useTargetRotation ) {
        offsetTransform = goog.vec.Mat4.clone( this.worldTransform );
    } else {
        offsetTransform = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
        offsetTransform[ 12 ] = this.worldTransform[ 12 ];
        offsetTransform[ 13 ] = this.worldTransform[ 13 ];
        offsetTransform[ 14 ] = this.worldTransform[ 14 ];
    }
    offsetTransform[ 12 ] += this.worldOffset[ 0 ];
    offsetTransform[ 13 ] += this.worldOffset[ 1 ];
    offsetTransform[ 14 ] += this.worldOffset[ 2 ];
    cameraNode.followRotation = this.useTargetRotation;
    cameraNode.camera.navmode = this.navmode;
    cameraNode.transform = offsetTransform;
    cameraNode.setCameraPose( this.cameraPose );
    cameraNode.camera.translationSpeed = this.cameraSpeed;
    cameraNode.target.visible = this.targetVisible;
    cameraNode.followingTarget = this.cameraLock;
    cameraNode.mounted( this );
}

//@ sourceURL=source/cameraMount.js