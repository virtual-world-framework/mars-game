var loggerBox = document.getElementById( "loggerBox" );
var subtitleDisplayWrapper = document.getElementById( "subtitleDisplayWrapper" );

function setUpStatusDisplay() {
    document.body.appendChild( loggerBox );
    var subtitleText = document.createElement( "div" );
    subtitleText.id = "subtitleText";
    subtitleDisplayWrapper.appendChild( subtitleText );
}

function resetSubtitles() {
    subtitleDisplayWrapper.innerHTML = "";
}

function pushSubtitle( message, subtitleTime ) {
    var text = document.createElement( "div" );
    text.className = "subtitleText";
    text.innerHTML = message;
    subtitleDisplayWrapper.appendChild( text );
    loggerBox.scrollTop = loggerBox.scrollHeight;
}

//@ sourceURL=source/statusDisplay.js