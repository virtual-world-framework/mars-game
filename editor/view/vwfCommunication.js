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

// This file serves as a router from vwf model events to the tools that need
// to handle them. This should not include any logic and only contain calls
// to functions in other view scripts.

var appID;
// TODO: Replace with tool object properties, i.e. tilemap.vwfID
var heightmapToolID;
var scenarioToolID;

function getAppID() {
    if ( appID === undefined ) {
        appID = vwf_view.kernel.application();
    }
    return appID;
}

vwf_view.initializedNode = function( nodeID, childID, childExtendsID, childImplementsIDs, childSource, childType, childIndex, childName ) {
    switch ( childName ) {
        case "tilemapTool":
            tilemap.vwfID = childID;
            tilemap.initialize();
            break;
        case "heightmapTool":
            heightmapToolID = childID;
            break;
        case "scenarioTool":
            scenarioToolID = childID;
            break;
    }
}

vwf_view.firedEvent = function( nodeID, eventName, eventArguments ) {
    if ( nodeID === getAppID() ) {
        switch ( eventName ) {
            case "onSceneReady":
                initialize();
                break;
        }
    } else if ( nodeID === tilemap.vwfID ) {
        tilemap.handleEvent( eventName, eventArguments );
    }
}

//@ sourceURL=editor/view/vwfCommunication.js