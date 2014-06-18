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

function resetStatusDisplay() {
    lastMessage = "";
    duplicateMessageCount = 1;
    for ( var i = 0; i < statusDisplayWrapper.children.length; i++ ) {
        statusDisplayWrapper.children[ i ].innerHTML = "<br />";
    }
}

function pushStatusToDisplay( message ) {

    $( "#statusDisplayWrapper" ).animate( { 
        'bottom':'+=18px'
     }, "fast", function() {
        var statusTextBox = document.createElement( "div" );
        statusTextBox.className = "statusText";
        statusTextBox.innerHTML = message;
        statusTextBox.style.opacity = 1;
        statusDisplayWrapper.appendChild( statusTextBox );
        statusDisplayWrapper.removeChild( statusDisplayWrapper.firstChild );
        statusDisplayWrapper.style.bottom = "150px";
    } );

    var opacityDecrease = ( 1 / maxMessages );    
    $( ".statusText" ).animate( {
        'opacity' : '-=' + opacityDecrease
    }, "fast" );

    if ( message === lastMessage ) {
        duplicateMessageCount++;
        lastMessage = message;
        message += " x" + duplicateMessageCount;
    } else {
        lastMessage = message;
        duplicateMessageCount = 1;
    }
}

function pushAlertToDisplay( message ) {
    alertDisplayWrapper.innerHTML = message;
}

//@ sourceURL=source/statusDisplay.js