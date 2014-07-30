this.initialize = function() {
    
}

this.setPickupVisibility = function( value ) {
    var scene = this.find( "/" )[ 0 ];
    if ( scene && scene.name === "application" ) {
        if ( this.parent && ( this.parent.inventoryIsVisible || 
            !this.parent.hasOwnProperty( "inventoryIsVisible" ) ) ) {
            this.visible = value;
        } else {
            this.visible = false;
        }
    } else {
        this.visible = value;
    }
}

//@ sourceURL=source/pickup.js