this.initialize = function() {
    this.future( 0.05 ).update();
}

this.update = function() {
    this.followTarget();
    this.future( 0.05 ).update();
}
//@ sourceURL=source/dustSystem.js