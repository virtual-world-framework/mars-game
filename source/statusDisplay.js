var statusDisplayWrapper = document.createElement( "div" );
var maxMessages = 4;
var lastMessage;
var duplicateMessageCount;

var alertDisplayWrapper = document.createElement( "div" );

function setUpStatusDisplay() {

    statusDisplayWrapper.id = "statusDisplayWrapper";

    for ( var i = 0; i < maxMessages; i++ ) {
        var statusTextBox = document.createElement( "div" );
        statusTextBox.className = "statusText";
        statusTextBox.innerHTML = "<br />";
        statusTextBox.style.opacity = 1;
        statusDisplayWrapper.appendChild( statusTextBox );
    }

    document.body.appendChild( statusDisplayWrapper );

    duplicateMessageCount = 1;
    lastMessage = "";

    alertDisplayWrapper.id = "alertDisplayWrapper";
    document.body.appendChild( alertDisplayWrapper );
}

function pushStatusToDisplay( message ) {

    for ( var i = 0; i < maxMessages; i++ ) {
        statusDisplayWrapper.children[ i ].style.opacity -= ( 1 / maxMessages );
    }

    if ( message === lastMessage ) {
        duplicateMessageCount++;
        lastMessage = message;
        message += " x" + duplicateMessageCount;
    } else {
        lastMessage = message;
        duplicateMessageCount = 1;
    }

    var statusTextBox = document.createElement( "div" );
    statusTextBox.className = "statusText";
    statusTextBox.innerHTML = message;
    statusTextBox.style.opacity = 1;
    statusDisplayWrapper.appendChild( statusTextBox );

    statusDisplayWrapper.removeChild( statusDisplayWrapper.firstChild );

}

//@ sourceURL=source/statusDisplay.js