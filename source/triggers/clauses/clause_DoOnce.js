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
    if ( params.length !== 0 ) {
        this.logger.warnx( "delay", "This clause does not take any " +
                            "arguments." );
    }

    if ( !this.initClause( params, generator, payload ) ) {
        return false;
    }

    return true;
}

this.onTriggered = function() {
    this.hasTriggered = true;
}

this.evaluateClause = function() {
    return !this.hasTriggered;
}

//@ sourceURL=source/triggers/clauses/clause_DoOnce.js
