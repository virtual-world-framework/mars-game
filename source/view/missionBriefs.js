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

var missionBriefDOM = document.getElementById( "mb_wrapper" );
var missionBriefTitle = document.getElementById( "mb_title" );
var missionBriefContent = document.getElementById( "mb_content" );
var missionBriefClose = document.getElementById( "mb_close" );

missionBriefClose.onclick = hideMissionBrief;

function showMissionBrief() {
	var visible = Boolean( missionBriefDOM.style.display === "block" );
	if ( !visible ) {
    	missionBriefDOM.style.display = "block";
	} else {
		hideMissionBrief();
	}
}

function hideMissionBrief() {
    missionBriefDOM.style.display = "none";
    vwf_view.kernel.fireEvent( "missionBriefClosed" );
}

function setBriefInfo( title, content ) {
    missionBriefTitle.innerHTML = title;
    missionBriefContent.innerHTML = content;
}

//@ sourceURL=source/view/missionBriefs.js