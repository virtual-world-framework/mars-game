var self;

this.initialize = function() {
    self = this;
    this.future( 0 ).initializeEventHandlers();
}

this.initializeEventHandlers = function() {
    this.parent.rover.moved = function( displacement ) {
        self.translateBy( displacement, 1 );
    }
}