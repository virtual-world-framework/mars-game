// Copyright 2014 Lockheed Martin Corporation
//
// Licensed under the Apache License, Version 2.0 (the "License"); you may 
// not use this file except in compliance with the License. You may obtain 
// a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software 
// distributed under the License is distributed on an "AS IS" BASIS, 
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and 
// limitations under the License.

this.setup = function() {
    this.scene.gameCam.setCameraTarget( this.target );
    this.scene.soundManager.playSound( "musicMenuIntro" );
    this.scene.soundManager.playSound( "musicMenuLoop" );
    this.animate();
}

this.animate = function() {
    if ( this.scene.applicationState !== "menu" ) {
      return;
    }
    var theta = ( this.time * 0.25 ) % ( 2 * Math.PI );
    this.satellite.translateTo( [
            -2.5 + Math.sin( theta ) * 0.1,
            -7.5,
            0.5 + Math.cos( theta ) * 0.075 - 0.25
        ] );
    this.satellite.rotateBy( [ 0, 0.5, 0.5, Math.sin( theta ) * 0.1 ] );
    this.mars.rotateBy( [
            this.mars.axis[0],
            this.mars.axis[1],
            this.mars.axis[2],
            this.mars.rotationRate,
            0
        ] );
    this.future( 0.05 ).animate();
}

//@ sourceURL=source/mainMenu.js