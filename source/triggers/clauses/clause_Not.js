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
    this.children.create( "clauses", "http://vwf.example.com/node.vwf" );
}

this.onGenerated = function( params, generator, payload ) {
    if ( !params || ( params.length !== 1 ) ) {
        this.logger.errorx( "onGenerated", "This clause needs to have one " +
                            "clause inside of it." );
        return false;
    }    

    if ( !this.initTriggerObject( params, generator, payload ) ) {
        return false;
    }

    generator.generateObject( params[ 0 ], this.clauses, payload );

    return true;
}

this.evaluateClause = function() {
    // TODO: should I safety check this?
    return !this.clauses.children[ 0 ].evaluateClause();
}

//@ sourceURL=source/triggers/clauses/clause_Not.js
