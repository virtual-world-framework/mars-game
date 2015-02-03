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

var loggerBox = document.getElementById( "loggerBox" );
var subtitleDisplayWrapper = document.getElementById( "subtitleDisplayWrapper" );

function setUpStatusDisplay() {
    document.body.appendChild( loggerBox );
    loggerBox.counter = 0;
    var subtitleText = document.createElement( "div" );
    subtitleText.id = "subtitleText";
    subtitleDisplayWrapper.appendChild( subtitleText );
}

function resetSubtitles() {
    subtitleDisplayWrapper.innerHTML = "";
}

function pushSubtitle( message ) {
    var text = document.createElement( "div" );
    text.className = "subtitleText";
    text.innerHTML = message;

    subtitleDisplayWrapper.appendChild( text );
    loggerBox.scrollTop = loggerBox.scrollHeight;
    loggerBox.counter++;
}

//@ sourceURL=source/statusDisplay.js