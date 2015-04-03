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

this.initialize = function() {
    this.future( 0 ).listenForScenarioChanged();
} 

this.listenForScenarioChanged = function() {
    this.scene.scenarioChanged = this.events.add(
        this.startScenarioTimer, this
    );
}

this.startScenarioTimer = function( scenarioName ) {
    var scenarioTimes, currentTime;
    this.stopScenarioTimer();
    this.scenarioStartTime$ = this.time;
    this.currentScenario$ = scenarioName;
    scenarioTimes = this.scenarioElapsedTimes;
    if ( !scenarioTimes.hasOwnProperty( scenarioName ) ) {
        scenarioTimes[ scenarioName ] = 0;
    }
    currentTime = scenarioTimes[ scenarioName ];
    this.scenarioElapsedTimes = scenarioTimes;
    this.startedTimer( scenarioName, currentTime );
}

this.stopScenarioTimer = function() {
    var elapsedTime, scenarioTimes, currentTime;
    if ( this.currentScenario$ ) {
        elapsedTime = this.time - this.scenarioStartTime$;
        scenarioTimes = this.scenarioElapsedTimes;
        currentTime = scenarioTimes[ this.currentScenario$ ];
        elapsedTime += isNaN( currentTime ) ? 0 : currentTime;
        scenarioTimes[ this.currentScenario$ ] = elapsedTime;
        this.scenarioElapsedTimes = scenarioTimes;
        this.updateAggregateTime();
        this.stoppedTimer( this.currentScenario$, elapsedTime );
    }
}

this.updateAggregateTime = function() {
    var times = this.scenarioElapsedTimes;
    var keys = Object.keys( this.scenarioElapsedTimes );
    var totalTime = 0;
    for ( var i = 0; i < keys.length; i++ ) {
        totalTime += times[ keys[ i ] ];
    }
    this.aggregateScenarioTime$ = totalTime;
    this.updatedAggregateTime( totalTime );
}

//@ sourceURL=source/timer.js