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
    if ( !params || ( params.length > 4 ) ) {
        this.logger.warnx( "onGenerated", "this clause takes an array of  " +
                            "blockly objects, whether to fire when the block " +
                            "is added or removed, an array of block types to " +
                            "look fore, and a timeout threshold." );
    }

    if ( !this.initOnEvent( params, generator, payload, params[ 3 ] ) ) {
        return false;
    }

    // Get the objects that can make us fire
    var blocklyObjNames = this.extractStringArray( params[ 0 ] );
    var blocklyObjects = this.getBlocklyObjects( blocklyObjNames, this.scene );
    if ( blocklyObjects.length === 0 ) {
        this.logger.errorx( "onGenerated", "No blockly objects found!" );
        return false;
    }

    // Determine whether we should fire when a block is added, removed,
    //   or both.
    if ( params[ 1 ] ) {
        if ( [ "add", "remove", "either" ].indexOf( params[ 1 ] ) >= 0 ) {
            this.addOrRemove = params[ 1 ];
        } else {
            this.logger.warnx( "onGenerated", "The second parameter should " +
                               "be 'add', 'remove', or 'either', indicating " +
                               "when this trigger should fire.  It was '" +
                               params[ 1 ] + "'.  Changing it to 'either'." );
            this.addOrRemove = "either";
        }
    }

    // Get the list of blocks that can make us fire (an empty list means
    //   any block will do).
    this.blockTypes = this.extractStringArray( params[ 2 ] );

    // Setup the callbacks that should trigger us
    for ( var i = 0; i < blocklyObjects.length; ++i ) {
        var object = blocklyObjects[ i ];

        if ( !object.blocklyBlockAdded || !object.blocklyBlockRemoved ) {
            this.logger.warnx( "onGenerated", "Blockly object '" + object.name +
                               "' is missing events!" );
        }

        if ( this.addOrRemove !== "add" && object.blocklyBlockRemoved ) {
            object.blocklyBlockRemoved = this.events.add( this.onProgramChangedEvent, 
                                                          this );
        }
        if ( this.addOrRemove !== "remove" && object.blocklyBlockAdded ) {
            object.blocklyBlockAdded = this.events.add( this.onProgramChangedEvent, 
                                                        this );
        }
    }

    return true;
}

this.onProgramChangedEvent = function( ignoreMe, blockType ) {
    if ( ( this.blockTypes.length === 0 ) || 
         ( this.blockTypes.indexOf( blockType ) >= 0 ) ) {
        this.onEvent();
    }
}

//@ sourceURL=source/triggers/clauses/clause_OnBlocklyProgramChanged.js
