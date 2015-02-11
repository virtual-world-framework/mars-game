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

    // TODO: Remove unused success type?
    if ( params && ( params.length > 1 ) ) {
        this.logger.errorx( "onGenerated", 
                            "This action takes one optional argument: " +
                            "the type of success." );
        return false;
    }

    this.scenario = payload.scenario;
    this.successType = params ? params[ 0 ] : undefined;

    return !!this.scenario;
}

this.executeAction = function() {
    this.assert( this.scenario === this.scene.getCurrentScenario() );
    this.assert( this.scenario.isRunning() );

    this.scenario.completed( this.successType );

    this.assert( this.scenario !== this.scene.getCurrentScenario() );
    this.assert( !this.scenario.isRunning() );
}

//@ sourceURL=source/triggers/actions/action_scenarioSuccess.js
