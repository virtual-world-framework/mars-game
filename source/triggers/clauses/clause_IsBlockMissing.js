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
    if ( !params || ( params.length != 1 ) ) {
        this.logger.errorx( "onGenerated", 
                            "This clause requires one argument: " +
                            "The type of block we want present in our main workspace.");
        return false;
    }

    if ( !this.initClause( params, generator, payload ) ) {
        return false;
    }

    this.blockType = params[ 0 ];    

    return true;
}

this.evaluateClause = function() {
    var workspace = Blockly.getMainWorkspace();
    var presentBlocks = workspace.getAllBlocks();
    var present = false;
    for ( var i = 0; i < presentBlocks.length; i++ ) {
        if( presentBlocks[i].type === this.blockType ){
            present = true;
            break;
        }
    }
    return !present;
}

//@ sourceURL=source/triggers/clauses/clause_OnBlockMissing.js