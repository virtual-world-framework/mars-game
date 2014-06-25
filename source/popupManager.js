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

function showFailScreen( type, message ) {

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

        if ( message ) {
            failScreen.innerHTML = "<p class='failText' >" + message + "</p>";            
        }

        failScreen.onclick = function() {
            removeFailScreen();
            resetScenario();
        }

        setTimeout( function() {
            if ( !currentFailScreen() ) {
                document.body.appendChild( blocker );
                document.body.appendChild( failScreen );
            }
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