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

this.initialize = function() {
    this.onSceneReady();
}

this.setActiveTool = function( toolName ) {
    if ( toolName && this[ toolName ] ) {
        this.activeTool = toolName;
    }
}

this.pointerClick = function( pointerInfo, pickInfo ) {
    var tool;
    if ( this.activeTool && this[ this.activeTool ] ) {
        tool = this[ this.activeTool ];
        tool.handlePointerClick( pointerInfo, pickInfo );
    }
}
this.pointerDown = function( pointerInfo, pickInfo ) {
    var tool;
    if ( this.activeTool && this[ this.activeTool ] ) {
        tool = this[ this.activeTool ];
        tool.handlePointerDown( pointerInfo, pickInfo );
    }
}
this.pointerMove = function( pointerInfo, pickInfo ) {
    var tool;
    if ( this.activeTool && this[ this.activeTool ] ) {
        tool = this[ this.activeTool ];
        tool.handlePointerMove( pointerInfo, pickInfo );
    }
}
this.pointerUp = function( pointerInfo, pickInfo ) {
    var tool;
    if ( this.activeTool && this[ this.activeTool ] ) {
        tool = this[ this.activeTool ];
        tool.handlePointerUp( pointerInfo, pickInfo );
    }
}
this.pointerOver = function( pointerInfo, pickInfo ) {
    var tool;
    if ( this.activeTool && this[ this.activeTool ] ) {
        tool = this[ this.activeTool ];
        tool.handlePointerOver( pointerInfo, pickInfo );
    }
}
this.pointerOut = function( pointerInfo, pickInfo ) {
    var tool;
    if ( this.activeTool && this[ this.activeTool ] ) {
        tool = this[ this.activeTool ];
        tool.handlePointerOut( pointerInfo, pickInfo );
    }
}
this.pointerWheel = function( pointerInfo, pickInfo ) {
    var tool;
    if ( this.activeTool && this[ this.activeTool ] ) {
        tool = this[ this.activeTool ];
        tool.handlePointerWheel( pointerInfo, pickInfo );
    }
}

//@ sourceURL=editor/model/newEditor.js