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

var missionBriefDOM = document.getElementById( "mb_screen" );
var missionBriefTitle = document.getElementById( "mb_title" );
var missionBriefContent = document.getElementById( "mb_content" );
var missionBriefImage = document.getElementById( "mb_image" );
var defaultImage = "../../assets/images/briefBG.png";

missionBriefDOM.onclick = hideMissionBrief;

function showMissionBrief() {
    missionBriefDOM.style.display = "block";
}

function hideMissionBrief() {
    missionBriefDOM.style.display = "none";
    vwf_view.kernel.fireEvent( "missionBriefClosed" );
}

function setBriefInfo( title, content, imageSrc ) {
    missionBriefTitle.innerHTML = title;
    missionBriefContent.innerHTML = content;
    // TODO: Allow each brief to display it's own image to the left of the brief content.
    // imageSrc = imageSrc || defaultImage;
    // missionBriefImage.style.backgroundImage = "url(\"" + imageSrc + "\")";
}

//@ sourceURL=source/view/missionBriefs.js