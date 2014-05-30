this.validCoord = function( gridCoord ) {
    if ( !this.currentGrid.validCoord( gridCoord ) ) {	
        return false;
    }
    return true;
}

this.getEnergy = function ( gridCoord ) {
	if ( this.currentBoundaryMap && this.validCoord( gridCoord ) ) {
		return this.currentBoundaryMap.map[ gridCoord[ 0 ] ][ gridCoord[ 1 ] ];
	}
	return null;
}

//@ sourceURL=source/gridManager.js