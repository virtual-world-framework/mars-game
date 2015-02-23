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

this.setAllBlinking = function( value ) {
    var elements = this.children;
    for ( var i = 0; i < elements.length; i++ ) {
        elements[ i ].isBlinking = value;
    }
}

this.setAllEnabled = function( value ) {
    var elements = this.children;
    for ( var i = 0; i < elements.length; i++ ) {
        elements[ i ].enabled = value;
    }
}

this.elementPreDraw = function( context, element ) {
    var alpha = 1;
    var time = Date.now() / 1000;
    if ( !element.enabled ) {
        alpha = 0.5;
    } else if ( element.isBlinking ) {
        if ( time  - element.lastBlinkTime > element.blinkInterval ) {
            alpha = 0.5;
            if ( time - element.lastBlinkTime > element.blinkInterval + element.blinkDuration ) {
                element.lastBlinkTime = time;
            }
        }
    }
    context.globalAlpha = alpha;
}

this.elementPostDraw = function( context, element ) {
    context.globalAlpha = 1;
}

//@ sourceURL=source/hud/marsGameHud.js