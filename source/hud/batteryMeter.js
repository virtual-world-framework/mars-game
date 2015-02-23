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
    var battery = this.battery;
    var maxBattery = this.maxBattery;
    var arcWidth = ( this.height + this.width ) / 4 ;
    var centerX = position.x + this.width / 2;
    var centerY = position.y + this.height / 2;
    var radius = ( this.width + this.height ) / 4 - arcWidth;
    var start = Math.PI * 1.5;
    var end = start - battery / maxBattery * Math.PI * 2;
    context.beginPath();
    context.arc( centerX, centerY, arcWidth, 0, 2 * Math.PI, false );
    context.fillStyle = "rgba(50,90,150,0.5)";
    context.fill();
    context.beginPath();
    context.arc( centerX, centerY, arcWidth / 2, start, end, true );
    context.lineWidth = arcWidth - 1;
    context.strokeStyle = "rgb(50,130,255)";
    context.stroke();
    if ( this.portrait ) {
        context.drawImage( this.portrait, centerX - this.portrait.width / 2, centerY - this.portrait.height / 2 );
    }
    if ( this.frame ) {
        context.drawImage( this.frame, position.x, position.y );
    }
    context.textBaseline = "top";
    context.font = 'bold 24px Arial';
    context.fillStyle = "rgb(255,255,255)";
    context.textAlign = "left";
    context.fillText( Math.round( battery ), position.x + this.width + 3, position.y - 1 );
}

this.setUpListeners = function() {
    var rover = this.find( "//rover" )[ 0 ];
    this.battery = rover.battery;
    this.maxBattery = rover.batterMax;
    rover.batteryChanged = this.events.add( function( value ) {
        this.battery = value;
    }, this );
    rover.batteryMaxChanged = this.events.add( function( value ) {
        this.maxBattery = value;
    }, this );
}

//@ sourceURL=source/hud/batteryMeter.js