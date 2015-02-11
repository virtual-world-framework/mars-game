// Copyright 2014 Lockheed Martin Corporation
//
// Licensed under the Apache License, Version 2.0 (the "License"); you may 
// not use this file except in compliance with the License. You may obtain 
// a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software 
// distributed under the License is distributed on an "AS IS" BASIS, 
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and 
// limitations under the License.

var videos = new Array();
var videoID = 0;
var playingVideo;

// function loadVideo( src, type, dontRemoveWhenEnded ) {
function loadVideo( src, type ) {
    var video = {
        "id" : videoID,
        // "elem" : document.createElement( "video" ),
        // "source" : document.createElement( "source" ),
        // "wrapper" : document.createElement( "div" )
    };
    // video.elem.appendChild( video.source );
    // video.wrapper.appendChild( video.elem );
    video.source = "assets/video/" + src;
    video.vidName = src;
    // video.source.type = type || 'video/mp4;codecs="avc1.42E01E,mp4a.40.2"';
    // video.elem.id = "video" + video.id;
    // video.elem.className = "video";
    // video.wrapper.className = "videoWrapper";
    // video.elem.load();

    document.onkeypress = removeVideoOnEvent;

    //Right now the code seems to depend on the removeVideoOnEvent... otherwise
    //we don't advance when a video finishes, unless the user presses a key.
    // if ( !dontRemoveWhenEnded ) {
        // video.elem.onended = removeVideoOnEvent;
    // }

    // $("#jquery_jplayer_1").ended = removeVideoOnEvent;
    $("#jquery_jplayer_1").bind($.jPlayer.event.ended, removeVideoOnEvent );

    videos.push( video );
    videoID++;
    return videoID - 1;

    var rover = vwf_view.kernel.find( "", "//rover" )[ 0 ];
}

function playVideo( id ) {
    // var video = videos[ id ];
    // if ( video ) {
    //     document.body.appendChild( video.wrapper );
    //     playingVideo = video;
    //     video.elem.play();
    // }

    //TODO: 
    //a) Find the mediaManager.
    //b) Find the videoManager
    //c) Identify the video source from above (video.source.src)
    //d) use vwf_view_kernel.setProperty( videoManagerID, "url", <insert_url_here>) to set the URL for the video manager.
    //e) vwf_view.kernel.callMethod( videoManagerID, "play" );

    var video = videos[ id ];
    if ( video ) {
        var mediaManagerID = vwf_view.kernel.find( undefined, "/mediaManager" )[ 0 ];
        var videoManagerID = vwf_view.kernel.find( mediaManagerID, "videoManager" ) [ 0 ];

        playingVideo = video;
        // $("#jp_container_1").css('z-index', 103); 
        vwf_view.kernel.setProperty( videoManagerID, "z_index", 103 );
        $("#jp_container_1").css('width', 1024);
        $("#jp_container_1").css('height', 768);
        $("#jquery_jplayer_1").css('width', 1024);
        $("#jquery_jplayer_1").css('height', 768);

        //TODO: Is there a better way to do this than to put "/mars-game/" in front of video.source.src ??? 
        // vwf_view.kernel.setProperty( videoManagerID, "url", '/mars-game/' + video.source.src );
        // vwf_view.kernel.setProperty( videoManagerID, "url", '/mars-game/assets/video/intro_cinematic.mp4' );
        var appName = "mars-game";
        var redactedURL = ( video.source ).replace( new RegExp(appName + "/.*/assets"), appName + "/assets");
        vwf_view.kernel.setProperty( videoManagerID, "url", redactedURL );
        vwf_view.kernel.callMethod( videoManagerID, "play" );
    }

    // var fooRover = vwf_view.kernel.find( "", "//rover" )[ 0 ];
    // var fooGameCam = vwf_view.kernel.find( "", "//gameCam" )[ 0 ];
    // console.log("Playing video: " + id);
}

function removeVideoOnEvent( event ) {

    // 32 = space bar character code
    if ( event.type === "keypress" && event.which !== 32 ) {
            return;
    }
    var mediaManagerID = vwf_view.kernel.find( undefined, "/mediaManager" )[ 0 ];
    var videoManagerID = vwf_view.kernel.find( mediaManagerID, "videoManager" ) [ 0 ];

    vwf_view.kernel.callMethod( videoManagerID, "clearMedia" );
    // $("#jp_container_1").css('z-index', -2); //HACK: We really shouldn't depend on a z-index adjustment to make this work.
    // var videoElem = playingVideo.elem || event.srcElement;
    if( playingVideo ){ //TODO: Figure out why this check is necessary. 
        var id = playingVideo.id;
        var fileName = videos[id].vidName;
        vwf_view.kernel.fireEvent( vwf_view.kernel.application(), "videoPlayed", [ fileName ] );
        playingVideo = undefined;
    }

    // vwf_view.kernel.fireEvent( vwf_view.kernel.application(), "videoPlayed", undefined );
}

function removeVideo( id ) {
    $("#jquery_jplayer_1").css('width', 0);
    $("#jquery_jplayer_1").css('height', 0);
    $("#jp_container_1").css('width', 0);
    $("#jp_container_1").css('height', 0);
    // $("#jp_container_1").hide();
    // $("#jquery_jplayer_1").hide();
    // var video = videos[ id ];
    // if ( video && video.wrapper.parentNode === document.body ) {
    //     document.body.removeChild( video.wrapper );
    // }
}

function getVideoIdFromSrc( src ) {
    for ( var i = 0; i < videos.length; i++ ) {
        var compareSrc = getVideoFileName( videos[ i ] );
        if ( src === compareSrc ) {
            return videos[ i ].id;
        }
    }
    return undefined;
}

function getVideoFileName( video ) {
    var fileName = video.source.split( "/" ).pop();
    return fileName;
}
//@ sourceURL=source/videoController.js