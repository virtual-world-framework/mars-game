// Copyright 2014 Lockheed Martin Corporation
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

this.initOnEvent = function( params, generator, payload, threshold ) {
    if ( !this.initClause( params, generator, payload ) ) {
        return false;
    }

    if ( !this.name ) {
        return; // this is the prototype
    }

    // NOTE: if the trigger is in a trigger group, it could be as much as
    //  0.12 seconds (two trigger group updates) before the trigger group is 
    //  ready to fire (plus any frame delay).  I wouldn't set this to less 
    //  than 0.5 seconds to be safe (especially given that some machines have
    //  better performance than others).
    this.threshold$ = threshold != undefined ? threshold * 1000 : 667;
    this.lastEventTime$ = 0;

    return true;
}

this.onEvent = function() {
    if ( this.parentTrigger.isEnabled === true ) {
        // this.logger.logx( "onEvent", "Trigger: '" + this.parentTrigger.name +
        //                              "', Name: '" + this.name + "'." );
        this.lastEventTime$ = Date.now();
        this.parentTrigger.checkFire();
    }
}

this.onEnabled = function() {
    this.assert( this.lastEventTime$ === 0, "Last event time not reset. " +
                                            "The parent trigger is: " + 
                                            this.parentTrigger.name );
}

this.onDisabled = function() {
    this.reset();
}

this.onEvaluated = function() {
    this.reset();
}

this.onTriggered = function() {
    this.reset();
}

this.reset = function() {
    // if ( this.evaluateClause() ) {
    //     this.logger.logx( "reset", "Trigger: '" + this.parentTrigger.name +
    //                                "', Name: '" + this.name + "'." );
    // }

    this.lastEventTime$ = 0;
}

this.evaluateClause = function() {
    var retVal = ( this.lastEventTime$ > 0 ) && 
                 ( this.time - this.lastEventTime$ <= this.threshold$ );
    return retVal;
}

//@ sourceURL=source/triggers/clauses/clauseProto_OnEvent.js

