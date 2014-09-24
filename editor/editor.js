var selectedTool = undefined;
var levelArray = new Array();
var sceneID;
var fileManager = new FileManager( document.body );

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

function handleSceneReady( params ) {
    sceneID = vwf_view.kernel.application();
    var assetTypeSelector = document.getElementById( "typeselector" );
    assetTypeSelector.onchange = ( function() {
            loadAssetList( this.value );
    } ).bind( assetTypeSelector );
    loadAssetList( assetTypeSelector.value );
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

function setupTools() {
    addToolsToGroup( "transformtools", [ "camera", "translate", "rotate", "raise_lower", "delete" ] );

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

function saveLevel() {
    var levelStr = "";
    for( var i = 0; i < levelArray.length; i++ ) {
        levelStr += levelArray[ i ];
        if ( i < levelArray.length - 1 ) {
            levelStr += "\n";
        }
    }
    var file = fileManager.makeFile( levelStr );
    fileManager.saveFile( file, "level.txt" );
}

function loadLevel( file ) {
    var fileArray;
    fileManager.readFile( file, function( content ) {
        fileArray = content.split( "\n" );
        vwf_view.kernel.callMethod(
            vwf_view.kernel.application(),
            "createLevelFromFile",
            [ fileArray ]);
    } );
}

//@ sourceURL=editor/editor.js