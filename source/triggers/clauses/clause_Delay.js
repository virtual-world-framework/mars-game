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
    return true;
}

this.onDelayComplete = function() {
    this.assert( !this.delayComplete );
    this.assert( this.callbackCount > 0 );
    --this.callbackCount;

    if ( ( this.callbackCount === 0 ) && this.parentTrigger.isEnabled ) {
        this.delayComplete = true;
    }
}

this.onEnabled = function() {
    this.assert( !this.delayComplete );
    this.future( this.duration ).onDelayComplete();
    ++this.callbackCount;
}

this.onDisabled = function() {
    this.delayComplete = false;
}

this.evaluateClause = function() {
    return this.delayComplete;
}

//@ sourceURL=source/triggers/clauses/clause_Delay.js
