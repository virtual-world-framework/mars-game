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

function loadVideo( src, type, dontRemoveWhenEnded ) {
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

    document.onkeypress = removeVideoOnEvent;

    if ( !dontRemoveWhenEnded ) {
        video.elem.onended = removeVideoOnEvent;
    }

    videos.push( video );
    videoID++;
    return videoID - 1;
}

function playVideo( id ) {
    var video = videos[ id ];
    if ( video ) {
        document.body.appendChild( video.wrapper );
        playingVideo = video;
        video.elem.play();
    }
}

function removeVideoOnEvent( event ) {
    if ( !playingVideo ) {
        return;
    }
    
    // 32 = space bar character code
    if ( event.type === "keypress" && event.which !== 32 ) {
        return;
    }

    var videoElem = playingVideo.elem || event.srcElement;
    var id = parseInt( videoElem.id.split( "video" )[ 1 ] );
    var fileName = getVideoFileName( videos[ id ] );
    vwf_view.kernel.fireEvent( vwf_view.kernel.application(), "videoPlayed", [ fileName ] );
    removeVideo( id );
    playingVideo = undefined;
}

function removeVideo( id ) {
    var video = videos[ id ];
    if ( video && video.wrapper.parentNode === document.body ) {
        document.body.removeChild( video.wrapper );
    }
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
    var fileName = video.source.src.split( "/" ).pop();
    return fileName;
}
//@ sourceURL=source/videoController.js