var self;

this.initialize = function() {
    // TODO: Find current grid square (rather than making app developer specify)
    // TODO: Find the current heading (rather than making app developer specify)

    self = this;
    this.calcRam();
    this.future( 0 ).findAndSetBoundaryMap();
}

this.findAndSetBoundaryMap = function() {
    var boundaryMapObject = this.find( "//element(*,'source/boundaryMap.vwf')" )[ 0 ];
    if ( boundaryMapObject ) {
        this.boundaryMap = boundaryMapObject.map;
        this.gridSquareLength = boundaryMapObject.gridSquareLength;
    }
}

this.moved = function() {

    var inventory = this.cargo;

    //If the rover moves onto a space containing pickups, add the pickup to the inventory
    if ( inventory ) {
        var inventoriables = this.find( "//element(*,'source/inventoriable.vwf')" );
        for ( var i = 0; i < inventoriables.length; i++ ) {
            if ( ( !inventoriables[ i ].isPickedUp ) && ( this.currentGridSquare[ 0 ] === inventoriables[ i ].currentGridSquare[ 0 ] ) && ( this.currentGridSquare[ 1 ] === inventoriables[ i ].currentGridSquare[ 1 ] ) ) {
                inventory.add( inventoriables[ i ].id );
            }
        }
    }
}

this.moveForward = function() {

    var headingInRadians = this.heading * Math.PI / 180;
    var dirVector = [ Math.round( -Math.sin( headingInRadians ) ), Math.round( Math.cos( headingInRadians ) ) ];
    var proposedNewGridSquare = [ this.currentGridSquare[ 0 ] + dirVector[ 0 ], 
                                                                this.currentGridSquare[ 1 ] + dirVector[ 1 ] ];
    var boundaryXArray = this.boundaryMap[ proposedNewGridSquare[ 0 ] ];
    if ( boundaryXArray ) {
        var boundaryValue = boundaryXArray[ proposedNewGridSquare[ 1 ] ];
        if ( ( boundaryValue < 0 ) || ( boundaryValue === undefined ) ) {
            this.moveFailed( "collision" );
        } else if ( boundaryValue > this.battery ) {
            // if the move fails because of battery, drain the rest of our battery
            this.battery = 0;
            this.moveFailed( "battery" );
        } else {
            this.currentGridSquare = proposedNewGridSquare;
            var displacement = [ dirVector[ 0 ] * this.gridSquareLength, 
                                 dirVector[ 1 ] * this.gridSquareLength, 0 ];
            // TODO: This should use worldTransformBy, but we are getting a bug where the rover's transform isn't set
            //       yet when this method is called.  Until we can debug that, we are assuming that the rover's 
            //       parent's frame of reference is the world frame of reference
            this.translateOnTerrain( displacement, 1, boundaryValue );
            // this.worldTransformBy( [
            //   1, 0, 0, 0,  
            //   0, 1, 0, 0,  
            //   0, 0, 1, 0,  
            //   dirVector[ 0 ] * this.gridSquareLength, dirVector[ 1 ] * this.gridSquareLength, 0, 0 ], 1 );
            this.moved( displacement );
        }
    } else {
        this.moveFailed( "collision" );
    }
}

this.turnLeft = function() {
    this.heading += 90;
    if ( this.heading > 360 ) {
        this.heading -= 360;
    }
    this.rotateBy( [ 0, 0, 1, 90 ], 1 );
}

this.turnRight = function() {
    this.heading -= 90;
    if ( this.heading < 0 ) {
        this.heading += 360;
    }
    this.rotateBy( [ 0, 0, 1, -90 ], 1 );
}

this.translateOnTerrain = function( translation, duration, boundaryValue ) {

    var terrain = this.find( "//" + this.terrainName )[0];

    if ( terrain === undefined ) {

        this.translateBy( translation, duration );

    } else {

        var startTranslation = this.translation || goog.vec.Vec3.create();
        var deltaTranslation = this.translationFromValue( translation );
        var stopTranslation = goog.vec.Vec3.add(
            startTranslation,
            deltaTranslation,
            goog.vec.Vec3.create()
        );
        var currentBattery = this.battery;

        if(duration > 0) {

            this.animationDuration = duration;
            this.animationUpdate = function(time, duration) {

                var newTranslation = goog.vec.Vec3.lerp(
                    startTranslation, stopTranslation,
                    time >= duration ? 1 : time / duration,
                    goog.vec.Vec3.create()
                );

                newTranslation[2] = getTerrainHeight( newTranslation[0], newTranslation[1], newTranslation[2] + 3, terrain );
                this.translation = newTranslation;
                this.battery = currentBattery - ( time / duration ) * boundaryValue;

            }

            this.animationPlay(0, duration);

        } else {

            stopTranslation[2] = getTerrainHeight( stopTranslation[0], stopTranslation[1], stopTranslation[2] + 300, terrain ); 
            this.translation = stopTranslation;

        }

    }

}

this.pointerClick = function( pointerInfo, pickInfo ) {
    var camera = this.find( "//camera" )[ 0 ];
    if ( camera && this.blocklyEnabled ) {
        camera.target = this.name;
    }
}

function getTerrainHeight( x, y, z, terrain ) {

    var height;
    var scene = self.find("/")[0];
    var origin = [ x, y, z ];
    var intersects = scene.raycast( origin, [0,0,-1], 0, Infinity, true, terrain.id );
    height = intersects.length > 0 ? intersects[0].point.z : z;
    return height;

}

this.calcRam = function() {
    this.ramMax = this.blockly_allowedBlocks;
    this.ram = this.ramMax - this.blockly_blockCount;
}

this.blockCountChanged = function( value ) {
    this.calcRam();
}
this.allowedBlocksChanged = function( value ) {
    this.calcRam();
}

//@ sourceURL=source/rover.js