this.addedToGrid = function() {
    if ( this.parent.remove ) {
        this.parent.remove( this.id );
    }
    this.visisble = true;
}

//@ sourceURL=source/griddable.js