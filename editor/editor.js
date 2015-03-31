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
var fileManager = new FileManager( document.getElementById( "fileWrapper" ) );
var activeDropDown;
var timePct = 0;
var levelFile;
var appID;
var scenarioJson = new JsonEditor( "scenarioList" );
// Calls functions from editor/triggerObjects.js
var conditions = getConditions();
var actions = getActions();

var blockTypes = {
    "Graph: y=": "graph_set_y",
    "Graph: x": "graph_get_x",
    "Graph: Number": "math_number_out",
    "Graph: Add": "graph_add",
    "Graph: Subtract": "graph_subtract",
    "Graph: Multiply": "graph_multiply",
    "Graph: Divide": "graph_divide",
    "Graph: Right Paren": "graph_right_paren",
    "Graph: Left Paren": "graph_left_paren",
    "Rover: Move Forward": "rover_moveForward",
    "Rover: Turn": "rover_turn",
    "Rover: Sensor": "controls_sensor_tracks",
    "Rover: While": "controls_whileUntil",
    "Rover: Repeat": "controls_repeat_extended",
    "Rover: Number": "math_number_out"
}

function getAppID() {
    if ( appID === undefined ) {
        appID = vwf_view.kernel.application();
    }
    return appID;
}

vwf_view.firedEvent = function( nodeID, eventName, args ) {
    if ( nodeID === getAppID() ) {
        switch ( eventName ) {
            case "onSceneReady":
                handleSceneReady( args );
                break;
            case "objectCreated":
                break;
            case "objectDeleted":
                break;
            case "timeSet":
                timePct = args[ 0 ] / 24;
                break;
            case "levelCompiled":
                var levelArray = args[ 0 ];
                var saveLink;
                createLevelFile( levelArray );
                saveLink = document.getElementById( "saveLink" );
                saveLink.innerHTML = "Save Level";
                break;
            case "scenariosLoaded":
                var json = JSON.parse( args[ 0 ] );
                scenarioJson.clearJson( "scenarios" );
                scenarioJson.loadJson( json, "scenarios" );
                break;
        }
    }
}

vwf_view.calledMethod = function( nodeID, methodName, args ) {
    if ( nodeID === getAppID() ) {
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
    if ( nodeID === getAppID() ) {
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

function handleSceneReady( params ) {
    var assetTypeSelector = document.getElementById( "typeselector" );
    assetTypeSelector.onchange = ( function() {
            loadAssetList( this.value );
        } ).bind( assetTypeSelector );
    loadAssetList( assetTypeSelector.value );
    setupMenus();
    setupTools();
    scenarioJson.jsonUpdated = saveJson;
    scenarioJson.newElementDefault = scenarioJson.addNewElement;
    scenarioJson.addNewElement = addScenarioElement;
    fileManager.onFileOpened = loadLevel;
    document.addEventListener( "keydown", handleKeyPropagation );
}

function loadAsset( assetType, path, name ) {
    switch ( assetType ) {
        case "maps":
            vwf_view.kernel.callMethod( getAppID(), "loadMap", [ path ] );
            break;
        default:
            vwf_view.kernel.callMethod( getAppID(), "loadObject", [ path, name ] );
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
            list.push( { name: "Rover Default", path: "source/rovers/rover_default.vwf" } );
            list.push( { name: "Rover Blue", path: "source/rovers/rover_blue.vwf" } );
            list.push( { name: "Rover Orange", path: "source/rovers/rover_orange.vwf" } );
            list.push( { name: "Rover Pink", path: "source/rovers/rover_pink.vwf" } );
            list.push( { name: "Rover Pink Camo", path: "source/rovers/rover_pink_camo.vwf" } );
            list.push( { name: "Rover Red", path: "source/rovers/rover_red.vwf" } );
            list.push( { name: "Rover Retro", path: "source/rovers/rover_retro.vwf" } );
            break;
        default:
            return undefined;
    }

    return list;
}

function setupMenus() {
    var file, edit, help, load, save, newLevel, close, saveBtn;
    var ddButtons, hover, timeOfDay, slider, sliderCloseBtn;
    var scenarioButton, scenarioCloseButton, addScenario, deleteEntry;
    var cancelTriggerButton, addActionButton;
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
    scenarioButton = document.getElementById( "scenarioButton" );
    scenarioCloseButton = document.getElementById( "scenarioCloseButton" );
    addScenario = document.getElementById( "addScenario" );
    deleteEntry = document.getElementById( "deleteEntry" );
    slider = document.getElementById( "slider" );
    sliderCloseBtn = document.getElementById( "closeSlider" );
    cancelTriggerButton = document.getElementById( "cancelTrigger" );
    addActionButton = document.getElementById( "addAction" );
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
    scenarioButton.addEventListener( "click", openScenarioEditor );
    scenarioCloseButton.addEventListener( "click", closeScenarioEditor );
    sliderCloseBtn.addEventListener( "click", closeSlider );
    slider.addEventListener( "mousedown", moveSliderHandle );
    slider.addEventListener( "mousemove", moveSliderHandle );
    slider.addEventListener( "mouseout", moveSliderHandle );
    addScenario.addEventListener( "click", openNewScenarioDialog );
    deleteEntry.addEventListener( "click", scanForDeleteCandidate );
    cancelTriggerButton.addEventListener( "click", closeTriggerDialog );
    addActionButton.addEventListener( "click", addAction );
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

function openScenarioEditor( event ) {
    var scenarioEditor = document.getElementById( "scenarioEditor" );
    scenarioEditor.style.display = "block";
}

function closeScenarioEditor( event ) {
    var scenarioEditor = document.getElementById( "scenarioEditor" );
    scenarioEditor.style.display = "none";
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

    vwf_view.kernel.getProperty( getAppID(), "activeTool" );
}

function selectTool( tool ) {
    if ( selectedTool ) {
        selectedTool.className = "toolbutton";
    }
    tool.className = "toolbutton selected";
    selectedTool = tool;

    vwf_view.kernel.callMethod( getAppID(), "setActiveTool", [ tool.id ] );
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
        vwf_view.kernel.callMethod( getAppID(), "deleteObject", [ id ] );
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

function createLevelFile( levelArray ) {
    var levelStr = "";
    for( var i = 0; i < levelArray.length; i++ ) {
        levelStr += levelArray[ i ];
        if ( i < levelArray.length - 1 ) {
            levelStr += "\n";
        }
    }
    levelFile = fileManager.makeFile( levelStr );
}

function saveLevel( event ) {
    var fileName = document.getElementById( "saveText" ).value;
    if ( !fileName || fileName === "" ) {
        fileName = "level.txt";
    }
    fileManager.saveFile( levelFile, fileName );
    closeFileDialog();
}

function loadLevel( file ) {
    var fileArray;
    clearLevel();
    fileManager.readFile( file, function( content ) {
        closeFileDialog();
        fileArray = content.split( "\n" );
        vwf_view.kernel.callMethod(
            getAppID(),
            "createLevelFromFile",
            [ fileArray ] );
    } );
    fileManager.loadElement.value = "";
}

function clearLevel() {
    vwf_view.kernel.callMethod(
        getAppID(),
        "clearLevel" );
}

function compileLevel() {
    var saveLink;
    saveLink = document.getElementById( "saveLink" );
    saveLink.innerHTML = "Compiling...";
    vwf_view.kernel.callMethod( getAppID(), "compileLevel" );
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
    vwf_view.kernel.setProperty( getAppID(), "timeOfDay", value );
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

function handleKeyPropagation( event ) {
    if ( event.srcElement.nodeName === "INPUT" ) {
        event.stopPropagation();
    }
}

function scanForDeleteCandidate() {
    var scenarioEditor = document.getElementById( "scenarioEditor" );
    scenarioEditor.style.cursor = "pointer";
    document.addEventListener( "click", deleteSelectedEntry );
}

function deleteSelectedEntry( event ) {
    var el = event.target;
    var scenarioEditor = document.getElementById( "scenarioEditor" );
    if ( el.id === "deleteEntry" ) {
        return;
    }
    document.removeEventListener( "click", deleteSelectedEntry );
    scenarioEditor.style.cursor = "default";
    if ( el.classList.contains( "entry" ) && el.classList.contains( "category" ) ) {
        if ( el.jsonName === "scenarios" ) {
            return;
        }
        el.parentElement.parentElement.removeChild( el.parentElement );
    } else if ( el.classList.contains( "entry" ) ) {
        el.parentElement.removeChild( el );
    }
    saveJson();
}

function saveJson() {
    vwf_view.kernel.callMethod( getAppID(), "saveScenarios", [ scenarioJson.getJson() ] );
}

function addScenarioElement( parentType, contents, parent ) {
    var parentName = parent.split( "." );
    parentName = parentName[ parentName.length - 1 ];
    switch ( parentName ) {
        case "scenarios":
            openNewScenarioDialog();
            break;
        case "triggers":
            openTriggerDialog( parentType, contents, parent );
            break;
        case "startState":
        default:
            this.newElementDefault( parentType, contents, parent );
    }
}

function openNewScenarioDialog() {
    var dialog = document.getElementById( "newScenarioDialog" );
    var name = document.getElementById( "newScenarioName" );
    var submit = document.getElementById( "newScenarioSubmit" );
    var cancel = document.getElementById( "newScenarioCancel" );
    var scenarioContents = scenarioJson.rootObjects.scenarios.lastChild;
    dialog.style.display = "block";
    submit.onclick = function() {
        var newScenario = { 
            "extends": "source/scenario/scenario.vwf",
            "properties": {
                "scenarioName": name.value,
                "nextScenarioPath": "",
                "startState": []
            },
            "children": {
                "triggerManager": {
                    "extends": "source/triggers/triggerManager.vwf",
                    "properties": {
                        "triggers": {}
                    }
                },
                "grid": {
                    "extends": "source/grid.vwf",
                    "properties": {
                        "minX": 0,
                        "maxX": 1,
                        "minY": 0,
                        "maxY": 1,
                        "gridOriginInSpace": [ 0, 0 ],
                        "gridSquareLength": 3,
                        "boundaryValues": [ 0 ]
                    }
                }
            }
        };
        scenarioContents.appendChild( scenarioJson.createEntry( newScenario, name.value, "scenarios" ) );
        dialog.style.display = "none";
        saveJson();
    }
    cancel.onclick = function() {
        dialog.style.display = "none";
    }
}

function openTriggerDialog( parentType, contents, parent ) {
    var dialog = document.getElementById( "newTriggerDialog" );
    var addTriggerButton = document.getElementById( "submitTrigger" );
    addTriggerButton.addEventListener( "click", function() {
        var triggerName = document.getElementById( "triggerName" ).value;
        var trigger = compileTrigger();
        contents.appendChild( scenarioJson.createEntry( trigger, triggerName, parent ) );
        closeTriggerDialog();
        saveJson();
    } );
    addCondition();
    dialog.style.display = "block";
}

function closeTriggerDialog() {
    var dialog = document.getElementById( "newTriggerDialog" );
    dialog.style.display = "none";
    resetTriggerDialog();
}

function resetTriggerDialog() {
    var conditionList = document.getElementById( "triggerConditions" );
    var actionList = document.getElementById( "triggerActions" );
    conditionList.innerHTML = "";
    actionList.innerHTML = "";
}

function compileTrigger() {
    var triggerConditions = document.getElementById( "triggerConditions" );
    var triggerActions = document.getElementById( "triggerActions" );
    var trigger = {};
    trigger[ "triggerCondition" ] = triggerConditions.getOutput();
    trigger[ "actions" ] = triggerActions.getOutput();
    return trigger;
}

function addCondition() {
    var keys = Object.keys( conditions );
    var conditionList = document.getElementById( "triggerConditions" );
    var select = conditionSelector();
    conditionList.appendChild( select );
    conditionList.getOutput = function() {
        return [ select.getOutput() ];
    }
}

function addAction() {
    var keys = Object.keys( actions );
    var actionList = document.getElementById( "triggerActions" );
    var wrapper = actionSelector( true );
    wrapper.classList.add( "action" );
    actionList.appendChild( wrapper );
    actionList.getOutput = function() {
        var output = [];
        var list = this.getElementsByClassName( "action" );
        for ( var i = 0; i < list.length; i++ ) {
            output.push( list[ i ].getOutput() );
        }
        return output;
    }
}

function loadActionOrCondition( selected, element ) {
    element.innerHTML = "";
    var reqArgs, optArgs, repArgs, label, name, i;
    reqArgs = selected.requiredArgs;
    optArgs = selected.optionalArgs;
    repArgs = selected.repeatedArgs;
    var required, optional, repeated;
    // Length of 0 is false
    if ( !reqArgs.length && !optArgs.length && !repArgs.length ) {
        element.style.display = "none";
    } else {
        element.style.display = "block";
        if ( reqArgs.length ) {
            required = [];
            for ( i = 0; i < reqArgs.length; i++ ) {
                name = Object.keys( reqArgs[ i ] )[ 0 ];
                label = document.createElement( "div" );
                label.innerHTML = name + " (Required):";
                label.className = "label";
                element.appendChild( label );
                var dataElement = createDataElement( reqArgs[ i ][ name ] );
                required.push( dataElement );
                element.appendChild( dataElement );
            }
        }
        if ( optArgs.length ) {
            optional = [];
            for ( i = 0; i < optArgs.length; i++ ) {
                name = Object.keys( optArgs[ i ] )[ 0 ];
                label = document.createElement( "div" );
                label.innerHTML = name + " (Optional):";
                label.className = "label";
                element.appendChild( label );
                var dataElement = createDataElement( optArgs[ i ][ name ] );
                optional.push( dataElement );
                element.appendChild( dataElement );
            }
        }
        if ( repArgs.length ) {
            repeated = [];
            var args = document.createElement( "div" );
            var addArg = document.createElement( "div" );
            addArg.id = "addArgument";
            addArg.className = "textButton";
            addArg.innerHTML = "Add Argument...";
            addArg.addEventListener( "click", function() {
                for ( i = 0; i < repArgs.length; i++ ) {
                    var argWrapper = document.createElement( "div" );
                    var removeBtn = document.createElement( "div" );
                    removeBtn.className = "inlineTextButton";
                    removeBtn.innerHTML = "Remove";
                    name = Object.keys( repArgs[ i ] )[ 0 ];
                    label = document.createElement( "div" );
                    label.innerHTML = name + " (Optional):";
                    label.className = "label";
                    label.appendChild( removeBtn );
                    argWrapper.appendChild( label );
                    var dataElement = createDataElement( repArgs[ i ][ name ] );
                    repeated.push( dataElement );
                    argWrapper.appendChild( dataElement );
                    args.appendChild( argWrapper );
                    removeBtn.addEventListener( "click", function() {
                        argWrapper.parentElement.removeChild( argWrapper );
                        var index = repeated.indexOf( dataElement );
                        removeArrayElement( repeated, index );
                    } );
                }
            } );
            element.appendChild( args );
            element.appendChild( addArg );
        }
        element.getOutput = function() {
            var output = [];
            if ( required ) {
                for ( var i = 0; i < required.length; i++ ) {
                    output.push( required[ i ].getOutput() );
                }
            }
            if ( optional ) {
                for ( var i = 0; i < optional.length; i++ ) {
                    output.push( optional[ i ].getOutput() );
                }
            }
            if ( repeated ) {
                for ( var i = 0; i < repeated.length; i++ ) {
                    output.push( repeated[ i ].getOutput() );
                }
            }
            return output;
        }
    }
}

function createDataElement( argType ) {
    var element, arrayWrapper, addButton, removeButton;
    if ( argType.indexOf( "array:" ) !== -1 ) {
        arrayWrapper = document.createElement( "div" );
        element = document.createElement( "div" );
        addButton = document.createElement( "div" );
        addButton.className = "textButton";
        addButton.innerHTML = "Add Element...";
        argType = argType.replace( "array:", "" );
        addButton.addEventListener( "click", function() {
            var container = document.createElement( "div" );
            var arrayElement = createDataElement( argType );
            arrayElement.className = "arrayElement";
            removeButton = document.createElement( "div" );
            removeButton.className = "inlineTextButton";
            removeButton.innerHTML = "Remove";
            removeButton.addEventListener( "click", function() {
                container.parentElement.removeChild( container );
            } );
            container.appendChild( arrayElement );
            container.appendChild( removeButton );
            arrayWrapper.appendChild( container );
        } );
        element.appendChild( arrayWrapper );
        element.appendChild( addButton );
        element.getOutput = function() {
            var children = this.getElementsByClassName( "arrayElement" );
            var output = new Array();
            for ( var i = 0; i < children.length; i++ ) {
                output.push( children[ i ].getOutput() );
            }
            return output;
        }
    } else {
        switch ( argType ) {
            case "action":
                element = actionSelector();
                break;
            case "condition":
                element = conditionSelector();
                break;
            case "node":
                element = nodeSelector();
                break;
            case "pickup":
                element = nodeSelector( [ "source/pickup.vwf" ] );
                break;
            case "rover":
                element = nodeSelector( [ "source/rover.vwf" ] );
                break;
            case "number":
                element = numberField();
                break;
            case "percent":
                element = numberField( 0, 1, 0.01 );
                break;
            case "moveFailedType":
                element = customSelector( [ "collision", "battery" ] );
                break;
            case "blocklyNode":
                element = nodeSelector( [ "http://vwf.example.com/blockly/controller.vwf" ] );
                break;
            case "blockChangeType":
                element = customSelector( [ "add", "remove", "either" ] );
                break;
            case "block":
                element = blockSelector();
                break;
            case "scenario":
                element = scenarioSelector();
                break;
            case "point2D":
                element = vector2Input();
                break;
            case "failureType":
                element = customSelector( [ "battery", "collision", "incomplete", "lost" ] );
                break;
            case "primitive":
                element = primitiveSelector();
                break;
            case "boolean":
                element = customSelector( [ "true", "false" ] );
                break;
            case "pose":
                element = poseInput();
                break;
            case "sound":
            case "soundGroup":
            case "HUDElement":
            case "video":
            case "string":
            default:
                element = document.createElement( "input" );
                element.getOutput = function() {
                    return element.value;
                }
        }
    }
    return element;
}

function conditionSelector() {
    var element = document.createElement( "div" );
    var subgroup = document.createElement( "div" );
    var select = document.createElement( "select" );
    var option, keys;
    keys = Object.keys( conditions );
    option = document.createElement( "option" );
    option.value = "none";
    option.innerHTML = "--- Select Condition ---";
    select.appendChild( option );
    for ( var i = 0; i < keys.length; i++ ) {
        option = document.createElement( "option" );
        option.value = keys[ i ];
        option.innerHTML = conditions[ keys[ i ] ].display;
        select.appendChild( option );
    }
    subgroup.className = "subgroup";
    element.appendChild( select );
    element.appendChild( subgroup );
    var loadCondition = function() {
        var selected = conditions[ select.value ];
        if ( selected ) {
            loadActionOrCondition( selected, subgroup );
        } else {
            subgroup.innerHTML = "";
            subgroup.style.display = "none";
            subgroup.getOutput = undefined;
        }
    }
    select.addEventListener( "change", loadCondition );
    loadCondition();
    element.getOutput = function() {
        var output = {};
        var subOutput = subgroup.getOutput ? subgroup.getOutput() : [];
        output[ select.value ] = subOutput;
        return output;
    }
    return element;
}

function actionSelector( optional ) {
    var element = document.createElement( "div" );
    var subgroup = document.createElement( "div" );
    var select = document.createElement( "select" );
    var option, keys;
    keys = Object.keys( actions );
    option = document.createElement( "option" );
    option.value = "none";
    option.innerHTML = "--- Select Action ---";
    select.appendChild( option );
    for ( var i = 0; i < keys.length; i++ ) {
        option = document.createElement( "option" );
        option.value = keys[ i ];
        option.innerHTML = actions[ keys[ i ] ].display;
        select.appendChild( option );
    }
    subgroup.className = "subgroup";
    element.appendChild( select );
    if ( optional ) {
        var removeBtn = document.createElement( "div" );
        removeBtn.className = "inlineTextButton";
        removeBtn.innerHTML = "Remove";
        element.appendChild( removeBtn );
        removeBtn.addEventListener( "click", function() {
            element.parentElement.removeChild( element );
        } );
    }
    element.appendChild( subgroup );
    var loadAction = function() {
        var selected = actions[ select.value ];
        if ( selected ) {
            loadActionOrCondition( selected, subgroup );
        } else {
            subgroup.innerHTML = "";
            subgroup.style.display = "none";
            subgroup.getOutput = undefined;
        }
    }
    select.addEventListener( "change", loadAction );
    loadAction();
    element.getOutput = function() {
        var output = {};
        var subOutput = subgroup.getOutput ? subgroup.getOutput() : [];
        output[ select.value ] = subOutput;
        return output;
    }
    return element;
}

function nodeSelector( types ) {
    var nodeList = new Array();
    var element = document.createElement( "select" );
    var option, nodeName;
    if ( types && types.length ) {
        for ( var i = 0; i < types.length; i++ ) {
            nodeList = nodeList.concat( vwf_view.kernel.find( "", "//element(*,'" + types[ i ] + "')" ) );
        }
    } else {
        nodeList = vwf_view.kernel.find( "", "//element(*,'editor/editable.vwf')" );
    }
    for ( var i = 0; i < nodeList.length; i++ ) {
        nodeName = vwf_view.kernel.name( nodeList[ i ] );
        option = document.createElement( "option" );
        option.value = nodeName;
        option.innerHTML = nodeName;
        element.appendChild( option );
    }
    element.getOutput = function() {
        return this.value;
    }
    return element;
}

function customSelector( options ) {
    var element = document.createElement( "select" );
    var option;
    for ( var i = 0; i < options.length; i++ ) {
        option = document.createElement( "option" );
        option.value = options[ i ];
        option.innerHTML = options[ i ];
        element.appendChild( option );
    }
    element.getOutput = function() {
        return this.value;
    }
    return element;
}

function blockSelector() {
    var element = document.createElement( "select" );
    var option, keys;
    keys = Object.keys( blockTypes );
    for ( var i = 0; i < keys.length; i++ ) {
        option = document.createElement( "option" );
        option.innerHTML = keys[ i ];
        option.value = blockTypes[ keys[ i ] ];
        element.appendChild( option );
    }
    element.getOutput = function() {
        return this.value;
    }
    return element;
}

function scenarioSelector() {
    var element = document.createElement( "select" );
    var scenarios = scenarioJson.getJson().scenarios;
    var keys = Object.keys( scenarios );
    var option;
    for ( var i = 0; i < keys.length; i++ ) {
        option = document.createElement( "option" );
        option.value = keys[ i ];
        option.innerHTML = keys[ i ];
        element.appendChild( option );
    }
    element.getOutput = function() {
        return this.value;
    }
    return element;
}

function vector2Input() {
    var element = document.createElement( "div" );
    var x = numberField( undefined, undefined, 1 );
    var y = numberField( undefined, undefined, 1 );
    var labelx = document.createElement( "div" );
    var labely = document.createElement( "div" );
    x.className = y.className = "vectorElement";
    labelx.innerHTML = "x:";
    labely.innerHTML = "y:";
    labelx.className = labely.className = "inline label";
    element.appendChild( labelx );
    labelx.appendChild( x );
    element.appendChild( labely );
    labely.appendChild( y );
    element.getOutput = function() {
        return [ x.getOutput(), y.getOutput() ];
    }
    return element;
}

function numberField( min, max, step ) {
    var element = document.createElement( "input" );
    element.type = "number";
    if ( min !== undefined ) {
        element.min = min;
    }
    if ( max !== undefined ) {
        element.max = max;
    }
    if ( step !== undefined ) {
        element.step = step;
    }
    element.getOutput = function() {
        // TODO: Validate
        return parseFloat( this.value );
    }
    return element;
}

function primitiveSelector() {
    var element = document.createElement( "div" );
    var selector = customSelector( [ "boolean", "number", "string" ] );
    var container = document.createElement( "div" );
    var field;
    var loadField = function() {
        container.innerHTML = "";
        switch ( selector.getOutput() ) {
            case "boolean":
                field = customSelector( [ "true", "false" ] );
                break;
            case "number":
                field = numberField();
                break;
            case "string":
                field = document.createElement( "input" );
                field.getOutput = function() {
                    return field.value;
                }
        }
        field.className = "inline";
        container.appendChild( field );
    }
    selector.addEventListener( "change", loadField );
    loadField();
    selector.className = container.className = "inline";
    element.appendChild( selector );
    element.appendChild( container );
    element.getOutput = function() {
        return field.getOutput();
    }
    return element;
}

function poseInput() {
    var element = document.createElement( "div" );
    var radius, yaw, pitch, radiusLabel, yawLabel, pitchLabel;
    radius = numberField( 0, 15, 0.1 );
    yaw = numberField( 0, 360, 1 );
    pitch = numberField( 0, 90, 1 );
    radius.className = yaw.className = pitch.className = "vectorElement";
    radiusLabel = document.createElement( "div" );
    yawLabel = document.createElement( "div" );
    pitchLabel = document.createElement( "div" );
    radiusLabel.innerHTML = "Distance:";
    yawLabel.innerHTML = "Yaw (x):";
    pitchLabel.innerHTML = "Pitch (y):";
    radiusLabel.className = yawLabel.className = pitchLabel.className = "label";
    radiusLabel.appendChild( radius );
    yawLabel.appendChild( yaw );
    pitchLabel.appendChild( pitch );
    element.appendChild( radiusLabel );
    element.appendChild( yawLabel );
    element.appendChild( pitchLabel );
    element.getOutput = function() {
        return [
            radius.getOutput(),
            yaw.getOutput(),
            pitch.getOutput()
        ];
    }
    return element;
}

//@ sourceURL=editor/editor.js