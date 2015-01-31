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
    // HACK: Prevent component from initializing
    if ( this.id === "source/rover.vwf" ) {
        return;
    }

    //TODO: Set this properly (we shouldn't have to set this explicity in here...
    // this.transform gets set automatically for ONE of the rovers, but not the other one)
    this.transform = [
        1,  0,  0,  0,
        0,  1,  0,  0,
        0,  0,  1,  0,
        0,  0,  0,  1
    ];
    
    // TODO: Find current grid square (rather than making app developer specify)
    // TODO: Find the current heading (rather than making app developer specify)

    this.calcRam();
}

this.findAndSetCurrentGrid = function( scenarioName ) {
    var scenario = this.find( "//" + scenarioName )[ 0 ];
    this.currentGrid = scenario.grid;
}

this.moveForward = function() {

    var scene = this.sceneNode;
    var headingInRadians = this.heading * Math.PI / 180;
    var dirVector = [ Math.round( -Math.sin( headingInRadians ) ), Math.round( Math.cos( headingInRadians ) ) ];
    var proposedNewGridSquare = [ this.currentGridSquare[ 0 ] + dirVector[ 0 ], 
                                                                this.currentGridSquare[ 1 ] + dirVector[ 1 ] ];

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
            if ( this.currentGrid.getCollidables( proposedNewGridSquare ).length === 0 ){
                this.currentGrid.moveObjectOnGrid( this, this.currentGridSquare, proposedNewGridSquare );
                this.currentGridSquare = proposedNewGridSquare;
                var displacement = [ dirVector[ 0 ] * this.currentGrid.gridSquareLength, 
                                     dirVector[ 1 ] * this.currentGrid.gridSquareLength, 0 ];
                // TODO: This should use worldTransformBy, but we are getting a bug where the rover's transform isn't set
                //       yet when this method is called.  Until we can debug that, we are assuming that the rover's 
                //       parent's frame of reference is the world frame of reference
                this.translateOnTerrain( displacement, 1, energyRequired );
                // this.worldTransformBy( [
                //   1, 0, 0, 0,
                //   0, 1, 0, 0,
                //   0, 0, 1, 0,
                //   dirVector[ 0 ] * this.gridSquareLength, dirVector[ 1 ] * this.gridSquareLength, 0, 0 ], 1 );

                var inventoriableObjects = this.currentGrid.getInventoriables( proposedNewGridSquare );
                if ( inventoriableObjects ){
                    for ( var i = 0; i < inventoriableObjects.length; i++ ) {
                        this.currentGrid.removeFromGrid( inventoriableObjects[ i ], proposedNewGridSquare );
                        this.cargo.add( inventoriableObjects[ i ].id );
                    }
                }
                this.moved();
                this.activateSensor( 'forward' );
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
    this.activateSensor( 'forward' );
}

this.turnRight = function() {
    this.setHeading( this.heading - 90, 1 );
    this.activateSensor( 'forward' );
}

this.placeOnTerrain = function( pos ) {
    // Step 1: Get height of the terrain under the four wheels
    var deltaPos = [ 
        pos[ 0 ] - this.transform[ 12 ], 
        pos[ 1 ] - this.transform[ 13 ], 
        pos[ 2 ] - this.transform[ 14 ] 
    ];
    var terrainPosFL = this.getTerrainPosUnderNode( this.wheelFL, deltaPos );
    var terrainPosBL = this.getTerrainPosUnderNode( this.wheelBL, deltaPos );
    var terrainPosFR = this.getTerrainPosUnderNode( this.wheelFR, deltaPos );
    var terrainPosBR = this.getTerrainPosUnderNode( this.wheelBR, deltaPos );

    // Step 2: Find the normal of the plane on which the rover will sit
    var vecFLtoFR = goog.vec.Vec3.subtract( terrainPosFR, terrainPosFL, goog.vec.Vec3.create() );
    var vecFLtoBL = goog.vec.Vec3.subtract( terrainPosBL, terrainPosFL, goog.vec.Vec3.create() );
    var vecBRtoFR = goog.vec.Vec3.subtract( terrainPosFR, terrainPosBR, goog.vec.Vec3.create() );
    var vecBRtoBL = goog.vec.Vec3.subtract( terrainPosBL, terrainPosBR, goog.vec.Vec3.create() );
    var normal = this.calcUpwardNormalizedPlaneNormal( vecFLtoBL, vecFLtoFR );
    var normalEstimate2 = this.calcUpwardNormalizedPlaneNormal( vecBRtoFR, vecBRtoBL );
    normal[ 0 ] = ( normal[ 0 ] + normalEstimate2[ 0 ] ) * 0.5;
    normal[ 1 ] = ( normal[ 1 ] + normalEstimate2[ 1 ] ) * 0.5;
    normal[ 2 ] = ( normal[ 2 ] + normalEstimate2[ 2 ] ) * 0.5;

    // Step 3: Calculate the x and y axes of the rover in its parent's frame of reference
    
    // Calculate xAxis as y cross z
    var yAxis = [ this.transform[ 4 ], this.transform[ 5 ], this.transform[ 6 ] ];
    var xAxis = goog.vec.Vec3.cross( yAxis, normal, goog.vec.Vec3.create() );

    // Normalize x and z axes
    // (we do this now so their cross product will be unit length and we'll only have to do it 
    // twice instead of three times)
    goog.vec.Vec3.normalize( xAxis, xAxis );
    goog.vec.Vec3.normalize( normal, normal );

    // Calculate yAxis as z cross x
    goog.vec.Vec3.cross( normal, xAxis, yAxis );

    // Step 4: Find the point on the terrain below the rover
    pos[ 2 ] = ( terrainPosFL[ 2 ] + terrainPosBL[ 2 ] + terrainPosFR[ 2 ] + terrainPosBR[ 2 ] ) * 0.25

    // Step 5: Assign the new transform to the rover
    this.transform = [
        xAxis[ 0 ],  xAxis[ 1 ],  xAxis[ 2 ],  0,
        yAxis[ 0 ],  yAxis[ 1 ],  yAxis[ 2 ],  0,
        normal[ 0 ], normal[ 1 ], normal[ 2 ], 0,
        pos[ 0 ],    pos[ 1 ],    pos[ 2 ],    1
    ];
}

this.translateOnTerrain = function( translation, duration, boundaryValue ) {

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
                this.wheelFL.rotateBy( axisAngle );
                this.wheelBL.rotateBy( axisAngle );
                this.wheelFR.rotateBy( axisAngle );
                this.wheelBR.rotateBy( axisAngle );

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

this.activateSensor = function( sensor ) {

    if ( sensor === 'forward' ) {
        // This sensor just checks the current position against the 
        //  "anomalyPosition" on the blackboard (if any).
        var anomalyPos = this.sceneNode.sceneBlackboard[ "anomalyPosition" ];
        var currentPos = this.currentGridSquare;
        this.tracksSensorValue = anomalyPos && 
                                 anomalyPos[ 0 ] === currentPos [ 0 ] && 
                                 anomalyPos[ 1 ] === currentPos [ 1 ];
    }

}

this.deactivateSensor = function() {
    
}

this.setHeading = function( newHeading, duration ) {
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
}

//@ sourceURL=source/rover.js