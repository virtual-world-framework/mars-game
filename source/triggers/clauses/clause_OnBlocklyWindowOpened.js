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
    if ( !params || ( params.length > 2 ) ) {
        this.logger.warnx( "onGenerated", "this clause takes the name(s) of " +
                            "the blockly object(s), along with an optional " +
                            "timeout threshold." );
    }

    if ( !this.initOnEvent( params, generator, payload, params[ 1 ] ) ) {
        return false;
    }

    var blocklyObjNames = this.extractStringArray( params[ 0 ] );
    var blocklyObjects = this.getBlocklyObjects( blocklyObjNames, this.scene );
    if ( blocklyObjects.length === 0 ) {
        this.logger.errorx( "onGenerated", "No blockly objects found!" );
        return false;
    }

    for ( var i = 0; i < blocklyObjects.length; ++i ) {
        var object = blocklyObjects[ i ];

        if ( object.blocklyVisibleChanged ) {
            object.blocklyVisibleChanged = this.events.add( function() { this.onBlocklyEvent(); }, 
                                                            this );
        } else {
            this.logger.warnx( "onGenerated", "blocklyVisibleChanged event " +
                               "not found for '" + object.name + "'." );
        }
    }

    return true;
}

this.onBlocklyEvent = function( visible ) {
    if ( visible ) {
        this.onEvent();
    } else {
        this.reset();
    }
}

//@ sourceURL=source/triggers/clauses/clause_OnBlocklyWindowOpened.js
