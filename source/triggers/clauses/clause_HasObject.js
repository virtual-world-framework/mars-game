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
                            "This clause requires two arguments: " +
                            "the owner and the object." );
        return false;
    }

    if ( !this.initClause( params, generator, payload ) ) {
        return false;
    }

    this.owner = this.findInScene( params[ 0 ] );
    this.objectName = params[ 1 ];
    var object = this.findInScene( this.objectName );

    if ( !this.owner ) {
        this.logger.errorx( "onGenerated", "Failed to find object named '" +
                            params[ 0 ] + "'." );
        return false;
    }

    if ( !object ) {
        this.logger.errorx( "onGenerated", "Failed to find object named '" +
                            this.objectName + "'." );
        return false;
    }

    if ( !object.pickedUp || !object.dropped ) {
        this.logger.errorx( "onGenerated", "'" + this.objectName + "' can't " + 
                            "be picked up or dropped!" );
        return false;
    }

    object.pickedUp = this.events.add( this.parentTrigger.checkFire(), 
                                       this.parentTrigger );
    object.dropped = this.events.add( this.parentTrigger.checkFire(), 
                                      this.parentTrigger );

    return true;
}

this.evaluateClause = function() {
    // TODO: would it be better to use !!this.owner.find( this.objectName )?
    var retVal = this.owner.find( "*/" + this.objectName ).length > 0;
    return retVal;
}

//@ sourceURL=source/triggers/clauses/clause_HasObject.js
