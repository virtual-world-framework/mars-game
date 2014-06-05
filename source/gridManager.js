this.validCoord = function( gridCoord ) {
    if ( !this.currentGrid.validCoord( gridCoord ) ) {	
        return false;
    }
    return true;
}

this.getEnergy = function ( gridCoord ) {
    if ( this.validCoord( gridCoord ) ) {
        return this.currentGrid.getTileFromGrid( gridCoord ).energyRequired;
    }
    return null;
}

//Returns the first instance of an inventoriable object on the specified grid tile
this.hasInventoriable = function( gridCoord ) {
    if ( this.validCoord( gridCoord ) ) {    
        var list = this.currentGrid.checkCoord( gridCoord );
        for ( var i = 0; i < list.length; i++ ) {
            if ( list[ i ].isInventoriable ) {
                return list[ i ];
            }
        }
    }
    return null;
}

//Returns the first instance of a collidable object on the specified grid tile
this.hasCollidable = function( gridCoord ) {
    if ( this.validCoord( gridCoord ) ) {
        var list = this.currentGrid.checkCoord( gridCoord );
        for ( var i = 0; i < list.length; i++ ) {
            if ( list[ i ].isCollidable ) {
                return list[ i ];
            }
        }
    }
    return null;
}

//@ sourceURL=source/gridManager.js