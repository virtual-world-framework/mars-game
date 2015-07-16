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

    if ( !params || params.length < 1 ) {
        this.logger.errorx( "onGenerated", 
                            "This action takes at least one argument. Each " +
                            "argument should be the name of a nanite system " +
                            "be deleted." );
        return false;
    }

    this.systemNames = params;

    return true;
}

this.executeAction = function() {
    var names = this.systemNames;
    for ( var i = 0; i < names.length; i++ ) {
        this.scene.deleteNaniteSystem( names[ i ] );
    }
}

//@ sourceURL=source/triggers/actions/action_deleteNanites.js
