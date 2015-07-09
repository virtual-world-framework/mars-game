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

function initialize() {
    document.body.addEventListener( "click", closeDropMenus );
    initButtons();
}

function initButtons() {
    var buttons = document.getElementsByClassName( "button" );
    var button, clickFunction;
    for ( var i = 0; i < buttons.length; i++ ) {
        button = buttons[ i ];
        button.onmouseover = hoverButton.bind( button );
        button.onmouseout = hoverButton.bind( button );
        switch ( button.id ) {
            case "fileButton":
                clickFunction = openDropMenu.bind( "fileMenu" );
                break;
            case "editButton":
                clickFunction = openDropMenu.bind( "editMenu" );
                break;
            case "toolsButton":
                clickFunction = openDropMenu.bind( "toolsMenu" );
                break;
            case "newButton":
                clickFunction = newLevel;
                break;
            case "saveButton":
                clickFunction = saveLevel;
                break;
            case "loadButton":
                clickFunction = loadLevel;
                break;
            case "objectButton":
                clickFunction = openObjectBrowser;
                break;
            case "timeButton":
                clickFunction = openTimeOfDayEditor;
                break;
            case "scenarioButton":
                clickFunction = openScenarioEditor;
                break;
            case "heightmapButton":
                clickFunction = openHeightmapEditor;
                break;
            case "tilemapButton":
                clickFunction = openTilemapEditor;
                break;
            default:
                console.log( "Button ID not handled: " + button.id );
                break;
        }
        if ( clickFunction instanceof Function ) {
            button.addEventListener( "click", clickFunction );
            if ( button.parentElement.className === "dropMenu" ) {
                button.addEventListener( "click", closeDropMenus );
            }
        }
    }
}

function openDropMenu() {
    if ( !this ) {
        console.log( "openDropMenu", "No drop down menu specified." );
        return;
    }
    var menu = document.getElementById( this );
    if ( !menu ) {
        console.log( "openDropMenu", "Could not find DOM element with " +
            "ID: " + this );
    }
    var visible = menu.style.display === "block";
    closeDropMenus();
    if ( !visible ) {
        menu.style.display = "block";
    }
    event.stopPropagation();
}

function closeDropMenus() {
    var menus = document.getElementsByClassName( "dropMenu" );
    for ( var i = 0; i < menus.length; i++ ) {
        menus[ i ].style.display = "none";
    }
}

function hoverButton() {
    var hover = event.type === "mouseover";
    this.className = hover ? "button hover" : "button";
}

function newLevel() {}
function saveLevel() {}
function loadLevel() {}
function openObjectBrowser() {}
function openTimeOfDayEditor() {}
function openScenarioEditor() {}
function openHeightmapEditor() {}
function openTilemapEditor() {
    vwf_view.kernel.callMethod( appID, "setActiveTool", [ "tilemapTool" ] );
}

//@ sourceURL=editor/view/editorUI.js