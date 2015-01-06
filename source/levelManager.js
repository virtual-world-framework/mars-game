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

this.setActiveLevel = function( value ) {
    var nextLevel, previousLevel;
    previousLevel = this.activeLevel;
    if ( typeof value === "string" ) {
        nextLevel = this[ value ];
    } else if ( typeof value === "object" ) {
        nextLevel = value;
    } else {
        this.logger.errorx( "setActiveLevel", "The argument must be of "
            + "type string (level name) or object (level node)." );
        return;
    }
    this.activeLevel = nextLevel;
    if ( previousLevel ) {
        previousLevel.exit();
    }
    nextLevel.enter();
    this.levelChanged( previousLevel, nextLevel );
}

//@ sourceURL=source/levelManager.js