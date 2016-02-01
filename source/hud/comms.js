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
    if ( this.characterImage ) {
        context.save();
        var opening = this.height * this.interval;
        context.beginPath();
        context.rect( position.x, position.y + ( ( this.height - opening ) / 2 ), this.width, opening );
        context.clip();
        context.drawImage( this.characterImage, position.x, position.y );
        context.restore();
        this.interval += 0.1 * this.direction;
        if ( this.interval > 1 ) {
            this.interval = 1;
        } else if ( this.interval <= 0 && this.direction === -1 ) {
            this.interval = 0;
            this.characterImage.src = "";
        }
    }
    if ( this.frame && this.meter ) {
        context.drawImage( this.frame, position.x, position.y );
        context.drawImage( this.meter, position.x, position.y );
    }
}

this.addCharacterImage = function( path ) {
    var images = this.images;
    images.characterImage = path;
    this.images = images;
    this.interval = 0;
    this.direction = 1;
}

this.removeCharacterImage = function() {
    this.interval = 1;
    this.direction = -1;
}

//@ sourceURL=source/hud/comms.js