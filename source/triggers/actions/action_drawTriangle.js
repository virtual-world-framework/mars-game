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
                            "This action takes three argument: " +
                            "the vertices of the triangle." );
        return false;
    }

    this.vertex1 = params[ 0 ];
    this.vertex2 = params[ 1 ];
    this.vertex3 = params[ 2 ];

    if ( ( this.vertex1[ 0 ] === undefined ) || ( this.vertex1[ 1 ] === undefined ) ||
         ( this.vertex2[ 0 ] === undefined ) || ( this.vertex2[ 1 ] === undefined ) ||
         ( this.vertex3[ 0 ] === undefined ) || ( this.vertex3[ 1 ] === undefined ) ) {
        this.logger.errorx( "onGenerated", "The arguments to this action " +
                                           "should be [ x, y ] arrays." );
        return false;
    }

    return true;
}

this.executeAction = function() {
    var scene = this.scene;
    var tileMap = scene.tileMap;

    if ( scene && tileMap ) {
        var gridVert1 = scene.addAxisOffset( this.vertex1 );
        var worldVert1 = tileMap.getWorldCoordFromTile( gridVert1[ 0 ], gridVert1[ 1 ] );
        var gridVert2 = scene.addAxisOffset( this.vertex2 );
        var worldVert2 = tileMap.getWorldCoordFromTile( gridVert2[ 0 ], gridVert2[ 1 ] );
        var gridVert3 = scene.addAxisOffset( this.vertex3 );
        var worldVert3 = tileMap.getWorldCoordFromTile( gridVert3[ 0 ], gridVert3[ 1 ] );
        this.scene.drawSchematicTriangle( worldVert1, worldVert2, worldVert3 );
    }
}

//@ sourceURL=source/triggers/actions/action_drawTriangle.js
