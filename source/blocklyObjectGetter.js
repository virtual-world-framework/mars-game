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

this.getBlocklyObjects = function( nameArray, context ) {
    // make sure the context at least exists
    if ( !context ) {
        this.logger.warnx( "getBlocklyObjects", "Context is undefined!" );
        return [];
    } 

    // check if the nameArray is undefined or empty - if so, return all blockly
    //  objects in the context
    var allObjects = context.find( ".//element(*,'http://vwf.example.com/blockly/controller.vwf')" );
    if ( !nameArray || ( nameArray.length === 0 ) ) {
        return allObjects;
    }

    // look up the specific objects in the nameArray
    var retVal = allObjects.filter( function( element ) {
        return nameArray.indexOf( element.name ) >= 0;
    } );

    if ( retVal.length !== nameArray.length ) {
        this.logger.warnx( "getBlocklyObjects", "Not all blockly objects " +
                           "were found." );
    }

    return retVal;
}

//@ sourceURL=source/blocklyObjectGetter.js
