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

this.onGenerated = function( params, generator, payload ) {
    if ( !this.initTriggerObject( params, generator, payload ) ) {
        return false;
    }

    if ( !params || ( params.length > 3 ) || !params[ 0 ] ) {
        this.logger.errorx( "onGenerated", 
                            "This action takes up to three arguments: " +
                            "the path of the node to pan towards (required), " +
                            "an optional delay after which the camera should " +
                            "return to its original position, and an " + 
                            "optional pan time (i.e. how long it should take " +
                            "to move)." );
        return false;
    }

    var targetPath = params[ 0 ];
    this.targetNode = this.scene.find( targetPath )[ 0 ];
    if ( !this.targetNode ) {
        this.logger.errorx( "onGenerated", 
                            "Target node not found!" );
        return false;
    }

    this.delay = params[ 1 ];
    this.panTime = params.length > 2 ? params[ 2 ] : 2;

    return true;
}

this.executeAction = function() {
    this.scene.cinematicCameraController.panToNode( this.targetNode, 
                                                    this.panTime, this.delay );
}

//@ sourceURL=source/triggers/actions/action_panCamera.js
