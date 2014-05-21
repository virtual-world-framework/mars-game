this.currentSize = 0;

this.add = function( objectID, index ) {

  index = this.currentSize;

  if ( !validIndex( index, this.capacity ) ) {
    return;
  }

  var sceneNode = this.find( "/" )[ 0 ];
  var object = sceneNode.findByID( sceneNode, objectID );

  if ( object && object.isInventoriable ) {
    if ( object.parent_ == this ) {
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