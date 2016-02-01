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

    if ( !params || ( params.length < 1 ) ) {
        this.logger.errorx( "onGenerated", 
                            "This action takes at least one argument: " +
                            "the name of the nodes to use for Blockly." );
        return false;
    }

    this.nodeNames = params;
    return true;
}

this.executeAction = function() {
    this.scene.clearBlocklyContext();
    this.scene.setBlocklyContext( this.nodeNames );
}

//@ sourceURL=source/triggers/actions/action_setBlocklyContext.js
