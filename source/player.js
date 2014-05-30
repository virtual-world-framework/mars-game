this.togglePerspective = function() {
    this.camera.pointOfView = ( this.camera.pointOfView === "firstPerson" ) ? 
                              "thirdPerson" : "firstPerson";
} 

//@ sourceURL=source/player.js