this.placeOnTerrain = function( pos ) {
    // Step 1: Get height of the terrain under the four wheels
    var deltaPos = [ 
        pos[ 0 ] - this.transform[ 12 ], 
        pos[ 1 ] - this.transform[ 13 ], 
        pos[ 2 ] - this.transform[ 14 ] 
    ];
    // var terrainPosCentroid = this.getTerrainPosUnderNode( this, deltaPos );
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


    // // Step 5: Assign the new transform to the rover
    this.transform = [
        xAxis[ 0 ],  xAxis[ 1 ],  xAxis[ 2 ],  0,
        yAxis[ 0 ],  yAxis[ 1 ],  yAxis[ 2 ],  0,
        normal[ 0 ], normal[ 1 ], normal[ 2 ], 0,
        pos[ 0 ],    pos[ 1 ],    pos[ 2 ],    1
    ];
}