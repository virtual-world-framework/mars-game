var statusDisplayWrapper = document.createElement( "div" );
var maxStatuses = 4;
var lastStatus;
var duplicateStatusCount;

var alertDisplayWrapper = document.createElement( "div" );
var maxAlerts = 1;
var lastAlert;

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

    lastAlert = "";
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

function pushToDisplay( type, message ) {

    var displayWrapperSelector;
    var textSelector;
    var maxDisplayTime;
    var stackLength;

    if ( type === "status" ) {
        
        displayWrapperSelector = "#statusDisplayWrapper";
        textSelector = ".statusText";
        maxDisplayTime = 5000;
        stackLength = maxStatuses;

        // Add "x#" to duplicate status messages
        if ( message === lastStatus ) {
            duplicateStatusCount++;
            lastStatus = message;
            message += " x" + duplicateStatusCount;
        } else {
            lastStatus = message;
            duplicateStatusCount = 1;
        }

    } else if ( type === "alerts" ) {

        if ( message === lastAlert ) {
            return undefined;
        }
        lastAlert = message;
        displayWrapperSelector = "#alertDisplayWrapper";
        textSelector = ".alertText";
        maxDisplayTime = 10000;
        stackLength = maxAlerts;
    }

    //Pushes older messages up
    var bottomDistance = $( displayWrapperSelector ).css( "bottom" );
    $( displayWrapperSelector ).animate( {
        'bottom' : '+=' + $( textSelector ).css( "font-size" )
    }, "fast", function() {
        var text = document.createElement( "div" );
        text.className = textSelector.slice( 1, textSelector.length );
        text.innerHTML = message;
        text.style.opacity = 1;
        $( displayWrapperSelector ).append( text );
        $( displayWrapperSelector ).children( "div:first" ).remove();
        $( displayWrapperSelector ).css( "bottom", bottomDistance );
    } );

    // Fades out statuses by opacityDecrease when pushed up, otherwise fades out entirely
    var opacityDecrease = ( 1 / stackLength );
    $( textSelector ).stop( true, false ).animate( {
        'opacity' : '-=' + opacityDecrease
    }, "fast", function() {

        // After messages shift up, continue complete fade out
        $( textSelector ).stop( true, false ).animate( {
            'opacity' : 0
        }, maxDisplayTime, function() {

            //After messages fade out completely, clear history
            if ( type === "status" ) {
                lastStatus = "";
            } else if ( type === "alerts" ) {
                lastAlert = "";
            }
        } );
    } );
}

//@ sourceURL=source/statusDisplay.js