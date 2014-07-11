this.objCount = 0;
this.dragObject = undefined;

this.initialize = function() {
    this.camera.transform = [
        -0.6877578496932983,0.7259325385093689,2.705990027607186e-7,0,
        -0.6843284964561462,-0.6483430862426758,-0.3336801826953888,0,
        -0.24222907423973083,-0.2294914275407791,0.9426885843276978,0,
        100,100.00012969970703,50.0000114440918,1
    ];

    // this.future( 0 ).createGridDisplay( this.grid );
    this.future( 0 ).onSceneReady();
}

this.onSceneReady = function() {
}

this.createGridDisplay = function( grid ) {
    var PASSABLE_COLOR = [ 220, 255, 220 ];
    var IMPASSABLE_COLOR = [ 255, 220, 220 ];
    var OPACITY = 0.5;
    var NORMAL = [ 0, 0, 1 ];
    var ROTATION = 90;
    var RENDERTOP = false;
    var SIZE = 0.9;
    var origin, name, color;
    var tiles = new Array;

    var offset = new Array(); 
    offset.push( grid.gridOriginInSpace[ 0 ] / grid.gridSquareLength );
    offset.push( grid.gridOriginInSpace[ 1 ] / grid.gridSquareLength );

    for ( var x = 0; x < grid.boundaryValues.length; x++ ) {

        for ( var y = 0; y < grid.boundaryValues[ x ].length; y++ ) {

            name = "tile_" + x + "_" + y;

            origin = [
            offset[ 0 ] + ( x ),
            offset[ 1 ] + ( y ),
            0
            ];

            color = grid.boundaryValues[ x ][ y ] === -1 ? IMPASSABLE_COLOR : PASSABLE_COLOR;

            tiles.push( { 
                "plane": {
                "origin": origin,
                "normal": NORMAL,
                "rotationAngle": ROTATION,
                "size": SIZE,
                "color": color,
                "opacity": OPACITY,
                "renderTop": RENDERTOP
            } } );

        }

    }

    this.graph.graphGroup(
        this.graph.tileVisible,
        tiles
    );
}

this.removeGridDisplay = function() {
    var graph = this.graph;

    for ( var obj in graph.children ) {
        graph.children.delete( graph.children[ obj ] );
    }
}

this.loadMap = function( path ) {
    if ( this.map ) {
        this.deleteMap();
    }

    this.future( 0 ).createObject( "map", path );
}

this.deleteMap = function() {
    this.children.delete( this.map );
}

this.loadObject = function( path ) {
    if ( this.dragObject !== undefined ) {
        this.deleteObject( this.dragObject.name );
    }

    var objectName = "object_" + this.objCount++;

    this.future( 0 ).createObject( objectName, path, setDragObject );
}

this.deleteObject = function( objectName ) {
    var object = this.find( objectName )[ 0 ];
    if ( object !== undefined ) {
        if ( object.id === this.dragObject.id ) {
            this.dragObject = undefined;
        }
        this.children.delete( object );
    }
}

this.createObject = function( name, path, callback ) {
    var objDef = {
        "extends": path
    }
    this.children.create( name, objDef, callback );
}

function setDragObject( object ) {
    this.dragObject = object;
}


this.pointerMove = function( pointerInfo, pickInfo ) {
    this.drag( pointerInfo, pickInfo );
}

this.pointerOver = function( pointerInfo, pickInfo ) {
    this.drag( pointerInfo, pickInfo );
}

this.drag = function( pointerInfo, pickInfo ) {
    if ( !this.dragObject ) {
        return;
    }

    this.dragObject.terrainName = this.map.name;

    if ( pickInfo.pickID !== this.dragObject.id ) {
        this.grid.addToGridFromWorld( this.dragObject, pickInfo.globalPosition );
        // this.dragObject.translateTo( pickInfo.globalPosition );
    } else {
        var origin = pickInfo.globalSource;
        var normal = pickInfo.pointerVector;
        if ( origin && normal ) {
            var intersects = this.raycast( origin, normal, 0, Infinity, true, this.map );
            var nearest = findNearestOther( this.dragObject, intersects );
            if ( nearest ) {
                var point = [
                    nearest.point.x,
                    nearest.point.y,
                    nearest.point.z
                ];
                this.grid.addToGridFromWorld( this.dragObject, point );
                // this.dragObject.translateTo( point );
            }
        }
    }
}

function findNearestOther( dragObj, picks ) {
    for ( var i = 0; i < picks.length; i++ ) {
        var pickID = findNodeID( picks[ i ].object );
        if ( pickID !== dragObj.id ) {
            return picks[ i ];
        }
    }

    return undefined;
}

function findNodeID( object ) {
    var id = undefined;

    while ( !id && object ) {
        if ( object.vwfID ) {
            id = object.vwfID;
        } else {
            object = object.parent;
        }
    }

    return id;
}
//@ sourceURL=editor/scene.js