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
var mediaManagerID;
var videoManagerID;

function loadVideo( src, type ) {
    var video = {
        "id" : videoID,
    };
    video.source = "assets/video/" + src;
    video.vidName = src;

    document.onkeypress = removeVideoOnEvent;

    mediaManagerID = vwf_view.kernel.find( undefined, "/mediaManager" )[ 0 ];
    videoManagerID = vwf_view.kernel.find( mediaManagerID, "videoManager" ) [ 0 ];
    videos.push( video );
    videoID++;
    return videoID - 1;

    var rover = vwf_view.kernel.find( "", "//rover" )[ 0 ];
}

function playVideo( id ) {
    var video = videos[ id ];
    if ( video ) {

        playingVideo = video;
        vwf_view.kernel.setProperty( videoManagerID, "z_index", 103 );
        vwf_view.kernel.callMethod( videoManagerID, "show" );

        //TODO: Is there a better way to do this than to put "/mars-game/" in front of video.source.src ?
        var appName = "mars-game";
        var redactedURL = ( video.source ).replace( new RegExp(appName + "/.*/assets"), appName + "/assets");
        vwf_view.kernel.setProperty( videoManagerID, "url", redactedURL );
        vwf_view.kernel.callMethod( videoManagerID, "play" );
    }
}

function removeVideoOnEvent( event ) {
    if ( !playingVideo ) {
        return;
    }
    
    // 32 = space bar character code
    if ( event && event.type === "keypress" && event.which !== 32 ) {
        return;
    }
    var mediaManagerID = vwf_view.kernel.find( undefined, "/mediaManager" )[ 0 ];
    var videoManagerID = vwf_view.kernel.find( mediaManagerID, "videoManager" ) [ 0 ];

    vwf_view.kernel.callMethod( videoManagerID, "clearMedia" );
    if( playingVideo ){
        var id = playingVideo.id;
        var fileName = videos[id].vidName;
        vwf_view.kernel.fireEvent( vwf_view.kernel.application(), "videoPlayed", [ fileName ] );
        playingVideo = undefined;
    }
}

function removeVideo() {
    vwf_view.kernel.callMethod( videoManagerID, "hide" );
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