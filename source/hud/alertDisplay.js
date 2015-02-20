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
    this.future( 0 ).setUpListeners();
}

this.draw = function( context, position ) {
    var time = Date.now() / 1000;
    var fadeAmount;
    if ( this.newAlert ) {
        this.timeElapsed = 0;
        this.timeOfAlert = time;
        this.newAlert = false;
    }
    if ( this.timeElapsed <= this.opaqueTime + this.fadeTime ) {
        context.font = "24px Arial Black";
        context.fillStyle = "rgb( 255, 255, 255 )";
        context.strokeStyle = "rgb( 0, 0, 0 )";
        context.textAlign = "center";
        context.lineWidth = 4;
        context.miterLimit = 2;
        this.timeElapsed = time - this.timeOfAlert;
        fadeAmount = this.timeElapsed - this.opaqueTime;
        if ( fadeAmount >= 0 ) {
            context.globalAlpha = Math.max( 1 - fadeAmount, 0 );
        } else {
            context.globalAlpha = 1;
        }
        context.strokeText( this.text, position.x, position.y );
        context.fillText( this.text, position.x, position.y );
    }
}

this.setUpListeners = function() {
    var alertLogger = this.find( "//alerts" )[ 0 ];
    alertLogger.logAdded = this.events.add( function( alert ) {
        this.addAlert( alert.log );
    }, this );
}

this.addAlert = function( alert ) {
    this.text = alert;
    this.newAlert = true;
}

//@ sourceURL=source/hud/alertDisplay.js