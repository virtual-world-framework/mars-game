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
                            "the video(s), along with an optional timeout " +
                            "threshold." );
    }

    if ( !this.initOnEvent( params, generator, payload, params[ 1 ] ) ) {
        return false;
    }

    this.videosToCheck = this.extractStringArray( params[ 0 ] );

    this.scene.videoPlayed = this.events.add( this.onPlayedEvent, this );

    return true;
}

this.onPlayedEvent = function( video ) {
    if ( this.videosToCheck.contains( video ) ) {
        this.onEvent();
    }
}

//@ sourceURL=source/triggers/clauses/clause_OnVideoPlayed.js
