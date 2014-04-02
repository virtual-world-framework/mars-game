this.togglePerspective = function() {
  var firstPersonTransform = [ -1,  0, 0, 0,  0,    -1,   0,     0,  0,     0, 1,     0,      0, 0,  135, 0 ];
  var thirdPersonTransform = [  0, -1, 0, 0,  0.707,  0, -0.707, 0,  0.707, 0, 0.707, 0,  -1000, 0, 1000, 0 ];

  if ( this.camera.isFirstPerson ) {
    // Switch to third person
    this.rover.visible = true;
    this.camera.transformTo( thirdPersonTransform, 2 );
    this.camera.navmode = "fly";
    this.camera.isFirstPerson = false;
  } else {
    // Switch to first person
    this.rover.visible = false;
    this.camera.transformTo( firstPersonTransform, 2 );
    this.camera.navmode = "walk";
    this.camera.isFirstPerson = true;
  }
} //@ sourceURL=player