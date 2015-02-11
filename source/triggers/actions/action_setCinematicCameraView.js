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

    if ( !params || ( params.length !== 1 ) ) {
        this.logger.errorx( "onGenerated", 
                            "This action requires one argument: " +
                            "an array containing the radius (meters), yaw " +
                            "(degrees), and pitch (degrees) of the camera." );
        return false;
    }

    this.pose = params[ 0 ];
    if ( !this.pose || !this.pose.length || ( this.pose.length !== 3 ) ) {
        this.logger.errorx( "onGenerated", "Invalid pose!" );
        return false;
    }

    return true;
}

this.executeAction = function() {
    this.scene.setCinematicView( this.pose );
}

//@ sourceURL=source/triggers/actions/action_setCinematicCameraView.js
