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

    if ( !params || ( params.length !== 1 ) ) {
        this.logger.errorx( "onGenerated", 
                            "This action requires one argument: " +
                            "the coordinates of the tile to be called out." );
        return false;
    }

    this.tileCoords = params[ 0 ];
    if ( !this.tileCoords || !this.tileCoords.length || 
         ( this.tileCoords.length !== 2 ) ) {
        this.logger.errorx( "onGenerated", "Invalid coordinates!" );
        return false;
    }

    return true;
}

this.executeAction = function() {
    // var tileMap = this.scene.tileMap;
    // var coords = tileMap.getWorldCoordFromTile(
    //     this.tileCoords[ 0 ],
    //     this.tileCoords[ 1 ]
    // );
    // coords[2] = this.scene.environment.heightmap.getHeight( coords[0], coords[1] );
    // this.scene.gridTileGraph.callOutTile.callOut( coords );
    this.scene.calloutTile( this.tileCoords.slice() );
}

//@ sourceURL=source/triggers/actions/action_callOutObjective.js
