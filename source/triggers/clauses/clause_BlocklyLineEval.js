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
    if ( !params || params.length !== 1 || 
         !params[ 0 ].length || !params[ 0 ].length === 2 ) {
        this.logger.errorx( "onGenerated", "this clause requires an array " +
                            "with the x,y position you want to check against.");
        return false;
    }

    if ( !this.initClause( params, generator, payload ) ) {
        return false;
    }

    this.targetPos = params[ 0 ];

    // TODO: don't hardcode the name?
    this.blocklyLine = this.findInScene( "blocklyLine" );
    if ( !this.blocklyLine ) {
        this.logger.errorx( "onGenerated", "Line not found!" );
        return false;
    }
    if ( !this.blocklyLine.lineGraphed ) {
        this.logger.errorx( "onGenerated", "lineGraphed event not defined!" );
        return false;
    }

    this.blocklyLine.lineGraphed = this.events.add( function() { this.parentTrigger.checkFire(); }, 
                                                    this );

    return true;
}

this.evaluateClause = function() {
    var x = this.targetPos[ 0 ];
    var actualPos = this.blocklyLine.evaluateLineAtPoint( [ x ] );

    return ( this.targetPos [ 0 ] === actualPos[ 0 ] ) &&
           ( this.targetPos [ 1 ] === actualPos[ 1 ] );
}

//@ sourceURL=source/triggers/clauses/clause_BlocklyLineEval.js
