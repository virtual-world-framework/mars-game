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
    if ( this.uri ) {
        return;
    }
    this.calcRam();
}

this.moveForward = function() {
    var tileMap = this.scene.tileMap;
    var headingRadians = ( this.heading + 90 ) * Math.PI / 180; // TODO: Fix heading
    var currentTile = tileMap.getTileCoordFromWorld( this.worldTransform[ 12 ], this.worldTransform[ 13 ] );
    var proposedTile = {
        "x": currentTile.x + Math.round( Math.cos( headingRadians ) ),
        "y": currentTile.y + Math.round( Math.sin( headingRadians ) )
    };
    var tileValue = tileMap.getDataAtTileCoord( proposedTile.x, proposedTile.y );

    // tileValue will be null if the tile does not exist on the tile map.
    // We will count this as a collision for now.
    if ( tileValue !== null ) {
        var tilePassable = Boolean( tileValue.r );
        if ( tilePassable ) {
            if ( this.battery >= 1 ) { // Subject to change if movement cost changes
                var obstructionOnTile = this.scene.checkWatchList( proposedTile, "obstruction" );
                if ( !obstructionOnTile ) {
                    var distance = [
                        ( proposedTile.x - currentTile.x ) * tileMap.tileSize,
                        ( proposedTile.y - currentTile.y ) * tileMap.tileSize,
                        0
                    ];
                    this.translateOnTerrain( distance, 1, 1 );
                    var pickupsOnTile = this.scene.getWatchListNodes( proposedTile, "pickup" );
                    for ( var i = 0; i < pickupsOnTile.length; i++ ) {
                        pickupsOnTile[ i ].pickUp( this );
                    }
                    this.moved();
                    // this.activateSensor( 'metal' );
                    // this.activateSensor( 'signal' );
                    // this.activateSensor( 'collision' );
                    // this.activateSensor( 'position' );
                } else { // obstructionOnTile is true
                    // TODO: Move forward to show the collision.
                    //   - Play alarm sound to alert the player?
                    //   - Play cartoonesque animation of wheels falling off and then body drops to ground?
                    //   - Rattle the object that the rover collids with?
                    this.moveFailed( "collision" );
                }
            } else { // this.battery is less than 1
                // TODO: Play battery depleted movement?
                //   - Move half way to next tile.
                //   - Rover slumps down.
                //   - Play powering down sound effect.
                this.battery = 0;
                this.moveFailed( "battery" );
            }
        } else { // tilePassable is false
            // TODO: Move forward to show the collision.
            //   - Play alarm sound to alert the player?
            this.moveFailed( "collision" );
        }
    } else { // tileValue is null
        //  TODO: Find another failure type?
        this.moveFailed( "collision" );
    }
}

// this.moveForward = function() {

//     var scene = this.sceneNode;
//     var headingInRadians = this.heading * Math.PI / 180;
//     var dirVector = [ Math.round( -Math.sin( headingInRadians ) ), Math.round( Math.cos( headingInRadians ) ) ];
//     var proposedNewGridSquare = [ this.currentGridSquare[ 0 ] + dirVector[ 0 ], 
//                                                                 this.currentGridSquare[ 1 ] + dirVector[ 1 ] ];

//     //First check if the coordinate is valid
//     if ( this.currentGrid.validCoord( proposedNewGridSquare ) ) {

//         var energyRequired = this.getMinEnergyRequired( proposedNewGridSquare );

//         //Then check if the boundary value allows for movement:
//         if( this.meetsBoundaryConditions( energyRequired ) ) {
//             //Check if the space is occupied
//             var collided = this.checkCollisionWrapper( proposedNewGridSquare );
//             if ( !collided ){
//                 this.currentGrid.moveObjectOnGrid( this.id, this.currentGridSquare, proposedNewGridSquare );
//                 this.currentGridSquare = proposedNewGridSquare;
//                 var displacement = [ dirVector[ 0 ] * this.currentGrid.gridSquareLength, 
//                                      dirVector[ 1 ] * this.currentGrid.gridSquareLength, 0 ];
//                 // TODO: This should use worldTransformBy, but we are getting a bug where the rover's transform isn't set
//                 //       yet when this method is called.  Until we can debug that, we are assuming that the rover's 
//                 //       parent's frame of reference is the world frame of reference
//                 this.translateOnTerrain( displacement, 1, energyRequired );
//                 // this.worldTransformBy( [
//                 //   1, 0, 0, 0,
//                 //   0, 1, 0, 0,
//                 //   0, 0, 1, 0,
//                 //   dirVector[ 0 ] * this.gridSquareLength, dirVector[ 1 ] * this.gridSquareLength, 0, 0 ], 1 );

//                 var inventoriableObjects = this.currentGrid.getInventoriables( proposedNewGridSquare );
//                 if ( inventoriableObjects ){
//                     for ( var i = 0; i < inventoriableObjects.length; i++ ) {
//                         this.currentGrid.removeFromGrid( inventoriableObjects[ i ], proposedNewGridSquare );
//                         this.cargo.add( inventoriableObjects[ i ] );
//                     }
//                 }
//                 this.moved();
//                 this.activateSensor( 'metal' );
//                 this.activateSensor( 'signal' );
//                 this.activateSensor( 'collision' );
//                 this.activateSensor( 'position' );
//             } else {
//                 this.moveFailed( "collision" );
//             }
//         }
//     } else {
//         this.moveFailed( "collision" );
//     }
// }

this.meetsBoundaryConditions = function( energyRequired ) {
    if ( energyRequired < 0 ) {
        this.moveFailed( "collision" );
        return false;
    } else if ( energyRequired > this.battery ) {
        this.battery = 0;
        this.moveFailed( "battery" );
        return false;
    }
    return true;
}

this.meetsBoundaryConditionsSensor = function( energyRequired ) {
    if ( energyRequired < 0 ) {
        //this.moveFailed( "collision" );
        return false;
    } else if ( energyRequired > this.battery ) {
        this.battery = 0;
        //this.moveFailed( "battery" );
        return false;
    }
    return true;
}

this.getMinEnergyRequired = function( gridCoord ){
    var minEnergyRequired = Infinity; 
    var bArea = this.boundingAreaSize; 

    for( var x = 0; x < bArea[ 0 ]; x++ ) { 
        for( var y = 0; y < bArea[ 1 ]; y++ ) { 
            var currCoord = [ gridCoord[ 0 ] + x , gridCoord[ 1 ] - y ]; 
            var currEnergy = this.currentGrid.getEnergy( currCoord );
            if ( currEnergy < minEnergyRequired ) {
                minEnergyRequired = currEnergy;
            }
        }
    }

    return minEnergyRequired;
}

this.moveRadialAbsolute = function( valueX, valueY ) {

    if ( valueX.constructor === Array ) {
        var temp = valueX.slice(0);
        valueX = temp[0];
        valueY = temp[1];
    }

    var gridCoords = this.currentGrid.getGridFromGamePos( [ valueX, valueY ] );

    var scene = this.sceneNode;

    var xOffset = gridCoords[ 0 ] - this.currentGridSquare[ 0 ];
    var yOffset = gridCoords[ 1 ] - this.currentGridSquare[ 1 ];

    var radians = Math.atan2( yOffset, xOffset ); // In radians 
    var heading = radians * ( 180 / Math.PI );

    if ( heading < 90 && heading > 0 ) {  // 'north' is rotated 90 degrees
        this.setHeading( 360 + ( heading - 90 ) );
    } else {
        this.setHeading( heading - 90, 0 );
    }

    var dirVector = [ Math.round( -Math.sin( radians ) ), Math.round( Math.cos( radians ) ) ];

    var proposedNewGridSquare = [ this.currentGridSquare[ 0 ] + xOffset, 
                                                                this.currentGridSquare[ 1 ] + yOffset ]; 

    //Calculate the time to displace based on the hypotenuse
    var hypot = Math.sqrt( ( xOffset * xOffset ) + ( yOffset * yOffset ) );

    var displacement = [  xOffset * this.currentGrid.gridSquareLength,  yOffset * this.currentGrid.gridSquareLength, 0 ];

    //First check if the coordinate is valid
    if ( this.currentGrid.validCoord( proposedNewGridSquare ) ) {

        var energyRequired = this.currentGrid.getEnergy( proposedNewGridSquare );

        //Otherwise, check if the space is occupied
        if ( !this.checkRadialCollision( this.currentGridSquare, proposedNewGridSquare ) ){
            this.currentGrid.moveObjectOnGrid( this.id, this.currentGridSquare, proposedNewGridSquare );
            this.currentGridSquare = proposedNewGridSquare;
            
            // TODO: This should use worldTransformBy, but we are getting a bug where the rover's transform isn't set
            //       yet when this method is called.  Until we can debug that, we are assuming that the rover's 
            //       parent's frame of reference is the world frame of reference


            this.translateOnTerrain( displacement, hypot, energyRequired );
            // this.worldTransformBy( [
            //   1, 0, 0, 0,
            //   0, 1, 0, 0,
            //   0, 0, 1, 0,
            //   dirVector[ 0 ] * this.gridSquareLength, dirVector[ 1 ] * this.gridSquareLength, 0, 0 ], 1 );

            var inventoriableObjects = this.currentGrid.getInventoriables( proposedNewGridSquare );
            if ( inventoriableObjects ){
                for ( var i = 0; i < inventoriableObjects.length; i++ ) {
                    this.currentGrid.removeFromGrid( inventoriableObjects[ i ], proposedNewGridSquare );
                    this.cargo.add( inventoriableObjects[ i ] );
                }
            }
            this.moved();
            this.activateSensor( 'position' );
            this.activateSensor( 'heading', this.heading );
            //this.activateSensor( 'metal' );
        } else {
            this.moveFailed( "collision" );
        }
    } else {
        this.moveFailed( "collision" );
    }
}

this.moveRadial = function( xValue, yValue, offset ) {

    var scene = this.sceneNode;

    if ( offset === true ) {
        var radians = Math.atan2(yValue, xValue); // In radians 
        var heading = radians * ( 180 / Math.PI );

        if ( heading < 90 && heading > 0 ) {  // 'north' is rotated 90 degrees
            this.setHeading( 360 + ( heading - 90 ) );
        } else {
            this.setHeading( heading - 90, 0 );
        }

        var dirVector = [ Math.round( -Math.sin( radians ) ), Math.round( Math.cos( radians ) ) ];

        var proposedNewGridSquare = [ this.currentGridSquare[ 0 ] + xValue, 
                                                                    this.currentGridSquare[ 1 ] + yValue ]; 

        //Calculate the time to displace based on the hypotenuse
        var hypot = Math.sqrt(xValue*xValue + yValue*yValue);

        var displacement = [  xValue * this.currentGrid.gridSquareLength,  yValue * this.currentGrid.gridSquareLength, 0 ];

    } else {

        var xOffset = xValue - this.currentGridSquare[ 0 ];
        var yOffset = yValue - this.currentGridSquare[ 1 ];

        var radians = Math.atan2( yOffset, xOffset ); // In radians 
        var heading = radians * ( 180 / Math.PI );

        if ( heading < 90 && heading > 0 ) {  // 'north' is rotated 90 degrees
            this.setHeading( 360 + ( heading - 90 ) );
        } else {
            this.setHeading( heading - 90, 0 );
        }

        var dirVector = [ Math.round( -Math.sin( radians ) ), Math.round( Math.cos( radians ) ) ];

        var proposedNewGridSquare = [ this.currentGridSquare[ 0 ] + xOffset, 
                                                                    this.currentGridSquare[ 1 ] + yOffset ]; 

        //Calculate the time to displace based on the hypotenuse
        var hypot = Math.sqrt( ( xOffset * xOffset ) + ( yOffset * yOffset ) );

        var displacement = [  xOffset * this.currentGrid.gridSquareLength,  yOffset * this.currentGrid.gridSquareLength, 0 ];

    }
    

    //First check if the coordinate is valid
    if ( this.currentGrid.validCoord( proposedNewGridSquare ) ) {

        //Then check if the boundary value allows for movement:
        var energyRequired = this.currentGrid.getEnergy( proposedNewGridSquare );
        if ( energyRequired < 0 ) {
            this.moveFailed( "collision" );
        } else if ( energyRequired > this.battery ) {
            this.battery = 0;
            this.moveFailed( "battery" );
        } else {

            //Otherwise, check if the space is occupied
            if ( !this.checkRadialCollision( this.currentGridSquare, proposedNewGridSquare ) ){
                this.currentGrid.moveObjectOnGrid( this.id, this.currentGridSquare, proposedNewGridSquare );
                this.currentGridSquare = proposedNewGridSquare;
                
                // TODO: This should use worldTransformBy, but we are getting a bug where the rover's transform isn't set
                //       yet when this method is called.  Until we can debug that, we are assuming that the rover's 
                //       parent's frame of reference is the world frame of reference


                this.translateOnTerrain( displacement, hypot, energyRequired );
                // this.worldTransformBy( [
                //   1, 0, 0, 0,
                //   0, 1, 0, 0,
                //   0, 0, 1, 0,
                //   dirVector[ 0 ] * this.gridSquareLength, dirVector[ 1 ] * this.gridSquareLength, 0, 0 ], 1 );

                var inventoriableObjects = this.currentGrid.getInventoriables( proposedNewGridSquare );
                if ( inventoriableObjects ){
                    for ( var i = 0; i < inventoriableObjects.length; i++ ) {
                        this.currentGrid.removeFromGrid( inventoriableObjects[ i ], proposedNewGridSquare );
                        this.cargo.add( inventoriableObjects[ i ] );
                    }
                }
                this.moved();
                this.activateSensor( 'position' );
                this.activateSensor( 'heading', this.heading );
                //this.activateSensor( 'metal' );
            } else {
                this.moveFailed( "collision" );
            }
        }
    } else {
        this.moveFailed( "collision" );
    }
}


this.turnLeft = function() {
    this.setHeading( this.heading + 90, 1 );
    this.activateSensor( 'signal' );
    this.activateSensor( 'collision' );
    this.activateSensor( 'metal' );
}

this.turnRight = function() {
    this.setHeading( this.heading - 90, 1 );
    this.activateSensor( 'signal' );
    this.activateSensor( 'collision' );
    this.activateSensor( 'metal' );
}

this.checkRadialCollision = function( currentPosition, futurePosition ) {

    var currentTranslation = this.currentGrid.getWorldFromGrid( currentPosition[ 0 ], currentPosition[ 1 ] );
    var currentHeight = this.getTerrainHeight( currentPosition[ 0 ], currentPosition[ 1 ] );

    var futureTranslation = this.currentGrid.getWorldFromGrid( futurePosition[ 0 ], futurePosition[ 1 ] );
    var futureHeight = this.getTerrainHeight( futurePosition[ 0 ], futurePosition[ 1 ] );

    currentTranslation[2] = currentHeight + 1.0;
    futureTranslation[2] = futureHeight + 1.0;

    var dist = goog.vec.Vec3.distance( currentTranslation, futureTranslation );
    var sizeOfRover = this.currentGrid.gridSquareLength * 0.5;
    var scene = this.sceneNode;

    var player = this.find( "//player" )[ 0 ];
    var environment = this.find( "//environment" )[ 0 ];
    var pickups = this.find( "//pickups" )[ 0 ];
//    var backdrop = this.find( "//backdrop" )[ 0 ];

    var directionVector = [ 
        futureTranslation[ 0 ] - currentTranslation[ 0 ],
        futureTranslation[ 1 ] - currentTranslation[ 1 ],
        futureTranslation[ 2 ] - currentTranslation[ 2 ]
    ];

    var vectorLength = Math.sqrt( ( directionVector[0]*directionVector[0] ) + ( directionVector[1]*directionVector[1] ) + ( directionVector[2]*directionVector[2] ) );

    var normalizedVector = [ 
        directionVector[ 0 ] / vectorLength,
        directionVector[ 1 ] / vectorLength,
        directionVector[ 2 ] / vectorLength
    ];

    var raycastResult = scene.raycast( currentTranslation, normalizedVector, 1.0, dist, true, [ player.id, environment.id /*, backdrop.id */] );

    if ( raycastResult !== undefined ) {
        if ( raycastResult.length > 0 ) {
            return true;
        } else {
            return false;
        }
    }

}

this.placeOnTerrain = function( pos ) {
    // Step 1: Get height of the terrain under the four wheels
    var deltaPos = [ 
        pos[ 0 ] - this.transform[ 12 ], 
        pos[ 1 ] - this.transform[ 13 ], 
        pos[ 2 ] - this.transform[ 14 ] 
    ];
    var terrainPosCentroid = this.getTerrainPosUnderNode( this, deltaPos );

    pos[ 2 ] = terrainPosCentroid[ 2 ];

    this.transformTo( [
        this.transform[ 0 ],  this.transform[ 1 ],  this.transform[ 2 ],  0,
        this.transform[ 4 ],  this.transform[ 5 ],  this.transform[ 6 ],  0,
        this.transform[ 8 ], this.transform[ 9 ], this.transform[ 10 ], 0,
        pos[ 0 ],    pos[ 1 ],    pos[ 2 ],    1
    ] );
    
}

this.translateOnTerrain = function( translation, duration, boundaryValue ) {

    var scene = this.sceneNode;

    var duration = duration * this.executionSpeed;

    if ( this.terrain === undefined ) {

        this.translateBy( translation, duration );

    } else {

        var lastTime = 0;
        var startTranslation = this.translation || goog.vec.Vec3.create();
        var deltaTranslation = this.translationFromValue( translation );
        var stopTranslation = goog.vec.Vec3.add(
            startTranslation,
            deltaTranslation,
            goog.vec.Vec3.create()
        );
        var currentBattery = this.battery;

        if ( duration > 0 ) {

            this.animationDuration = duration;
            this.animationUpdate = function( time, duration ) {

                if ( lastRenderTime === lastTime && time < duration ) {
                    return;
                }

                lastTime = lastRenderTime;

                var newTranslation = goog.vec.Vec3.lerp(
                    startTranslation, stopTranslation,
                    time >= duration ? 1 : time / duration,
                    goog.vec.Vec3.create()
                );

                // Record the current translation so that we can measure the distance traveled in 
                // order to turn the wheels the proper amount
                var lastTranslation = this.translation;

                // Given a new (x, y) location, place the rover's wheels on the terrain there
                this.placeOnTerrain( newTranslation );

                // Find the distance that was traveled
                var dist = goog.vec.Vec3.distance( lastTranslation, this.translation );

                // Turn the wheels the appropriate amount
                // Use the proportion (in degrees): angle / 360 = dist / ( 2 * pi * radius )
                // Solving for angle: angle = ( dist / radius ) * ( 180 / pi )
                // The wheels will rotate around the negative-x axis so that by the right-hand rule,
                // they will roll forward
                var angle = ( dist / this.wheelRadius ) * ( 180 / Math.PI );
                var axisAngle = [ -1, 0, 0, angle ];
                for( var i = 0; i < this.wheels.length; i++ ){
                    var currWheel = this[ this.wheels[ i ] ];
                    currWheel.rotateBy( axisAngle );
                }

                // Deplete the battery by the appropriate amount
                this.battery = currentBattery - ( time / duration ) * boundaryValue;

            }

            this.animationPlay(0, duration);

        } else {

            this.placeOnTerrain( stopTranslation );

        }

    }

}

this.getTerrainPosUnderNode = function( node, offset ) {
    var worldTransform = node.worldTransform;
    var posAfterOffset = [
        worldTransform[ 12 ] + offset[ 0 ],
        worldTransform[ 13 ] + offset[ 1 ],
        worldTransform[ 14 ] + offset[ 2 ]
    ];
    posAfterOffset[ 2 ] = this.getTerrainHeight(
        posAfterOffset[ 0 ],
        posAfterOffset[ 1 ], 
        posAfterOffset[ 2 ]
    );
    return posAfterOffset;
}

this.getTerrainHeight = function( x, y ) {

    var height;
    var scene = this.find("/")[0];
    height = scene.environment.heightmap.getHeight( x, y );
    return height;
}

this.calcUpwardNormalizedPlaneNormal = function( vec1, vec2 ) {
    // Cross the two vectors to get a perpendicular vector
    var normal = goog.vec.Vec3.cross( vec1, vec2, goog.vec.Vec3.create() );

    // Normalize the vector to have a length of 1
    goog.vec.Vec3.normalize( normal, normal );

    // If the vector is pointing downward, point it in the other direction
    if ( normal[ 3 ] < 0 ) {
        normal[ 0 ] *= -1;
        normal[ 1 ] *= -1;
        normal[ 2 ] *= -1;
    }

    return normal;
}

this.calcRam = function() {
    this.ramMax = this.blockly_allowedBlocks;
    this.ram = this.ramMax - this.blockly_blockCount;
}

this.blockCountChanged = function( value ) {
    this.calcRam();
    this.activateSensor( 'metal' );
    this.activateSensor( 'signal' );
    this.activateSensor( 'heading', this.heading );
    this.activateSensor( 'collision' );
    this.activateSensor( 'position' );
}

this.allowedBlocksChanged = function( value ) {
    this.calcRam();
}

this.ramChanged = function( value ) {
    var scene = this.sceneNode;
    if ( scene !== undefined && scene.alerts ) {
        if ( value <= this.lowRam ) {
            if ( value <= 0 ) {
                scene.addAlert( this.displayName + " is Out of Memory" );
            } else {
                scene.addAlert( this.displayName + " is Low on Memory" );
            }
        }
    }
}

this.batteryChanged = function( value ) {
    var scene = this.sceneNode;
    if ( scene !== undefined && scene.alerts ) {
        if ( value < this.lowBattery ) {
            if ( value <= 0 ) {
                scene.addAlert( this.displayName + " is Out of Power" );
            } else {
                scene.addAlert( this.displayName + " is Low on Power" );
            }
        }
    }
}

this.moveFailed = function( value ) {
    var scene = this.sceneNode;
    if ( scene !== undefined && scene.alerts ) {
        switch( value ) {
            case 'collision':
                scene.addAlert( this.displayName + " is Blocked" );
                break;
        }
    }
}

this.activateSensor = function( sensor, value ) {

    return;

    var scene = this.sceneNode;

    if ( sensor === 'metal' ) {
        // This sensor checks if the rover is on or near an metal, whether that is
        // defined in the blackboard or an object like a rover/item
        var metalPos = this.sceneNode.sceneBlackboard[ "metalPosition" ];
        var currentPos = this.currentGridSquare;

        this.metalSensorValue = false;

        if ( metalPos ) {
            this.metalSensorValue = metalPos && (
                                 ( metalPos[ 0 ] === currentPos [ 0 ] && 
                                 metalPos[ 1 ] === currentPos [ 1 ] ) ||
                                 ( metalPos[ 0 ] === currentPos [ 0 ] + 1 && 
                                 metalPos[ 1 ] === currentPos [ 1 ] ) ||
                                 ( metalPos[ 0 ] === currentPos [ 0 ] - 1 && 
                                 metalPos[ 1 ] === currentPos [ 1 ] ) ||
                                 ( metalPos[ 0 ] === currentPos [ 0 ] && 
                                 metalPos[ 1 ] === currentPos [ 1 ]  + 1 ) ||
                                 ( metalPos[ 0 ] === currentPos [ 0 ] && 
                                 metalPos[ 1 ] === currentPos [ 1 ] - 1 ) ||
                                 ( metalPos[ 0 ] === currentPos [ 0 ] - 1 && 
                                 metalPos[ 1 ] === currentPos [ 1 ] - 1 ) || //LL
                                 ( metalPos[ 0 ] === currentPos [ 0 ] + 1 && 
                                 metalPos[ 1 ] === currentPos [ 1 ] + 1 ) || //UR
                                 ( metalPos[ 0 ] === currentPos [ 0 ] - 1 && 
                                 metalPos[ 1 ] === currentPos [ 1 ] + 1) || //UL
                                 ( metalPos[ 0 ] === currentPos [ 0 ] + 1 && 
                                 metalPos[ 1 ] === currentPos [ 1 ] - 1) //LR
                                                    );
        } 

        var items = this.currentGrid.getSurroundingInventoriables( this.currentGridSquare );
        var rovers = this.currentGrid.getSurroundingNonInventoriables( this.currentGridSquare );

        if ( items ) {
            if ( items.length !== 0 ) {
                this.metalSensorValue = true;
            } else {
                
            }
        }
        
        if ( rovers ) {
           if ( rovers.length !== 0 ) {
                this.metalSensorValue = true;
            }
        }
        
    }

    if ( sensor === 'collision' ) {
        // This sensor just checks if the grid space ahead would cause a collision
        var headingInRadians = this.heading * Math.PI / 180;
        var dirVector = [ Math.round( -Math.sin( headingInRadians ) ), Math.round( Math.cos( headingInRadians ) ) ];

        var arrayToCheck = [];

        var proposedNewGridSquare = [ this.currentGridSquare[ 0 ] + dirVector[ 0 ], 
                                                                this.currentGridSquare[ 1 ] + dirVector[ 1 ] ];
        arrayToCheck.push( proposedNewGridSquare );
        if ( this.name === 'rover3' ) {
            var proposedSecondGridSquare = [ this.currentGridSquare[ 0 ] + dirVector[ 0 ], 
                                                                this.currentGridSquare[ 1 ] + dirVector[ 1 ] ];
            arrayToCheck.push( proposedSecondGridSquare );
        }
        
        //First check if the coordinate is valid
        for ( var i = 0; i< arrayToCheck.length; i++ ) {

            if ( this.currentGrid.validCoord( arrayToCheck[ i ] ) ) {

                var energyRequired = this.getMinEnergyRequired( arrayToCheck[ i ] );

                //Then check if the boundary value allows for movement:
                 if( this.meetsBoundaryConditionsSensor( energyRequired ) ) {
                    //Check if the space is occupied
                    var collided = this.checkCollisionWrapper( arrayToCheck[ i ] );
                    if ( !collided ){
                        this.collisionSensorValue = false;
                    } else {
                        this.collisionSensorValue = true;
                        return;
                    }
                } else {
                    this.collisionSensorValue = true;
                    return;
                }
            } else {
                this.collisionSensorValue = true;
                return;
            }
        }

        return;
        
    }

    if ( sensor === 'position' ) {
        var currentLocation = this.currentGrid.getGamePosFromGrid( this.currentGridSquare );
        this.positionSensorValue = currentLocation;
        this.positionSensorValueX = currentLocation[ 0 ];
        this.positionSensorValueY = currentLocation[ 1 ];
        return;
    }

    if ( sensor === 'signal' ) {
        // This sensor just checks the current position against the 
        //  "signalPosition" on the blackboard (if any).

        if ( this.sceneNode ) {
            var signalPos = this.sceneNode.sceneBlackboard[ "signalPosition" ];

            if ( signalPos !== undefined ) {
                var currentPos = this.currentGridSquare;

                var deltaX = signalPos[ 0 ] - currentPos[ 0 ];
                var deltaY = signalPos[ 1 ] - currentPos[ 1 ];

                if ( deltaX === 0 && deltaY === 0 ) {
                    this.signalSensorValue = -1;
                    scene.roverSignalValue = -1;
                    return;
                }

                var heading = ( 180 / Math.PI ) * Math.atan2( -deltaY, -deltaX ) + 180;
                
                //Math is getting flipped for 0 and 180 for some reason.
                
                this.signalSensorValue = Math.round( heading );
                scene.roverSignalValue = Math.round( heading );
                return; 
            } else {
                this.signalSensorValue = -99;
                scene.roverSignalValue = -99;
                return;
            } 
        } else {
            this.signalSensorValue = -999;
        }
        
        
        
    }

    if ( sensor === 'heading' ) {
        // This sensor records the heading of the rover

        var newHeading = value + 90;

        var trueHeading = ( newHeading % 360 + 360 ) % 360;
        this.headingSensorValue = Math.round( trueHeading );
        scene.roverHeadingValue = Math.round( trueHeading );

    }


}

this.deactivateSensor = function() {
    
}

this.setHeading = function( newHeading, duration ) {

    var scene = this.sceneNode;

    var duration = duration * this.executionSpeed;

    if ( this.heading !== undefined ) {
        // Find the delta in heading and rotateBy that amount via the optional duration
        
        var headingDelta = newHeading - this.heading;
        var axisAngle = [
            this.transform[ 8 ], 
            this.transform[ 9 ],
            this.transform[ 10 ], 
            headingDelta ];

        var startQuaternion = this.quaternion;
        var deltaQuaternion = goog.vec.Quaternion.fromAngleAxis(
            axisAngle[3] * Math.PI / 180,
            goog.vec.Vec3.createFromValues( axisAngle[0], axisAngle[1], axisAngle[2] ),
            goog.vec.Quaternion.create()
        );
        var stopQuaternion = goog.vec.Quaternion.concat(
            deltaQuaternion,
            startQuaternion,
            goog.vec.Quaternion.create()
        );

        var lastTime = 0;

        // This is a version of quaterniateBy that follows the terrain
        if ( duration > 0 ) {
            this.animationDuration = duration;
            this.animationUpdate = function( time, duration ) {
                if ( lastRenderTime === lastTime && time < duration ) {
                    return;
                }
                lastTime = lastRenderTime;
                this.quaternion = goog.vec.Quaternion.slerp(
                    startQuaternion, stopQuaternion,
                    time >= duration ? 1 : time / duration,
                    goog.vec.Quaternion.create()
                );
                this.placeOnTerrain( this.translation );
            }
            this.animationPlay( 0, duration );
        } else {
            this.quaternion = stopQuaternion;
            this.placeOnTerrain( this.translation );
        }
    }

    // Set the heading value, constraining the value to be between 0 and 359
    this.heading = ( newHeading % 360 + 360 ) % 360;
    this.activateSensor( 'heading', this.heading );
    
}

this.resetSensors = function() {
    this.activateSensor( 'metal' );
    this.activateSensor( 'signal' );
    this.activateSensor( 'collision' );
    this.activateSensor( 'position' );
    this.activateSensor( 'heading', this.heading );
}

//@ sourceURL=source/rover.js
