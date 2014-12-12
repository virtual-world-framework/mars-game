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
    if ( params.length !== 1 ) {
        this.logger.errorx( "delay", "This clause takes exactly one argument: " +
                            "the amount of time to delay (in seconds)." );
        return false;
    }

    if ( !this.initClause( params, generator, payload ) ) {
        return false;
    }

    this.duration = params[ 0 ];

    this.assert( !this.delayStarted );
    this.reset();

    return true;
}

this.onDelayComplete = function() {
    this.assert( this.cancelDelay >= 0 );

    if ( this.cancelDelay === 0 ) {
        this.assert( this.delayStarted );
        this.delayStarted = false;

        this.delayComplete = true;

        this.parentTrigger.checkFire();
    } else {
        --this.cancelDelay;
    }
}

this.reset = function() {
    if ( this.delayStarted ) {
        this.assert( !this.delayComplete );
        ++this.cancelDelay;
    }

    this.delayComplete = false;
    this.future( this.duration ).onDelayComplete();
    this.delayStarted = true;
}

this.evaluateClause = function() {
    return this.delayComplete;
}

//@ sourceURL=source/triggers/clauses/clause_Delay.js
