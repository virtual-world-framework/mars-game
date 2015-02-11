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
    if ( !params || ( params.length < 1 ) || ( params.length > 2 ) ) {
        this.logger.errorx( "onGenerated", "This clause requires " + 
                            "one argument: the object, and takes " +
                            "an additional optional argument: the " +
                            "type of failure. " );
        return false;
    }

    if ( !this.initTriggerObject( params, generator, payload ) ) {
        return false;
    }

    var object = this.findInScene( params[ 0 ] );
    this.failureType = params[ 1 ];
    this.moveHasFailed = false;

    if ( !object ) {
        this.logger.errorx( "onGenerated", "Failed to find object named '" +
                            params[ 0 ] + "'." );
        return false;
    }

    if ( !object.moveFailed ) {
        this.logger.errorx( "onGenerated", "'" + params[ 0 ] + "' can't " + 
                            "fail to move!" );
        return false;
    }

    object.moveFailed = this.events.add( function() { this.onMoveFailed(); }, this );

    return true;
}

this.onMoveFailed = function() {
    this.moveHasFailed = true;
    this.parentTrigger.checkFire();
}

this.onEnabled = function() {
    this.assert( this.moveHasFailed === false );
}

this.onDisabled = function() {
    this.moveHasFailed = false;
}

this.evaluateClause = function() {
    return this.moveHasFailed;
}

//@ sourceURL=source/triggers/clauses/clause_MoveFailed.js
