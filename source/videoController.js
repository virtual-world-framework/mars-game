var videos = new Array();
var videoID = 0;

function loadVideo( src, type ) {
    var video = {
        "id" : videoID,
        "elem" : document.createElement( "video" ),
        "source" : document.createElement( "source" ),
        "wrapper" : document.createElement( "div" )
    };
    video.elem.appendChild( video.source );
    video.wrapper.appendChild( video.elem );
    video.source.src = "assets/video/" + src;
    video.source.type = type || 'video/mp4;codecs="avc1.42E01E,mp4a.40.2"';
    video.elem.id = "video" + video.id;
    video.elem.className = "video";
    video.wrapper.className = "videoWrapper";
    video.elem.load();

    video.elem.onclick = removeVideoOnEvent;
    video.elem.onended = removeVideoOnEvent;

    videos.push( video );
    videoID++;
    return videoID - 1;
}

function playVideo( id ) {
    var video = videos[ id ];
    if ( video ) {
        document.body.appendChild( video.wrapper );
        video.elem.play();
    }
}

function removeVideoOnEvent( event ) {
    var videoElem = event.srcElement;
    var id = parseInt( videoElem.id.split( "video" )[ 1 ] );
    removeVideo( id );
}

function removeVideo( id ) {
    var video = videos[ id ];
    if ( video && video.wrapper.parentNode === document.body ) {
        $( "#transitionScreen" ).fadeIn( function() {
            if ( video.id === introVideoId ) {
                vwf_view.kernel.fireEvent( vwf_view.kernel.application(), "introScreensComplete" );
            }
            document.body.removeChild( video.wrapper );
            $( "#transitionScreen" ).fadeOut( "slow" );
        } );
    }
}

function getVideoIdFromSrc( src ) {
    src = "assets/video/" + src;
    for ( var i = 0; i < videos.length; i++ ) {
        if ( src === videos[ i ].source.src ) {
            return videos[ i ].id;
        }
    }
    return undefined;
}

//@ sourceURL=source/videoController.js