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

var playingVideo;
var supportedFormats = [".webm", ".mp4"];
document.onkeypress = removeVideoOnEvent;

function playVideo( src ) {
    if ( src ) {
        playingVideo = src;
        var videoManagerID = vwf_view.kernel.find( "", "//videoManager" )[ 0 ];
        vwf_view.kernel.callMethod( videoManagerID, "show" );

        var videoURLBase = "../assets/video/" + src;

        var fileList = [];
        for( var i = 0; i < supportedFormats.length; i++ ){
            fileList.push( videoURLBase + supportedFormats[i] );
        }
        vwf_view.kernel.setProperty( videoManagerID, "url", fileList );
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
    var videoManagerID = vwf_view.kernel.find( "", "//videoManager" )[ 0 ];

    vwf_view.kernel.callMethod( videoManagerID, "clearMedia" );
    if( playingVideo ){
        vwf_view.kernel.fireEvent( vwf_view.kernel.application(), "videoPlayed", [ playingVideo ] );
        playingVideo = undefined;
    }
}

function removeVideo() {
    var videoManagerID = vwf_view.kernel.find( "", "//videoManager" )[ 0 ];
    vwf_view.kernel.callMethod( videoManagerID, "hide" );
}

//@ sourceURL=source/videoController.js
