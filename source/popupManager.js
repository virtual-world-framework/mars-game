function displayFailurePopup( text ) {
    var blocker = document.createElement( "div" );
    blocker.id = "popupBlocker";
    var popup = document.createElement( "div" );
    popup.id = "popupDiv";

    popup.onclick = resetScenario;

    popup.innerHTML += "<h1>Objective failed.</h1>";
    popup.innerHTML += text + "<br />";
    popup.innerHTML += "<br /> Click here to try again.";

    document.body.appendChild( blocker );
    document.body.appendChild( popup );
}

function displaySuccessPopup( text ) {
    var blocker = document.createElement( "div" );
    blocker.id = "popupBlocker";
    var popup = document.createElement( "div" );
    popup.id = "popupDiv";

    popup.onclick = resetScenario;

    popup.innerHTML += "<h1>Success!</h1>";
    popup.innerHTML += "<br /> Click here to try again.";

    document.body.appendChild( blocker );
    document.body.appendChild( popup );    
}

//@ sourceURL=source/popupManager.js