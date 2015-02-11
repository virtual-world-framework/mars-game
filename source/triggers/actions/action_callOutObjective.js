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
    if ( !this.initTriggerObject( params, generator, payload ) ) {
        return false;
    }

    if ( !params || ( params.length !== 1 ) ) {
        this.logger.errorx( "onGenerated", 
                            "This action requires one argument: " +
                            "the coordinates of the tile to be called out." );
        return false;
    }

    var scenario = payload.scenario;
    if ( !scenario ) {
        this.logger.errorx( "onGenerated", "Scenario missing!" );
        return false;
    }

    var tileCoords = params[ 0 ];
    if ( !tileCoords || !tileCoords.length || ( tileCoords.length !== 2 ) ) {
        this.logger.errorx( "onGenerated", "Invalid coordinates!" );
        return false;
    }

    if ( !scenario.grid.validCoord( tileCoords) ) {
        this.logger.errorx( "onGenerated", "Coordinates out of bounds!");
        return false;
    }

    this.coords = scenario.grid.getWorldFromGrid( tileCoords[ 0 ], 
                                                  tileCoords[ 1 ] );

    return true;
}

this.executeAction = function() {
    this.scene.gridTileGraph.callOutTile.callOut( this.coords );
}

//@ sourceURL=source/triggers/actions/action_callOutObjective.js
