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
        this.logger.warnx( "onGenerated", "this clause has two required and one optional " +
                            "argument: a blockly object, the intended" +
                            "array of points that should be drawn and optionally a " +
                            "timeout threshold." );
    }

    if ( !this.initOnEvent( params, generator, payload, params[ 2 ] ) ) {
        return false;
    }

    this.blockNodeName = params[ 0 ];
    this.pointArray = params[ 1 ];

    // Check if arrays are cyclic permutations of each other
    // Concatenate the search array and try to find the playerPoints in that array
    // Also check for the reverse

    var forwardArray = this.pointArray;
    var reversedArray = forwardArray.slice( 0 );

    reversedArray.reverse();

    var concatenatedForward = forwardArray.concat( forwardArray );
    var concatenatedReverse = reversedArray.concat( reversedArray );

    this.forwardString = concatenatedForward.toString();
    this.reverseString = concatenatedReverse.toString();

    // Setup the callbacks that should trigger us
    
    this.scene.blocklyCompletedPolygon = this.events.add( function( blockNodeName, pointArray ) { 
        this.onPolygonFinished( blockNodeName, pointArray ); 
    }, this );

    return true;
}

this.onPolygonFinished = function( blockNodeName, playerPoints ) {

    // Note: The playerPoints array should have length v+1 for the correct polygon. This is because we mark
    // the point where the polygon is started and where it finishes to determine if it is closed.

    var points = playerPoints.slice( 0 );

    if ( this.blockNodeName === blockNodeName ) {

        // Does the player end up where they started? ( Closed Polygon )

        var startPoint = points[ 0 ];
        var endPoint = points[ points.length - 1 ];

        if ( startPoint[ 0 ] !== endPoint[ 0 ] || startPoint[ 1 ] !== endPoint[ 1 ] ) {
            console.log('start not end');
            this.clearPolygonAndReset( blockNodeName );
            return;
        }

        // Are they the same length?

        points.pop();

        if ( this.pointArray.length !== ( points.length )  ) {
            console.log('lengths arent the same');
            this.clearPolygonAndReset( blockNodeName );
            return;
        }

        // Remove last point in the player array since it should be a duplicate

        var playerString = points.toString();

        if ( this.forwardString.indexOf( playerString ) !== -1 || this.reverseString.indexOf( playerString ) !== -1 ) {
            console.log('firing event');
            this.onEvent();
        } else {
            console.log('resetting');
            this.clearPolygonAndReset( blockNodeName );
        }
    }
}

this.clearPolygonAndReset = function( blockNodeName ) {
    var blocklyObjects = this.getBlocklyObjects( [ blockNodeName ], this.scene );
    if ( blocklyObjects ) {
        var node = blocklyObjects[ 0 ];
        node.surveyArray = [];
        this.reset();
    }
    
}

//@ sourceURL=source/triggers/clauses/clause_OnBlocklyPolygon.js
