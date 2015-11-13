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

    if ( !params || ( params.length > 2 ) || !params[ 0 ] ) {
        this.logger.errorx( "onGenerated", 
                            "This action requires one or two arguments: " +
                            "the variable name and an optional value." );
        return false;
    }

    this.variableName = params[ 0 ];
    this.value = params.length === 2 ? params[ 1 ] : 1;

    if ( ( this.variableName === "lastHeading$" ) ||
         ( this.variableName === "lastRotation$" ) ) {
        this.logger.errorx( "onGenerated", "The '" + this.variableName + 
                            "' parameter is reserved for internal use." );
        return false;
    }

    return true;
}

this.executeAction = function() {
    if ( this.value === "increment" ) {
        if ( !this.scene.sceneBlackboard[ this.variableName ] ) {
            this.scene.sceneBlackboard[ this.variableName ] = 1;
        } else {
            this.scene.sceneBlackboard[ this.variableName ] += 1;
        }
    } else {
        this.scene.sceneBlackboard[ this.variableName ] = this.value;
    }

    // TODO: think about the best (safe) way to do this.  Maybe 
    //  bring the idea of additional conditions back?
//    context.blackboardWritten( name );
}

//@ sourceURL=source/triggers/actions/action_writeToBlackboard.js
