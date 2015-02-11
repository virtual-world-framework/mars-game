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
    if ( !params || ( params.length !== 2 ) ) {
        this.logger.errorx( "onGenerated", 
                            "This clause requires two arguments: the object " +
                            "and an array containing the x and y grid " +
                            "positions." );
        return false;
    }

    if ( !this.initTriggerObject( params, generator, payload ) ) {
        return false;
    }

    this.object = this.findInScene( params[ 0 ] );
    this.targetPos = params[ 1 ];

    if ( !this.object ) {
        this.logger.errorx( "onGenerated", "Failed to find object named '" +
                            object + "'." );
        return false;
    }

    if ( this.targetPos[ 0 ] === undefined || 
         this.targetPos[ 1 ] === undefined) {
        this.logger.errorx( "onGenerated", "The second argument must be a 2D " +
                            "array specifying the grid position we should " +
                            "check against." );
        return false;
    }

    if ( !this.object.moved ) {
        this.logger.errorx( "onGenerated", "'" + params[ 0 ] + "' doesn't " + 
                            "appear to be capable of movement!" );
        return false;
    }

    this.object.moved = this.events.add( function() { this.parentTrigger.checkFire(); }, 
                                         this );

    return true;
}

this.evaluateClause = function() {
    var retVal = this.object.currentGridSquare[ 0 ] === this.targetPos[ 0 ] && 
                 this.object.currentGridSquare[ 1 ] === this.targetPos[ 1 ];

    return retVal;
}

//@ sourceURL=source/triggers/clauses/clause_IsAtPosition.js
