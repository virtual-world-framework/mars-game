this.togglePerspective = function() {
  var firstPersonTransform = [ -1,  0, 0, 0,  0,    -1,   0,     0,  0,     0, 1,     0,      0, 0,  135, 0 ];
  var thirdPersonTransform = [  0, -1, 0, 0,  0.707,  0, -0.707, 0,  0.707, 0, 0.707, 0,  -5800, 0, 5800, 0 ];
  var durationSeconds = 1;
  var delaySeconds = 0.1;

  if ( this.camera.isFirstPerson ) {
    // Switch to third person
    this.camera.transformTo( thirdPersonTransform, durationSeconds );
    this.rover.future( delaySeconds ).visible = true;
    this.camera.navmode = "none";
    this.camera.isFirstPerson = false;
  } else {
    // Switch to first person
    this.camera.transformTo( firstPersonTransform, durationSeconds );
    this.rover.future( durationSeconds - delaySeconds ).visible = false;
    this.camera.future( durationSeconds ).navmode = "walk";
    this.camera.isFirstPerson = true;
  }
} //@ sourceURL=player
