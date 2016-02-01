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
    if ( !params || ( params.length > 2 ) ) {
        this.logger.warnx( "onGenerated", "this clause takes the name(s) of " +
                            "the scenario(s), along with an optional timeout " +
                            "threshold." );
    }

    if ( !this.initOnEvent( params, generator, payload, params[ 1 ] ) ) {
        return false;
    }

    this.scenariosToCheck = this.extractStringArray( params[ 0 ] );

    // Setup the callbacks that should trigger us
    this.scene.scenarioFailed = this.events.add( function() { this.onScenarioEvent(); }, this );

    // Setup the callbacks that should prevent us from triggering
    this.scene.scenarioStarted = this.events.add( function() { this.reset(); }, this );
    this.scene.scenarioSucceeded = this.events.add( function() { this.reset(); }, this );

    return true;
}

this.onScenarioEvent = function( scenarioName ) {
    if ( ( this.scenariosToCheck.length === 0 ) ||
         ( this.scenariosToCheck.indexOf( scenarioName ) >= 0 ) ) {
        this.onEvent();
    }
}

//@ sourceURL=source/triggers/clauses/clause_OnScenarioFailed.js
