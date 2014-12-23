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

function displayPopup( type, text ) {
    if ( !currentPopup() ) {
        var blocker = document.createElement( "div" );
        blocker.id = "popupBlocker";
        var popup = document.createElement( "div" );
        popup.id = "popupDiv";

        if ( type === "success" ) {
            popup.onclick = advanceScenario;            
            popup.innerHTML += "<h1>Success!</h1>";
            popup.innerHTML += text + "<br />";
            popup.innerHTML += "<br /> Click here to proceed.";            
        } else if ( type === "failure" ) {
            popup.onclick = resetScenario;            
            popup.innerHTML += "<h1>Objective failed.</h1>";
            popup.innerHTML += text + "<br />";
            popup.innerHTML += "<br /> Click here to try again.";            
        }

        document.body.appendChild( blocker );
        document.body.appendChild( popup );
    }
}

function removePopup() {
    var popup = currentPopup();
    if ( popup ) {
        var blocker = document.getElementById( "popupBlocker" );
        document.body.removeChild( popup );
        document.body.removeChild( blocker );
    }
}

function currentPopup() {
    return document.getElementById( "popupDiv" );
}

function showFailScreen( type ) {

    if ( !currentFailScreen() ) {
        var blocker = document.createElement( "div" );
        blocker.id = "popupBlocker";        
        var failScreen = document.createElement( "div" );
        failScreen.id = "failScreen";
        if ( type === "collision" ) {
            failScreen.style.backgroundImage = "url('assets/images/failureScreens/fail_crash.jpg')";
        } else if ( type === "battery" ) {
            failScreen.style.backgroundImage = "url('assets/images/failureScreens/fail_no_power.jpg')";
        } else if ( type === "incomplete" ) {
            failScreen.style.backgroundImage = "url('assets/images/failureScreens/fail_incomplete.jpg')";        
        } else if ( type === "lost" ) {
            failScreen.style.backgroundImage = "url('assets/images/failureScreens/fail_lost.jpg')";                    
        }
        failScreen.onclick = function() {
            removeFailScreen();        
            resetScenario();
        }

        setTimeout( function() {
            document.body.appendChild( blocker );
            document.body.appendChild( failScreen );
        }, 500 );     
    }
}

function currentFailScreen() {
    return document.getElementById( "failScreen" );
}

function removeFailScreen() {
    var failScreen = currentFailScreen();
    if ( failScreen ) {
        document.body.removeChild( failScreen );

        var blocker = document.getElementById( "popupBlocker" );
        document.body.removeChild( blocker );
    }
}

//@ sourceURL=source/popupManager.js