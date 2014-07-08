var defaultNav = {
    mouse: undefined,
    move: undefined,
    rotate: undefined,
    scroll: undefined
}

function setUpNavigation() {

    var threejs = findThreejsView();

    defaultNav.mouse = threejs.handleMouseNavigation;
    defaultNav.scroll = threejs.handleScroll;
    defaultNav.move = threejs.moveNavObject;  
    defaultNav.rotate = threejs.rotateNavObjectByKey;
    
    threejs.handleMouseNavigation = handleMouseNavigation;
    threejs.handleScroll = handleScroll;
    threejs.moveNavObject = moveNavObject;
    threejs.rotateNavObjectByKey = rotateNavObject;
    threejs.appRequestsPointerLock = requestPointerLock;
}

function handleMouseNavigation( deltaX, deltaY, navObject, navMode, rotationSpeed, translationSpeed, mouseDown, mouseEventData ) {

    switch( navMode ) {

        case "walk":
        case "fly":
        case "none":
            defaultNav.mouse( deltaX, deltaY, navObject, navMode, rotationSpeed, translationSpeed, mouseDown );
            break;

        case "topDown":
            if ( mouseDown.right ) {
                var navThreeObject = navObject.threeObject;
                var navX = navThreeObject.matrixWorld.elements[ 12 ];
                var navY = navThreeObject.matrixWorld.elements[ 13 ];
                var heightModifier = navThreeObject.matrixWorld.elements[ 14 ] / 10;
                navX += -deltaX * translationSpeed * heightModifier;
                navY += deltaY * translationSpeed * heightModifier;

                // Keep the view within grid boundaries
                navX = navX < gridBounds.bottomLeft[ 0 ] ? gridBounds.bottomLeft[ 0 ] : navX;
                navX = navX > gridBounds.topRight[ 0 ] ? gridBounds.topRight[ 0 ] : navX;       
                navY = navY < gridBounds.bottomLeft[ 1 ] ? gridBounds.bottomLeft[ 1 ] : navY;
                navY = navY > gridBounds.topRight[ 1 ] ? gridBounds.topRight[ 1 ] : navY;

                navThreeObject.matrixWorld.elements[ 12 ] = navX;
                navThreeObject.matrixWorld.elements[ 13 ] = navY;
            }
            break;

        case "thirdPerson":
            break;
    }
}

function handleScroll( wheelDelta, navObject, navMode, rotationSpeed, translationSpeed, distanceToTarget ) {

    switch ( navMode ) {

        case "walk":
        case "fly":
        case "none":
            defaultNav.scroll( wheelDelta, navObject, navMode, rotationSpeed, translationSpeed, distanceToTarget );
            break;

        case "topDown":
            var numClicks = wheelDelta / 3;
            var navZ = navObject.threeObject.matrixWorld.elements[ 14 ];
            navZ -= numClicks;

            // Keep the view within reasonable distance of the grid area
            var upperBound = gridBounds.topRight[ 0 ] - gridBounds.bottomLeft[ 0 ];
            var lowerBound = ( gridBounds.topRight[ 0 ] - gridBounds.bottomLeft[ 0 ] ) / 3;
            navZ = navZ > upperBound ? upperBound : navZ;
            navZ = navZ < lowerBound ? lowerBound : navZ;

            navObject.threeObject.matrixWorld.elements[ 14 ] = navZ;
            break;

        case "thirdPerson":
            break;
    }
}

function moveNavObject( dx, dy, navObject, navMode, rotationSpeed, translationSpeed, msSinceLastFrame ) {

    switch ( navMode ) {

        case "walk":
        case "fly":
        case "none":
            defaultNav.move( dx, dy, navObject, navMode, rotationSpeed, translationSpeed, msSinceLastFrame );
            break;

        case "topDown":
            var dist = translationSpeed * Math.min( msSinceLastFrame * 0.001, 0.5 );
            var navX = navObject.threeObject.matrixWorld.elements[ 12 ];
            var navY = navObject.threeObject.matrixWorld.elements[ 13 ];
            navX += dx * dist;
            navY += dy * dist;

            // Keep the view within grid boundaries
            navX = navX < gridBounds.bottomLeft[ 0 ] ? gridBounds.bottomLeft[ 0 ] : navX;
            navX = navX > gridBounds.topRight[ 0 ] ? gridBounds.topRight[ 0 ] : navX;       
            navY = navY < gridBounds.bottomLeft[ 1 ] ? gridBounds.bottomLeft[ 1 ] : navY;
            navY = navY > gridBounds.topRight[ 1 ] ? gridBounds.topRight[ 1 ] : navY;

            navObject.threeObject.matrixWorld.elements[ 12 ] = navX;
            navObject.threeObject.matrixWorld.elements[ 13 ] = navY;
            break;

        case "thirdPerson":
            break;
    }

}

function rotateNavObject( direction, navObject, navMode, rotationSpeed, translationSpeed, msSinceLastFrame ){

    switch ( navMode ) {

        case "walk":
        case "fly":
        case "none":
            defaultNav.rotate( direction, navObject, navMode, rotationSpeed, translationSpeed, msSinceLastFrame );
            break;
    }
}

function requestPointerLock( navMode, mouseDown ) {

    if ( mouseDown.right && ( navMode === "walk" ) ) {
        return true;
    }
    return false;
}

//@ sourceURL=source/navigation.js