var loggerBox = document.createElement( "div" );
var subtitleDisplayWrapper = document.createElement( "div" );

var alertDisplayWrapper = document.createElement( "div" );
var lastAlert;

function setUpStatusDisplay() {

    loggerBox.id = "loggerBox";
    document.body.appendChild( loggerBox );
    subtitleDisplayWrapper.id = "subtitleDisplayWrapper";
    loggerBox.appendChild( subtitleDisplayWrapper );
    var subtitleText = document.createElement( "div" );
    subtitleText.id = "subtitleText";
    subtitleDisplayWrapper.appendChild( subtitleText );

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
    lastAlert = "";
    for ( var i = 0; i < alertDisplayWrapper.children.length; i++ ) {
        alertDisplayWrapper.children[ i ].innerHTML = "<br />";
    }
}

function resetSubtitles() {
    while ( subtitleDisplayWrapper.firstChild ) {
        subtitleDisplayWrapper.removeChild( subtitleDisplayWrapper.firstChild );
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

     if ( type === "alerts" ) {

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
    $( textSelector ).delay( 5000 ).stop( true, false ).animate( {

        'opacity' : '-=' + opacityDecrease

    }, "fast", function() {

        // After messages shift up, continue complete fade out
        statusFadeComplete( type, textSelector, maxDisplayTime );
    } );
}

function pushSubtitle( message, subtitleTime ) {
    var text = document.createElement( "div" );
    text.className = "subtitleText";

    // Break up the message into the character speaking
    // and the actual message
    var splitMessage = message.split( ":", 2 );
    var messageText = message;
    if ( splitMessage.length > 1 ) {
        text.innerHTML += splitMessage[ 0 ] + ":";
        messageText = splitMessage[ 1 ];
    }

    // Shave 100ms off the subtitle time to make up for any
    // delay between the VO and the subtitle firing
    subtitleTime -= 0.1;

    var time, lastUpdateTime;
    var index = 0;
    var charInterval = messageText.length > 0 ? subtitleTime / messageText.length : 0;

    var updateSubtitle = function() {
        time = vwf_view.kernel.time();
        lastUpdateTime = lastUpdateTime || time;
        
        var difference = time - lastUpdateTime;
        if ( difference >= charInterval ) {
            lastUpdateTime = time - ( difference - charInterval );
            text.innerHTML += messageText[ index ];
            loggerBox.scrollTop = loggerBox.scrollHeight;
            index++;
        }

        if ( index < messageText.length ) {
            requestAnimationFrame( updateSubtitle );
        }
    }

    requestAnimationFrame( updateSubtitle );
    subtitleDisplayWrapper.appendChild( text );
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