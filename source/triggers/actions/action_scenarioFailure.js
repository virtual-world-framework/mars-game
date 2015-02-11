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

    if ( params && ( params.length > 2 ) ) {
        this.logger.errorx( "onGenerated", 
                            "This action takes two optional arguments: " +
                            "the type of failure and a message to display." );
        return false;
    }

    this.scenario = payload.scenario;
    this.failureType = params ? params[ 0 ] : undefined;
    this.message = params ? params[ 1 ] : undefined;

    return !!this.scenario;
}

this.executeAction = function() {
    this.assert( this.scenario === this.scene.getCurrentScenario() );
    this.assert( this.scenario.isRunning() );

    this.scenario.completed( this.failureType, message );
}

//@ sourceURL=source/triggers/actions/action_scenarioFailure.js
