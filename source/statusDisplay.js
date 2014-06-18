var statusDisplayWrapper = document.createElement( "div" );
var maxStatuses = 4;
var lastStatus;
var duplicateStatusCount;

var alertDisplayWrapper = document.createElement( "div" );
var maxAlerts = 1;

function setUpStatusDisplay() {

    statusDisplayWrapper.id = "statusDisplayWrapper";
    for ( var i = 0; i < maxStatuses; i++ ) {
        var statusText = document.createElement( "div" );
        statusText.className = "statusText";
        statusText.innerHTML = "<br />";
        statusText.style.opacity = 1;
        statusDisplayWrapper.appendChild( statusText );
    }
    document.body.appendChild( statusDisplayWrapper );

    duplicateStatusCount = 1;
    lastStatus = "";

    alertDisplayWrapper.id = "alertDisplayWrapper";
    for ( var i = 0; i < maxAlerts; i++ ) {
        var alertText = document.createElement( "div" );
        alertText.className = "alertText";
        alertText.innerHTML = "<br />";
        alertText.style.opacity = 1;
        alertDisplayWrapper.appendChild( alertText );
    }
    document.body.appendChild( alertDisplayWrapper );
}

function resetStatusDisplay() {
    lastStatus = "";
    duplicateStatusCount = 1;
    for ( var i = 0; i < statusDisplayWrapper.children.length; i++ ) {
        statusDisplayWrapper.children[ i ].innerHTML = "<br />";
    }

    for ( var i = 0; i < alertDisplayWrapper.children.length; i++ ) {
        alertDisplayWrapper.children[ i ].innerHTML = "<br />";
    }
}

function pushStatusToDisplay( message ) {

    var statusBottom = statusDisplayWrapper.style.bottom;

    $( "#statusDisplayWrapper" ).animate( { 
        'bottom' : '+=18px'
     }, "fast", function() {
        var statusText = document.createElement( "div" );
        statusText.className = "statusText";
        statusText.innerHTML = message;
        statusText.style.opacity = 1;
        statusDisplayWrapper.appendChild( statusText );
        statusDisplayWrapper.removeChild( statusDisplayWrapper.firstChild );
        statusDisplayWrapper.style.bottom = statusBottom;
    } );

    fadeMessageStack( ".statusText", maxStatuses, 5000 );

    if ( message === lastStatus ) {
        duplicateStatusCount++;
        lastStatus = message;
        message += " x" + duplicateStatusCount;
    } else {
        lastStatus = message;
        duplicateStatusCount = 1;
    }
}

function pushAlertToDisplay( message ) {
    
    var alertsBottom = alertDisplayWrapper.style.bottom;

    $( "#alertDisplayWrapper" ).animate( {
        'bottom' : '+=26px'
    }, "fast", function() {
        var alertText = document.createElement( "div" );
        alertText.className = "alertText";
        alertText.innerHTML = message;
        alertText.style.opacity = 1;
        alertDisplayWrapper.appendChild( alertText );
        alertDisplayWrapper.removeChild( alertDisplayWrapper.firstChild );
        alertDisplayWrapper.style.bottom = alertsBottom;
    } );

    fadeMessageStack( ".alertText", maxAlerts, 10000 );
}

// Fades out statuses by opacityDecrease when pushed up, otherwise fades out entirely
function fadeMessageStack( jqSelector, stackLength, maxDisplayTime ) {

    if ( jqSelector ) {
        var opacityDecrease = ( 1 / stackLength );

        $( jqSelector ).stop( true, false ).animate( {

            'opacity' : '-=' + opacityDecrease

        }, "fast", function() {

            $( jqSelector ).animate( {

                'opacity' : 0

            }, maxDisplayTime );
        } );
    }
}

//@ sourceURL=source/statusDisplay.js