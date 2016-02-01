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

this.draw = function( context, position ) {
    var time = Date.now() / 1000;
    var timeSinceLastBlink = time - this.lastBlinkTime;
    if ( this.text && this.text.length > 0 ) {
        if ( this.icon ) {
            if ( this.blinkTicks > 0 && timeSinceLastBlink >= this.blinkInterval ) {
                this.opacity = this.blinkTicks % 2 ? 1 : 0.5;
                this.blinkTicks--;
                this.lastBlinkTime = time;
            }
            context.globalAlpha = this.opacity;
            context.drawImage( this.icon, position.x, position.y );
            context.globalAlpha = 1;
        }
        context.font = '16px Arial';
        context.fillStyle = "rgb( 0, 0, 0 )";
        context.textAlign = "left";
        context.textBaseline = "top";
        context.fillText( this.text, position.x + 42, position.y + 8 );
        context.fillStyle = "rgb( 210, 235, 255 )";
        context.textAlign = "left";
        context.textBaseline = "top";
        context.fillText( this.text, position.x + 40, position.y + 6 );
    }
}

//@ sourceURL=source/hud/objective.js