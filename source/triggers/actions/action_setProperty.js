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
    if ( !this.initAction( params, generator, payload ) ) {
        return false;
    }

    if ( !params || ( params.length !== 3 ) ) {
        this.logger.errorx( "onGenerated", 
                            "This action takes three required arguments: " +
                            "the object name, the property name, and the " +
                            "property value." );
        return false;
    }

    this.objectName = params[ 0 ];
    this.propertyName = params[ 1 ];
    this.propertyValue = params[ 2 ];

    return true;
}

this.executeAction = function() {
    var object = this.findInScene( this.objectName );
    if ( !object ) {
        this.assert( false, "Object not found!" );
        return;
    }

    object[ this.propertyName ] = this.propertyValue;
}

//@ sourceURL=source/triggers/actions/action_setProperty.js
