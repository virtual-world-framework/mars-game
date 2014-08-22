this.addedToGrid = function() {
	// TODO: Find a better way to determine if the object's parent
	//   is an inventory and if the object is a pickup
    if ( this.parent.remove ) {
        this.parent.remove( this.id );
    }
    if ( this.setPickupVisibility ) {
    	this.visible = true;
    }
}

//@ sourceURL=source/griddable.js