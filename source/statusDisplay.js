var statusDisplayWrapper = document.createElement( "div" );
var lastStatus;
var duplicateStatusCount;

var alertDisplayWrapper = document.createElement( "div" );
var lastAlert;

function setUpStatusDisplay() {

    statusDisplayWrapper.id = "statusDisplayWrapper";
    for ( var i = 0; i < 4; i++ ) {
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
    for ( var i = 0; i < loggerNodes[ alertNodeID ].logger_maxLogs; i++ ) {
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

    lastAlert = "";
    for ( var i = 0; i < alertDisplayWrapper.children.length; i++ ) {
        alertDisplayWrapper.children[ i ].innerHTML = "<br />";
    }
}

function pushToDisplay( type, message ) {

    var displayWrapperSelector;
    var textSelector;
    var maxDisplayTime;
    var stackLength;

    var pushAttribute;
    var pushAnimation = {};
    var originalPos;

    if ( type === "status" ) {

        if ( !statusNodeID ) {
            return undefined;
        }

        displayWrapperSelector = "#statusDisplayWrapper";
        textSelector = ".statusText";
        maxDisplayTime = loggerNodes[ statusNodeID ].logger_lifeTime;
        stackLength = 4;

        // Add "x#" to duplicate status messages
        if ( message === lastStatus ) {
            duplicateStatusCount++;
            lastStatus = message;
            message += " x" + duplicateStatusCount;
        } else {
            lastStatus = message;
            duplicateStatusCount = 1;
        }

        originalPos = $( displayWrapperSelector ).css( "bottom" );
        pushAttribute = "bottom";        
        pushAnimation[ pushAttribute ] = '+=' + $( textSelector ).css( "font-size" );

    } else if ( type === "alerts" ) {

        if ( !alertNodeID ) {
            return undefined;
        }

        displayWrapperSelector = "#alertDisplayWrapper";
        textSelector = ".alertText";
        maxDisplayTime = loggerNodes[ alertNodeID ].logger_lifeTime;
        stackLength = loggerNodes[ alertNodeID ].logger_maxLogs;
        if ( message === lastAlert ) {
            $( textSelector ).css( 'opacity', 1 );
            statusFadeComplete( type, textSelector, maxDisplayTime );
            return undefined;
        }
        lastAlert = message;

        originalPos = $( displayWrapperSelector ).css( "top" );
        pushAttribute = "top";
        pushAnimation[ pushAttribute ] = '-=' + $( textSelector ).css( "font-size" );
    }

    //Pushes older messages up
    $( displayWrapperSelector ).animate( pushAnimation, "fast", 
    function() {
        var text = document.createElement( "div" );
        text.className = textSelector.slice( 1, textSelector.length );
        text.innerHTML = message;
        text.style.opacity = 1;
        $( displayWrapperSelector ).append( text );
        $( displayWrapperSelector ).children( "div:first" ).remove();
        $( displayWrapperSelector ).css( pushAttribute, originalPos );
    } );

    // Fades out statuses by opacityDecrease when pushed up
    var opacityDecrease = ( 1 / stackLength );
    $( textSelector ).stop( true, false ).animate( {

        'opacity' : '-=' + opacityDecrease

    }, "fast", function() {

        // After messages shift up, continue complete fade out
        statusFadeComplete( type, textSelector, maxDisplayTime );
    } );
}

function statusFadeComplete( messageType, jqSelector, time ) {
    $( jqSelector ).stop( true, false ).animate( {

        'opacity' : 0

    }, time, function() {

        //After messages fade out completely, clear history
        statusClearHistory( messageType );
    } );
}

function statusClearHistory( messageType ) {
    if ( messageType === "status" ) {
        lastStatus = "";
    } else if ( messageType === "alerts" ) {
        lastAlert = "";
    }
}

//@ sourceURL=source/statusDisplay.js