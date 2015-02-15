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
    if ( ( params.length < 1 ) || ( params.length > 2 ) ) {
        this.logger.errorx( "onGenerated", "This clause takes the variable " +
                            "name and optionally the variable value" );
        return false;
    }

    if ( !this.initClause( params, generator, payload ) ) {
        return false;
    }

    this.variableName = params[ 0 ];
    this.variableValue = params[ 1 ];

    this.scene.blackboardWritten = this.events.add( function() {
        this.parentTrigger.checkFire();
        }, this );


    return true;
}

this.evaluateClause = function() {
    var checkedValue = this.scene.sceneBlackboard[ this.variableName ];
    var retVal = ( checkedValue !== undefined );  

    if ( retVal && ( this.variableValue !== undefined && this.variableValue != null ) ) {
        retVal = ( checkedValue === this.variableValue );
    }

    return retVal;
}

//@ sourceURL=source/triggers/clauses/clause_ReadBlackboard.js
