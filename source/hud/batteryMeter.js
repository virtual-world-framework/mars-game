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
    var battery = this.rovers[ this.activeRover ].battery;
    var maxBattery = this.rovers[ this.activeRover ].maxBattery;
    var arcWidth = ( this.height + this.width ) / 4 ;
    var centerX = position.x + this.width / 2;
    var centerY = position.y + this.height / 2;
    var start = Math.PI * 1.5;
    var end = start - battery / maxBattery * Math.PI * 2;
    var readoutString;
    context.beginPath();
    context.arc( centerX, centerY, arcWidth / 2, start, end, true );
    context.lineWidth = arcWidth - 1;
    context.strokeStyle = "rgb(0,0,0)";
    context.stroke();
    context.globalCompositeOperation = "source-in";
    context.drawImage( this.ring, centerX - this.ring.width / 2, centerY - this.ring.height / 2 );
    context.globalCompositeOperation = "source-over";
    if ( this.portrait ) {
        context.drawImage( this.portrait, centerX - this.portrait.width / 2, centerY - this.portrait.height / 2 );
    }
    if ( this.frame ) {
        context.drawImage( this.frame, position.x, position.y );
    }
    context.textBaseline = "top";
    context.font = 'bold 8pt Arial';
    context.fillStyle = "rgb(215,248,255)";
    context.textAlign = "center";
    readoutString = "BATTERY: " + Math.round( battery ) + " / " + maxBattery;
    context.fillText( readoutString, position.x + this.width / 2, position.y + this.height );
}

this.setUpListeners = function() {
    var rover = this.find( "//rover" )[ 0 ];
    var rover2 = this.find( "//rover2" )[ 0 ];
    var rover3 = this.find( "//rover3" )[ 0 ];
    this.rovers.rover.battery = rover.battery;
    this.rovers.rover.maxBattery = rover.batteryMax;
    this.rovers.rover2.battery = rover2.battery;
    this.rovers.rover2.maxBattery = rover2.batteryMax;
    this.rovers.rover3.battery = rover3.battery;
    this.rovers.rover3.maxBattery = rover3.batteryMax;
    rover.batteryChanged = this.events.add( function( value ) {
        this.rovers.rover.battery = value;
    }, this );
    rover.batteryMaxChanged = this.events.add( function( value ) {
        this.rovers.rover.maxBattery = value;
    }, this );
    rover2.batteryChanged = this.events.add( function( value ) {
        this.rovers.rover2.battery = value;
    }, this );
    rover2.batteryMaxChanged = this.events.add( function( value ) {
        this.rovers.rover2.maxBattery = value;
    }, this );
    rover3.batteryChanged = this.events.add( function( value ) {
        this.rovers.rover3.battery = value;
    }, this );
    rover3.batteryMaxChanged = this.events.add( function( value ) {
        this.rovers.rover3.maxBattery = value;
    }, this );
}

this.setActiveRover = function( roverName ) {
    var rover = this.rovers[ roverName ];
    if ( rover ) {
        this.images.portrait = rover;
        this.activeRover = roverName;
    }
}

//@ sourceURL=source/hud/batteryMeter.js