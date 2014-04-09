var composer;
var HDRShader;
var hud;
var frame = 0;

Blockly.inject( document.getElementById( 'blocklyDiv' ), { 
    path: './source/blockly/', 
    toolbox: document.getElementById( 'toolbox' ) 
} );

function onRun() {
    vwf_view.kernel.setProperty( vwf_view.kernel.application(), "executing", true );
}

window.addEventListener( "keyup", function (event) {
	switch ( event.keyCode ) {
		case 80:
			vwf_view.kernel.callMethod( vwf_view.kernel.find( undefined, "/player" ), "togglePerspective" );
	}
} );

function trace() {
    var result;
    var rc = new THREE.Raycaster();
    var pr = new THREE.Projector();
    var dir = new THREE.Vector3();
    var pos = new THREE.Vector3();
    var camera = vwf.views[0].state.cameraInUse;
    var scene = vwf.views[0].state.scenes[vwf.application()].threeScene;
    dir.set(0,0,0.5);
    pr.unprojectVector(dir, camera);
    pos.setFromMatrixPosition( camera.matrixWorld );
    dir.sub(pos);
    dir.normalize();
    rc.set(pos, dir);
    result = rc.intersectObjects(scene.children, true);
    return result || undefined;
} 

vwf_view.firedEvent = function( nodeID, eventName, eventArgs ) {

    if ( eventName === "grabbed" ) {

        var client = eventArgs[0];

        if ( client === vwf_view.kernel.moniker() ) {
            var iconSrc = eventArgs[1];
            var screenPos = eventArgs[2];
            var parentName = eventArgs[3];
            var name = nodeID.split("-")[ nodeID.split("-").length - 1 ];

            var inventoryItem = new HUD.Element( name, drawIcon, 64, 64 );
            inventoryItem.icon = new Image();
            inventoryItem.icon.src = iconSrc;
            inventoryItem.owner = parentName;
            inventoryItem.isDragging = true;
            inventoryItem.startPos = screenPos;
            inventoryItem.onMouseUp = drop;
            inventoryItem.onMouseOut = drag;
            inventoryItem.onMouseMove = drag;
            hud.add( inventoryItem, "top", "left", { "x": screenPos.x - 32, "y": screenPos.y - 32 } );

        }

    }

}

vwf_view.initializedNode = function( nodeID, childID, childExtendsID, childImplementsIDs, childSource, childType, childIndex, childName ) {

    if ( nodeID === vwf_view.kernel.application() ) {

        vwf_view.kernel.kernel.views["vwf/view/threejs"].render = setUp;

    }

}

function setUp( renderer, scene, camera ) {

  // Modify and add to scene
  scene.fog = new THREE.FogExp2( 0xAA9377, 0.000015 );
  renderer.setClearColor(scene.fog.color);

  // Set up HUD
  renderer.autoClear = false;
  hud = new HUD();
  createHUD();

  // Set up post-processing
  composer = new THREE.EffectComposer( renderer );
  composer.addPass( new THREE.RenderPass( scene, camera ) );

  // Initialize the environment shader
  var EnvironmentShader = new THREE.ShaderPass( MGShaders.Environment );

  // Initialize the HDR lighting shader
  HDRShader = new THREE.ShaderPass( MGShaders.HDR );
  HDRShader.uniforms[ 'exposure' ].value = 0.000015;

  // Final pass that renders the processed image to the screen
  var FinalPass = new THREE.ShaderPass( THREE.CopyShader );
  FinalPass.renderToScreen = true;

  // Add passes to the effect composer
  composer.addPass( EnvironmentShader );
  composer.addPass( HDRShader );
  composer.addPass( FinalPass );

  // Set render loop to use custom render function
  vwf_view.kernel.kernel.views["vwf/view/threejs"].render = render;

}

function render( renderer, scene, camera ) {
  
  hud.elements.batteryMeter.battery = (Math.sin(frame * Math.PI / 180) + 1) / 2 * 100;
  hud.update();

  renderer.clear();
  composer.render();
  renderer.clearDepth();
  renderer.render( hud.scene, hud.camera );
  frame = ++frame % 360;

}

function createHUD() {

  var batteryMeter = new HUD.Element( "batteryMeter", drawBatterMeter, 250, 40);
  batteryMeter.battery = 100;
  batteryMeter.maxBattery = 100;
  hud.add( batteryMeter, "left", "bottom", { "x": 30, "y": -30 } );

  createInventoryHUD( 4 );

}

function drawBatterMeter( context, position ) {

  var battery = this.battery;
  var maxBattery = this.maxBattery;
  var meterWidth = (this.width - 10) * battery / maxBattery;
  var meterHeight = (this.height - 10);

  context.strokeStyle = "rgb(255,255,255)";
  context.lineWidth = 3;
  context.strokeRect( position.x, position.y, this.width, this.height );
  context.fillStyle = "rgb(50,110,220)";
  context.fillRect( position.x + 5, position.y + 5, meterWidth, meterHeight );

  context.textBaseline = "bottom";
  context.font = '16px Arial';
  context.fillStyle = "rgb(255,255,255)";
  context.fillText("Battery:", position.x, position.y - 4);

  context.textBaseline = "top";
  context.font = 'bold 28px Arial';
  context.fillStyle = "rgb(255,255,255)";
  context.fillText(Math.round(battery), position.x + 25, position.y + 4);

}

function drawIcon( context, position ) {

    context.drawImage( this.icon, position.x, position.y );

}

function startDrag( event ) {

  if ( event.which === 1 ) {

    this.isDragging = true;
    this.startPos.x = event.clientX;
    this.startPos.y = event.clientY;
    hud.moveToTop( this.id );

  }

}

function drag( event ) {

  if ( this.isDragging && event.which === 1 ) {

    var movX = event.clientX - this.startPos.x;
    var movY = event.clientY - this.startPos.y;

    this.offset.x += movX;
    this.offset.y += movY;

    this.startPos.x = event.clientX;
    this.startPos.y = event.clientY;

    // Prevent element from losing mouse position
    this.isMouseOver = true;
    this.position.x += movX;
    this.position.y += movY;

    var picks = hud.pick( event );
    picks.splice( picks.indexOf( this ), 1 );

    for ( var i = 0; i < picks.length; i++ ) {
        picks[i].onMouseMove( event );
    }

  } else {

    this.isDragging = false;
    hud.remove( this );

  }

}

function drop( event ) {

    this.isDragging = false;
    hud.remove( this );

    var picks = hud.pick( event );
    var inventory = null;
    for ( var i = 0; i < picks.length; i++ ) {
        if ( picks[i].hasOwnProperty("type") && picks[i].type === "inventory" ) {
            inventory = picks[i];
        }
    }

    if ( inventory !== null ) {
        var slot = getInventorySlot( event, inventory );
        if ( slot !== null ) {
            addItemToInventory( this, inventory, slot );
        }
    } else {
        removeItemFromInventory( this );
    }
}

function createInventoryHUD( capacity ) {

    var cols = Math.round( Math.sqrt( capacity ) );
    var rows = cols * cols < capacity ? cols + 1 : cols;
    var width = 48 * cols + cols;
    var height = 48 * rows + rows;

    var grid = new Array();
    for ( var i = 0, slot = 0; i < rows; i++ ) {
        grid[i] = new Array();
        for ( var n = 0; n < cols && slot < capacity; n++, slot++ ) {
            grid[i][n] = { "item": null, "slot": slot, "isMouseOver": false };
        }
    }

    var inventory = new HUD.Element( "cargo", drawInventory, width, height );
    inventory.grid = grid;
    inventory.capacity = capacity;
    inventory.type = "inventory";
    inventory.onMouseMove = selectGrid;
    inventory.onMouseOut = deselectGrid;
    inventory.onMouseDown = selectItem;
    hud.add( inventory, "right", "bottom", { "x": -30, "y": -30 } );

}

function drawInventory( context, position ) {

    var cap = this.capacity;
    context.fillStyle = "rgb(80,40,40)";
    context.fillRect( position.x - 1, position.y - 1, this.width + 1, this.height + 1);

    for ( var r = 0; r < this.grid.length; r++ ) {
        for ( var c = 0; c < this.grid[r].length; c++ ) {
            if ( this.grid[r][c].item !== null ) {
                context.fillStyle = "rgb(80,80,160)";
            } else if ( this.grid[r][c].isMouseOver ) {
                context.fillStyle = "rgb(180,180,225)";
            } else {
                context.fillStyle = "rgb(225,225,225)";
            }
            context.fillRect( position.x + (c*48) + c, position.y + (r*48) + r, 48, 48 );
        }
    }
}

function selectGrid( event ) {
    var posX = event.clientX - this.position.x;
    var posY = event.clientY - this.position.y;

    var r = Math.round( posY / 49 - 0.5 );
    var c = Math.round( posX / 49 - 0.5 );

    for ( var rr = 0; rr < this.grid.length; rr++ ) {
        for ( var cc = 0; cc < this.grid[rr].length; cc++ ) {
            this.grid[rr][cc].isMouseOver = false;
        }
    }

    if ( this.grid[r][c] !== undefined ) {
        this.grid[r][c].isMouseOver = true;
    }
}

function deselectGrid( event ) {
    for ( var rr = 0; rr < this.grid.length; rr++ ) {
        for ( var cc = 0; cc < this.grid[rr].length; cc++ ) {
            this.grid[rr][cc].isMouseOver = false;
        }
    }
}

function selectItem( event ) {
    var posX = event.clientX - this.position.x;
    var posY = event.clientY - this.position.y;

    var r = Math.round( posY / 49 - 0.5 );
    var c = Math.round( posX / 49 - 0.5 );

    if ( this.grid[r][c] !== undefined && this.grid[r][c].item !== null ) {
        var vwfID = vwf_view.kernel.find("", "//" + this.grid[r][c].item.id)[0];
        vwf_view.kernel.callMethod( vwfID, "grab", [{ "x": event.clientX, "y": event.clientY }] );
        this.grid[r][c].item = null;
    }
}

function getInventorySlot( event, inventory ) {
    var slot = null;
    var posX = event.clientX - inventory.position.x;
    var posY = event.clientY - inventory.position.y;

    var r = Math.round( posY / 49 - 0.5 );
    var c = Math.round( posX / 49 - 0.5 );
    if ( inventory.grid[r][c] !== undefined ) {
        slot = inventory.grid[r][c];
    }
    return slot;
}

function addItemToInventory( item, inventory, slot ) {
    var vwfObject = item.id;
    var vwfInventory = vwf_view.kernel.find( "", "//" + inventory.id )[0];

    if ( vwfObject && vwfInventory ) {
        vwf_view.kernel.callMethod( vwfInventory, "add", [ vwfObject, slot.slot ] );
        slot.item = item;
    }
}

function removeItemFromInventory( item ) {
    if ( hud.elements.hasOwnProperty( item.owner ) ) {
        var vwfInventory = vwf_view.kernel.find( "", "//" + item.owner )[0];
        vwf_view.kernel.callMethod( vwfInventory, "remove", [ item.id ] );
    }
}

//@ sourceURL=source/index.js
