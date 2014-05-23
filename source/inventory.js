this.initialize = function() {

    this.future( 0 ).onReady();
}

this.onReady = function() {

    this.parent.moved = function() {

        //If the rover moves onto a space containing pickups, add the pickup to the inventory
        var inventoriables = this.find("//element(*,'source/inventoriable.vwf')" );
        for ( var i = 0; i < inventoriables.length; i++) {
            if ( ( !inventoriables[ i ].isPickedUp ) && ( this.currentGridSquare[ 0 ] === inventoriables[ i ].currentGridSquare[ 0 ] ) && ( this.currentGridSquare[ 1 ] === inventoriables[ i ].currentGridSquare[ 1 ] ) ) {
                this.cargo.pickup( inventoriables[ i ].id, inventoriables[ i ].iconSrc, this.cargo.currentSize );
                this.cargo.add( inventoriables[ i ].id );
                inventoriables[ i ].isPickedUp = true;
            }
        }
    }
}

this.add = function( objectID ) {

    var index = this.currentSize;

    if ( !validIndex( index, this.capacity ) ) {
        return;
    }

    var sceneNode = this.find( "/" )[ 0 ];
    var object = sceneNode.findByID( sceneNode, objectID );

    if ( object && object.isInventoriable ) {
        if ( object.parent_ === this ) {
            this.swap( this.slots.indexOf( objectID ), index );
            return;
        }

        object.parent_ = this;
        this.slots[ index ] = object.name;
        this.currentSize++;
        object.visible = this.inventoryIsVisible;
        object.pickedUp();

    }

}

this.swap = function( index1, index2 ) {

    if ( !( validIndex( index1, this.capacity ) && validIndex( index2, this.capacity ) ) ) {
        return;
    }

    var tmp = this.slots[ index1 ];
    this.slots[ index1 ] = this.slots[ index2 ];
    this.slots[ index2 ] = tmp;

} 

this.remove = function( objectID ) {

    var sceneNode = this.find( "/" )[ 0 ];
    var object = sceneNode.findByID( sceneNode, objectID );

    if ( object && object.parent === this ) {

        object.parent_ = this.find( "//pickups" )[ 0 ];

        if ( this.slots.indexOf( objectID ) != currentSize ) {
            this.swap( this.currentSize, this.slots.indexOf( objectID ) );
        }

        this.slots[ this.currentSize ] = undefined;
        this.currentSize--;
        object.visible = true;
        object.isPickedUp = false;
        object.dropped();

    }

}

function validIndex( index, capacity ) {

    if ( isNaN( index ) || index >= capacity || index < 0 ) {
        return false;
    }

    return true;

} 

//@ sourceURL=source/inventory.js