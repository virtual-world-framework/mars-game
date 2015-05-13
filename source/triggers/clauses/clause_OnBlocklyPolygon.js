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
        this.logger.warnx( "onGenerated", "this clause has two required and one optional " +
                            "argument: a blockly object, the intended" +
                            "array of points that should be drawn and optionally a " +
                            "timeout threshold." );
    }

    if ( !this.initOnEvent( params, generator, payload, params[ 2 ] ) ) {
        return false;
    }

    this.blockNode = params[ 0 ];
    this.pointArray = params[ 1 ];

    // Setup the callbacks that should trigger us
    
    this.scene.blocklyFinishedPolygon = this.events.add( function( blockNode, pointArray ) { 
        this.onPolygonFinished( blockNode, pointArray ); 
    }, this );

    return true;
}

this.onPolygonFinished = function( blockNode, pointArray ) {
    if ( this.blockNode === blockNode ) {
        var equal = true;

        if ( this.pointArray.length !== pointArray.length ) {
            equal = false;
            return;
        }
            
        for (var i = 0, var l = this.pointArray.length; i < l; i++) {
            // Check if we have nested arrays
            if ( this.pointArray[i] !== pointArray[i]) { 
                equal = false;   
            }           
        }       

        if ( equal === true ) {
            this.onEvent();
        }
    } 
}

//@ sourceURL=source/triggers/clauses/clause_OnBlocklyPolygon.js
