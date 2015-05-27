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

this.initialize = function() {
    if ( this.useAnimatedShader && !this.uri ) {
        this.future( 0 ).setUpShader();
    }
}

this.construct = function() {
    this.visible = true;
    if ( this.material && this.material.animate ) {
        this.material.animate();
    }
}

this.setConstructed = function( value ) {

    this.visible = value;
    this.built = value;
    if ( this.useAnimatedShader ) {
        this.material._elapsedTime = Number( value ) * this.buildDuration;
    }

    if ( value === true ) {
        if ( this.soundOnComplete ) {
            this.buildingCompleted();
            var soundMgr = this.findTypeInScene( "http://vwf.example.com/sound/soundManager.vwf" );
            soundMgr.playSound( this.soundOnComplete );
        }
    }
}

this.setUpShader = function() {
    var materialDef = {
        "extends": "source/shaders/animatedShader.vwf",
        "properties": {
            "diffuseMap": this.diffuseSrc,
            "normalMap": this.normalSrc,
            "specularMap": this.specularSrc,
            "lightTrailHeight": this.glowLength,
            "normalScale": [ 0.75, 0.75 ],
            "shininess": 1,
            "_duration": this.buildDuration,
            "_bottom": this.translation[ 2 ],
            "_height": this.buildingHeight, // Derive from bounding sphere?
            "_elapsedTime": Number( this.built ) * this.buildDuration
        }
    }
    this.visible = this.built;
    this.children.create( "material", materialDef );
}

this.transformChanged = function( transform ) {
    var z = transform[ 14 ];
    if ( this.material ) {
        this.material._bottom = z;
    }
}