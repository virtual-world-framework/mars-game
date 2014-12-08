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

var scene;

this.initialize = function() {
    this.future( 0 ).onSceneLoaded();
}

this.onSceneLoaded = function() {
    var searchArray = this.find( this.scenePath );
    if ( searchArray.length ) {
        scene = searchArray[ 0 ];
    } else {
        this.logger.errorx( "onSceneLoaded", "Failed to find the scene!" );
    }

    this.loadTriggers( scene );
}

//@ sourceURL=source/scenario/globalScenarioTriggers.js
