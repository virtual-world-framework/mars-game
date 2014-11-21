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
        this.logger.errorx( "onMoved", "this clause requires " +
                            "one argument: the object. It also accepts an " +
                            "optional timeout threshold." );
        return false;
    }

    if ( !this.initOnEvent( params, generator, payload, params[ 1 ] ) ) {
        return false;
    }

    var object = this.findInScene( params[ 0 ] );
    if ( !object.moved ) {
        this.logger.errorx( "onGenerated", "'" + objectName "' doesn't " + 
                            "appear to be capable of movement!" );
        return false;
    }

    // TODO: If this doesn't seem to work, I may need to wrap this.onEvent in
    //  a local function.
    object.moved = this.events.add( this.onEvent, this );

    return true;
}

//@ sourceURL=source/triggers/clauses/clauseOnMoved.js
