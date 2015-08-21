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
                            "array of arrays that should be drawn and optionally a " +
                            "timeout threshold." );
    }

    if ( !this.initOnEvent( params, generator, payload, params[ 2 ] ) ) {
        return false;
    }

    this.blockNodeName = params[ 0 ];
    this.surveyArray = params[ 1 ];

    // Check if arrays are cyclic permutations of each other
    // Concatenate the search array and try to find the playerPoints in that array
    // Also check for the reverse

    for ( var i = 0; i < this.surveyArray.length; i++ ) {
        var forwardArray = this.surveyArray[ i ];
        var reversedArray = forwardArray.slice( 0 );

        reversedArray.reverse();

        var concatenatedForward = forwardArray.concat( forwardArray );
        var concatenatedReverse = reversedArray.concat( reversedArray );

        this.forwardStringArray.push( concatenatedForward.toString() );
        this.reverseStringArray.push( concatenatedReverse.toString() );
    }


    // Setup the callbacks that should trigger us
    
    this.scene.blocklyCompletedSurvey = this.events.add( function( blockNodeName, surveyArray ) { 
        this.onSurveyFinished( blockNodeName, surveyArray ); 
    }, this );

    return true;
}

this.onSurveyFinished = function( blockNodeName, playerArray ) {

    // Note: The subcomponents playerArray should have length v+1 for the correct polygon. This is because we mark
    // the point where the polygon is started and where it finishes to determine if it is closed.

    var triangles = playerArray.slice( 0 );
    var forwardArray = this.forwardStringArray.splice( 0 );
    var reverseArray = this.reverseStringArray.splice( 0 );

    var matchCount = 0;

    if ( this.blockNodeName === blockNodeName ) {

        // Have we even drawn the correct # of triangles? If not lets save ourselves some time

        if ( this.surveyArray.length !== ( triangles.length )  ) {
            this.clearSurveyAndReset( blockNodeName );
            return;
        }

        // Loop through the array of triangles and check against our expected survey values

        for ( var i = 0; i < triangles.length; i++ ) {

            var points = triangles[ i ].slice( 0 );

            // Does the player end up where they started? ( Closed Polygon )

            var startPoint = points[ 0 ];
            var endPoint = points[ points.length - 1 ];

            // If a triangle is not a closed polygon..

            if ( startPoint[ 0 ] !== endPoint[ 0 ] || startPoint[ 1 ] !== endPoint[ 1 ] ) {
                this.clearSurveyAndReset( blockNodeName );
                return;
            }

            // Remove last point in the player array since it should be a duplicate

            points.pop();

            var playerString = points.toString();

            // Loop through stored arrays and compare them forward and backward

            for ( var j = 0; j < forwardArray.length; j++ ) {
                if ( forwardArray[ j ].indexOf( playerString ) !== -1 || reverseArray[ j ].indexOf( playerString ) !== -1 ) {

                    // Is this a matching triangle? If so increment the match count and remove the string from strings to search

                    matchCount++;

                    // This removes one element at the specified index

                    forwardArray.splice( j, 1 );
                    reverseArray.splice( j, 1 );
                } else {
                    // If not, do nothing
                } 
            }

        }

    }

    if ( matchCount === this.surveyArray.length ) {
        this.onEvent();
    } else {
        this.clearSurveyAndReset( blockNodeName );
    }
}

this.clearSurveyAndReset = function( blockNodeName ) {
    var blocklyObjects = this.getBlocklyObjects( [ blockNodeName ], this.scene );
    if ( blocklyObjects ) {
        var node = blocklyObjects[ 0 ];
        node.allSurveys = [];
        this.reset();
    }
    
}

//@ sourceURL=source/triggers/clauses/clause_OnBlocklySurveyFinished.js
