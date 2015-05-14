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
    if ( params && ( params.length < 2 ) && ( params.length > 3 ) ) {
        this.logger.warnx( "onGenerated", "this clause has two or three " +
        "arguments: a blockly object, a " +
        "blockName, and an optional threshold" );
    }

    this.blockName = params[ 0 ];
    this.blockID = params[ 1 ];
    this.blockTime = params[ 2 ];
    this.blockNode = params[ 3 ];

    if ( !this.initOnEvent( params, generator, payload, params[ 2 ] ) ) {
        return false;
    }

    this.scene.blockExecuted = this.events.add( function( blockName, blockID, blockTime, blockNode ) { 
        this.onBlockExecuted( blockName, blockID, blockTime, blockNode ); 
    }, this );

    return true;
}

this.onBlockExecuted = function( blockName, blockID, blockTime, blockNode ) {
    if ( ( this.blockName === blockName ) && ( this.blockNode === blockNode ) ) {
        this.onEvent(); 
    } 
}

//@ sourceURL=source/triggers/clauses/clause_OnBlocklyBlock.js
