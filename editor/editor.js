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

var selectedTool = undefined;
var levelArray = new Array();
var sceneID;
var fileManager = new FileManager( document.getElementById( "fileDialog" ) );
var activeDropDown;
var compileTotal = 0;
var compileProgress = 0;
var levelIds = new Array();
var timePct = 0;

vwf_view.firedEvent = function( nodeID, eventName, args ) {
    if ( nodeID === vwf_view.kernel.application() ) {
        switch ( eventName ) {
            case "onSceneReady":
                handleSceneReady( args );
                break;
            case "objectCreated":
                levelArray.push( args[ 0 ] );
                levelArray.push( args[ 1 ] );
                break;
            case "objectDeleted":
                var name = args[ 0 ];
                var index = levelArray.indexOf( name );
                if ( index !== -1 ) {
                    // Call twice to remove the name and the object
                    removeArrayElement( levelArray, index );
                    removeArrayElement( levelArray, index );
                }
                break;
            case "timeSet":
                timePct = args[ 0 ] / 24;
                break;
        }
    }
}

vwf_view.calledMethod = function( nodeID, methodName, args ) {
    if ( nodeID === vwf_view.kernel.application() ) {
        switch ( methodName ) {
            case "requestDelete":
                var objectID = args[ 0 ];
                var objectName = args[ 1 ];
                deletePrompt( objectID, objectName );
                break;
        }
    }
}

vwf_view.gotProperty = function( nodeID, propertyName, propertyValue ) {
    if ( nodeID === sceneID ) {
        if ( propertyName === "activeTool" ) {
            var tool = document.getElementById( propertyValue );
            if ( tool ) {
                selectTool( tool );
            } else {
                console.log( "vwf_view.gotProperty: " + propertyName +
                             " - Could not find a tool with the ID: " + propertyValue );
            }
        }
    }
}

vwf_view.gotProperties = function( nodeID, properties ) {
    var index = levelIds.indexOf( nodeID );
    if ( index !== -1 ) {
        var def = JSON.parse( levelArray[ index * 2 + 1 ] );
        if ( def ) {
            def.properties = properties;
        }
        levelArray[ index * 2 + 1 ] = JSON.stringify( def );
        compileProgress++;
        if ( compileProgress >= compileTotal ) {
            levelCompiled();
        }
    }
}

function handleSceneReady( params ) {
    sceneID = vwf_view.kernel.application();
    var assetTypeSelector = document.getElementById( "typeselector" );
    assetTypeSelector.onchange = ( function() {
            loadAssetList( this.value );
    } ).bind( assetTypeSelector );
    loadAssetList( assetTypeSelector.value );
    setupMenus();
    setupTools();
    fileManager.onFileOpened = loadLevel;
}

function loadAsset( assetType, path, name ) {
    switch ( assetType ) {
        case "maps":
            vwf_view.kernel.callMethod( sceneID, "loadMap", [ path ] );
            break;
        default:
            vwf_view.kernel.callMethod( sceneID, "loadObject", [ path, name ] );
            break;
    }
}

function loadAssetList( listType ) {
    var listDom = document.getElementById( "assetlist" );
    var list, listItem;

    listDom.innerHTML = "";
    list = retrieveAssetListItems( listType );

    if ( list === undefined || list.length === 0 ) {
        listItem = document.createElement( "div" );
        listItem.innerHTML = "This list is empty.";
        listItem.className = "listitem";
        listDom.appendChild( listItem );
    } else {
        for ( var i = 0; i < list.length; i++ ) {
            listItem = document.createElement( "div" );
            listItem.innerHTML = list[ i ].name;
            listItem.className = "listitem";
            listItem.onclick = function( listType, path, name ) {
                return function() { 
                    loadAsset( listType, path, name ); 
                } 
            }( listType, list[ i ].path, list[ i ].name );
            listItem.onmouseover = function() {
                this.className = "listitem hover";
            }
            listItem.onmouseout = function() {
                this.className = "listitem";
            }
            listDom.appendChild( listItem );
        }
    }
}

function retrieveAssetListItems( listPath ) {
    // listPath should point to a directory
    // For now it will just refer to a hard-coded list
    var list = new Array();

    switch ( listPath ) {
        case "maps":
            list.push( { name: "Mars", path: "source/maps/mars.vwf" } );
            list.push( { name: "Mars Empty", path: "source/maps/mars_empty.vwf" } );
            break;
        case "obstacles":
            list.push( { name: "Crash Furrow", path: "source/obstacles/crash_furrow.vwf" } );
            list.push( { name: "Crash Pod", path: "source/obstacles/crash_pod.vwf" } );
            list.push( { name: "Crater Rubble 1", path: "source/obstacles/crater_rubble_1.vwf" } );
            list.push( { name: "Crater Rubble 2", path: "source/obstacles/crater_rubble_2.vwf" } );
            list.push( { name: "Crater Small", path: "source/obstacles/crater_small.vwf" } );
            list.push( { name: "Rock Large", path: "source/obstacles/rock_large.vwf" } );
            list.push( { name: "Rock Medium", path: "source/obstacles/rock_medium.vwf" } );
            list.push( { name: "Rock Small", path: "source/obstacles/rock_small.vwf" } );
            list.push( { name: "Rubble Blades", path: "source/obstacles/rubble_blades.vwf" } );
            list.push( { name: "Rubble Box", path: "source/obstacles/rubble_box.vwf" } );
            list.push( { name: "Rubble Container", path: "source/obstacles/rubble_container.vwf" } );
            list.push( { name: "Rubble Container Open", path: "source/obstacles/rubble_container_open.vwf" } );
            list.push( { name: "Rubble Parts", path: "source/obstacles/rubble_parts.vwf" } );
            list.push( { name: "Rubble Tank", path: "source/obstacles/rubble_tank.vwf" } );
            break;
        case "pickups":
            list.push( { name: "Battery 1", path: "source/pickups/battery_1.vwf" } );
            list.push( { name: "Battery 2", path: "source/pickups/battery_2.vwf" } );
            list.push( { name: "Battery 3", path: "source/pickups/battery_3.vwf" } );
            list.push( { name: "Quadcopter", path: "source/pickups/helicam.vwf" } );
            list.push( { name: "Radio", path: "source/pickups/radio.vwf" } );
            break;
        case "characters":
            break;
        default:
            return undefined;
    }

    return list;
}

function setupMenus() {
    var file, edit, help, load, save, newLevel, close, saveBtn;
    var ddButtons, hover, timeOfDay, slider, sliderCloseBtn;
    file = document.getElementById( "fileButton" );
    edit = document.getElementById( "editButton" );
    help = document.getElementById( "helpButton" );
    load = document.getElementById( "loadLevel" );
    save = document.getElementById( "saveLevel" );
    newLevel = document.getElementById( "newLevel" );
    close = document.getElementById( "fileCloseButton" );
    saveBtn = document.getElementById( "saveLink" );
    ddButtons = document.getElementsByClassName( "ddBtn" );
    timeOfDay = document.getElementById( "timeOfDay" );
    slider = document.getElementById( "slider" );
    sliderCloseBtn = document.getElementById( "closeSlider" );
    file.addEventListener( "click", openDropDown );
    edit.addEventListener( "click", openDropDown );
    help.addEventListener( "click", openDropDown );
    load.addEventListener( "click", openFileDialog );
    save.addEventListener( "click", openFileDialog );
    close.addEventListener( "click", closeFileDialog );
    saveBtn.addEventListener( "click", saveLevel );
    newLevel.addEventListener( "click", function( event ) {
        closeDropDown();
        clearLevel();
    } );
    timeOfDay.addEventListener( "click", openSlider );
    sliderCloseBtn.addEventListener( "click", closeSlider );
    slider.addEventListener( "mousedown", moveSliderHandle );
    slider.addEventListener( "mousemove", moveSliderHandle );
    slider.addEventListener( "mouseout", moveSliderHandle );
    hover = function( event ) {
        switch ( event.type ) {
            case "mouseover":
                appendClass( this, "hover" );
                break;
            case "mouseout":
            case "click":
                removeClass( this, "hover" );
                break;
        }
    }
    for ( var i = 0; i < ddButtons.length; i++ ) {
        ddButtons[ i ].addEventListener( "mouseover", hover );
        ddButtons[ i ].addEventListener( "mouseout", hover );
        ddButtons[ i ].addEventListener( "click", hover );
    }
    document.addEventListener( "click", function( event ) {
        closeDropDown();
    } );
}

function openSlider( event ) {
    closeDropDown();
    var slider = document.getElementById( "sliderBox" );
    slider.style.display = "block";
    setSliderPosition( timePct );
}

function closeSlider( event ) {
    var slider = document.getElementById( "sliderBox" );
    slider.style.display = "none";
}

function openFileDialog( event ) {
    closeDropDown();
    var fileDialog = document.getElementById( "fileDialog" );
    var title = document.getElementById( "title" );
    switch ( this.id ) {
        case "loadLevel":
            fileManager.saveElement.style.display = "none";
            fileManager.loadElement.style.display = "block";
            title.innerHTML = "Load Map";
            break;
        case "saveLevel":
            fileManager.loadElement.style.display = "none";
            fileManager.saveElement.style.display = "block";
            title.innerHTML = "Save Map";
            compileLevel();
            break;
    }
    fileDialog.style.display = "block";
}

function closeFileDialog() {
    var fileDialog = document.getElementById( "fileDialog" );
    fileDialog.style.display = "none";
}

function openDropDown( event ) {
    var id;
    switch ( this.id ) {
        case "fileButton":
            id = "fileMenu";
            break;
        case "editButton":
            id = "editMenu";
            break;
        case "helpButton":
            id = "helpMenu";
            break;
    }
    if ( activeDropDown ) {
        activeDropDown.style.display = "none";
        if ( activeDropDown.id !== id ) {
            activeDropDown = document.getElementById( id );
            activeDropDown.style.display = "inline-block";
        } else {
            activeDropDown = undefined;
        }
    } else {
        activeDropDown = document.getElementById( id );
        activeDropDown.style.display = "inline-block";
    }
    event.stopPropagation();
}

function closeDropDown( event ) {
    if ( activeDropDown ) {
        activeDropDown.style.display = "none";
        activeDropDown = undefined;
    }
}

function setupTools() {
    addToolsToGroup( "transformtools", [ "camera", "translate", "rotate", "raise_lower", "delete" ] );
    // addToolsToGroup( "environmenttools", [ "timeOfDay" ] );

    var tools = document.getElementsByClassName( "toolbutton" );
    var img;

    for ( var i = 0; i < tools.length; i++ ) {
        img = document.createElement( "img" );
        img.src = "../assets/images/editor/" + tools[ i ].id + ".png";
        tools[ i ].appendChild( img );
        tools[ i ].onclick = function() {
            selectTool( this );
        }
    }

    vwf_view.kernel.getProperty( sceneID, "activeTool" );
}

function selectTool( tool ) {
    if ( selectedTool ) {
        selectedTool.className = "toolbutton";
    }
    tool.className = "toolbutton selected";
    selectedTool = tool;

    vwf_view.kernel.callMethod( sceneID, "setActiveTool", [ tool.id ] );
}

function addToolsToGroup( groupID, toolIDs ) {
    var container = document.getElementById( groupID );
    for ( var i = 0; i < toolIDs.length; i++ ) {
        container.appendChild( createToolButton( toolIDs[ i ] ) );
    }
}

function createToolButton( toolID ) {
    var tool = document.createElement( "div" );
    tool.id = toolID;
    tool.className = "toolbutton";
    return tool;
}

function deletePrompt( id, name ) {
    var message = "Delete " + name + "?";
    var yes = function() {
        vwf_view.kernel.callMethod( sceneID, "deleteObject", [ id ] );
    }
    createPrompt( message, yes );
}

function createPrompt( message, yesFunc, noFunc ) {
    var ui = document.getElementById( "uiwrapper" );
    var dialog = document.getElementById( "prompt" );
    var messageBox, yesBtn, noBtn;
    if ( dialog ) {
        dialog.no();
    }
    dialog = document.createElement( "div" );
    dialog.id = "prompt";
    dialog.yes = function() {
        if ( yesFunc instanceof Function ) {
            yesFunc();
        }
        dialog.parentElement.removeChild( dialog );
    }
    dialog.no = function() {
        if ( noFunc instanceof Function ) {
            noFunc();
        }
        dialog.parentElement.removeChild( dialog );
    }

    messageBox = document.createElement( "div" );
    messageBox.className = "prompttext";
    messageBox.innerHTML = message;
    dialog.appendChild( messageBox );

    yesBtn = document.createElement( "div" );
    yesBtn.className = "promptbutton";
    yesBtn.innerHTML = "Yes";
    yesBtn.onclick = dialog.yes;
    dialog.appendChild( yesBtn );

    noBtn = document.createElement( "div" );
    noBtn.className = "promptbutton";
    noBtn.innerHTML = "No";
    noBtn.onclick = dialog.no;
    dialog.appendChild( noBtn );

    ui.appendChild( dialog );
}

function saveLevel( event ) {
    var fileName = document.getElementById( "saveText" ).value;
    if ( !fileName || fileName === "" ) {
        fileName = "level.txt";
    }
    var levelStr = "";
    for( var i = 0; i < levelArray.length; i++ ) {
        levelStr += levelArray[ i ];
        if ( i < levelArray.length - 1 ) {
            levelStr += "\n";
        }
    }
    var file = fileManager.makeFile( levelStr );
    fileManager.saveFile( file, fileName );
    closeFileDialog();
}

function loadLevel( file ) {
    if ( levelArray.length > 0 ) {
        clearLevel();
    }
    var fileArray;
    fileManager.readFile( file, function( content ) {
        closeFileDialog();
        fileArray = content.split( "\n" );
        vwf_view.kernel.callMethod(
            vwf_view.kernel.application(),
            "createLevelFromFile",
            [ fileArray ] );
    } );
    fileManager.loadElement.value = "";
}

function clearLevel() {
    vwf_view.kernel.callMethod(
        vwf_view.kernel.application(),
        "clearLevel" );
}

function compileLevel() {
    var i, id, saveLink;
    saveLink = document.getElementById( "saveLink" );
    saveLink.innerHTML = "Compiling...";
    compileTotal = 0;
    compileProgress = 0;
    levelIds.length = 0;
    if ( levelArray.length === 0 ) {
        saveLink.innerHTML = "Nothing to Save";
        return;
    }
    for ( i = 0; i < levelArray.length; i += 2 ) {
        id = vwf_view.kernel.find( "", "//" + levelArray[ i ] )[ 0 ];
        vwf_view.kernel.getProperties( id );
        levelIds.push( id );
        compileTotal++;
    }
}

function levelCompiled() {
    saveLink = document.getElementById( "saveLink" );
    saveLink.innerHTML = "Save File";
}

function setTimeOfDay( pct ) {
    var value;
    pct = Math.min( 1, Math.max( 0, pct ) );
    value = pct * 24;
    setSliderPosition( pct );
    vwf_view.kernel.callMethod( vwf_view.kernel.application(), "setTimeOfDay", [ value ] );
}

function moveSliderHandle( event ) {
    var pct, handle, deadzone;
    if ( event.which === 1 ) {
        handle = document.getElementById( "handle" );
        deadzone = handle.clientWidth / 2;
        pct = ( event.offsetX - deadzone ) / ( this.clientWidth - deadzone * 2 );
        setTimeOfDay( pct );
    }
}

function setSliderPosition( pct ) {
    var handle = document.getElementById( "handle" );
    var deadzone = handle.clientWidth / 2;
    var pos = pct * ( handle.parentNode.clientWidth - deadzone * 2 );
    var readout, h, m;
    handle.style.marginLeft = pos + "px";
    readout = document.getElementById( "readout" );
    h = Math.floor( pct * 24 );
    h = h === 0 ? 24 : h;
    h = h < 10 ? "0" + h : h;
    m = Math.floor( pct * 24 % 1 * 60 );
    m = m < 10 ? "0" + m : m;
    readout.innerHTML = "Time (hh:mm) - " + h + ":" + m;
}

//@ sourceURL=editor/editor.js