var selectedTool = undefined;

vwf_view.firedEvent = function( nodeID, eventName, eventParams ) {
    if ( nodeID === vwf_view.kernel.application() ) {
        switch ( eventName ) {
            case "onSceneReady":
                handleSceneReady( eventParams );
                break;
        }
    }
}

function handleSceneReady( params ) {
    var assetTypeSelector = document.getElementById( "typeselector" );
    assetTypeSelector.onchange = ( function() {
            loadAssetList( this.value );
    } ).bind( assetTypeSelector );
    loadAssetList( assetTypeSelector.value );
    setupTools();
}

function loadAsset( assetType, path ) {
    switch ( assetType ) {
        case "maps":
            vwf_view.kernel.callMethod( vwf_view.kernel.application(), "loadMap", [ path ] );
            break;
        default:
            vwf_view.kernel.callMethod( vwf_view.kernel.application(), "loadObject", [ path ] );
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
            listItem.onclick = function( listType, path ) { 
                return function() { 
                    loadAsset( listType, path ); 
                } 
            }( listType, list[ i ].path );
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
            list.push( { name: "Rubble Parts", path: "source/obstacles/rubble_parts.vwf" } );
            list.push( { name: "Rubble Tank", path: "source/obstacles/rubble_tank.vwf" } );
            break;
        case "pickups":
            break;
        case "characters":
            break;
        default:
            return undefined;
    }

    return list;
}

function setupTools() {
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
}

function selectTool( tool ) {
    if ( selectedTool ) {
        selectedTool.className = "toolbutton";
    }
    tool.className = "toolbutton selected";
    selectedTool = tool;
}