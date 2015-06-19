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
    if ( params && ( params.length !== 3 ) ) {
        this.logger.warnx( "onGenerated", "this clause has  three " +
        "arguments: a blockly object, a blockName, and an truth value " +
        "to check for firing on all blocks but the one provided" );
    }

    this.blockName = params[ 1 ];
    this.truthValue = params[ 2 ];

    var blocklyObjNames = this.extractStringArray( params[ 0 ] );
    this.blocklyObjects = this.getBlocklyObjects( blocklyObjNames, this.scene );
    if ( this.blocklyObjects.length === 0 ) {
        this.logger.errorx( "onGenerated", "No blockly objects found!" );
        return false;
    }

    if ( !this.initOnEvent( params, generator, payload, params[ 2 ] ) ) {
        return false;
    }
    this.scene.blockExecuted = this.events.add( function( blockName, blockID, blockNode, blockTime ) { 
        this.onBlockExecuted( blockName, blockID,  blockNode, blockTime ); 
    }, this );
    return true;
}

this.onBlockExecuted = function( blockName, blockID, blockNode ) {
    for ( var i = 0; i < this.blocklyObjects.length; ++i ) {
        var object = this.blocklyObjects[ i ];
        if ( ( this.blockName === blockName ) && ( object.id === blockNode ) && this.truthValue === true ) {
            this.onEvent(); 
        } else if ( ( this.blockName !== blockName ) && ( object.id === blockNode ) && this.truthValue === false ) {
            this.onEvent();
        }
    }
}

//@ sourceURL=source/triggers/clauses/clause_OnBlocklyBlock.js

