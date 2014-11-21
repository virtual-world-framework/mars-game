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

    this.threshold$ = threshold != undefined ? threshold * 1000 : 667;
    this.lastEventTime$ = 0;

    // TODO: If this doesn't seem to work, I may need to wrap this.onTrigger in
    //  a local function.
    this.parentTrigger = this.events.add( this.onTrigger, this );

    return true;
}

this.onEvent = function() {
    this.lastEventTime$ = Date.now();
    this.parentTrigger.checkFire();
}

this.onTrigger = function() {
    this.lastEventTime$ = 0;
}

this.evaluateClause = function() {
    var retVal = ( this.lastEventTime$ > 0 ) && 
                 ( Date.now() - this.lastEventTime$ <= this.threshold$ );
    return retVal;
}

//@ sourceURL=source/triggers/clauses/clausePrototypeOnEvent.js

