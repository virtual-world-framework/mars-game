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

var briefs = {}
briefs.mission3task1_title = "Mission 3, Task 1:";
briefs.mission3task1_text = "Your sensors have detected that one of the "
    + "cargo pods has landed nearby. The exact location of the pod is "
    + "unknown, but your Signal Sensor will show you the angle to the pod "
    + "from your current position. Your rover can only face 4 directions: "
    + "<br><img src='assets/images/tooltips/heading.png' /><br> As you can "
    + "see, to the right is 0 degrees, up is 90 degrees, left is 180 degrees "
    + "and down is 270 degrees. <br><br>Try moving until the signal matches "
    + "one of those directions. Once you are facing the direction of the signal, "
    + "you can move forward until your Metal Detector finds the pod.";
briefs.mission4task1_title = "Mission 4, Task 1:";
briefs.mission4task1_text = "Congratulations! You’ve found the cargo pod! "
    + "<br><br>The pod you've found contains a large amount of nanites! "
    + "Nanites are microscopic robots that can construct materials using "
    + "nothing but the air and soil of Mars. The pod also contained your "
    + "newest rover, Peregrine, who is designed to transport the nanites "
    + "and place them on the ground to build the base for the humans. "
    + "<br><br>You seem to be running low on battery! Let's get Peregrine "
    + "working on building some solar panels. Your helicam will illuminate "
    + "a triangle on the ground where you can build a solar panel. All you "
    + "have to do is put in the vertices of the triangle for Peregrine to "
    + "follow and his built-in program will do the rest. <br><br>Remember, "
    + "a vertex is an ordered pair of coordinates: ( x, y ). Set the x and "
    + "y values in the program to match the ordered pairs in your objective "
    + "indicator.";
briefs.mission4task2_title = "Mission 4, Task 2:";
briefs.mission4task2_text = "Well done! You have successfully placed the nanites! "
    + "<br><br>Unfortunately, the spot where we had you place the nanites is too "
    + "close to the cliff, so it will be in the shade for much of the day. <br><br>"
    + "Let's translate the vertices of the last triangle to move them further from "
    + "the cliff wall. To translate, or move the triangle, you need to add or "
    + "subtract from the x and y values of the vertices. Try translating the "
    + "triangle 10 spaces along the positive x axis. <br><br>Remember, the x axis "
    + "goes from the left (negative x) to the right (positive x). So you will have to "
    + "add to the x values of your triangle vertices in order to move them along the "
    + "positive x axis. Try adding 10 to the x values of your triangle's vertices.";
briefs.mission4task3_title = "Mission 4, Task 3:";
briefs.mission4task3_text = "Good work! Now that you’ve placed the triangle in "
    + "a good spot, we should dilate it to make it bigger. <br><br>To dilate, or change the "
    + "size of the triangle, you can multiply the x and y values of the vertices by "
    + "a number to make them further apart. Let's make the triangle 2 times the " 
    + "size it was. Try multiplying your vertices to make the triangle twice as large.";
briefs.mission4task4_title = "Mission 4, Task 4:";
briefs.mission4task4_text = "Excellent! That triangle is perfect for a solar panel! "
    + "Let's add some more so we can generate more power. For the next triangle, "
    + "we can reflect the last triangle so we don't have to make new vertices from "
    + "scratch! <br><br>To reflect, or flip the triangle across the y axis, you multiply "
    + "the x values of the vertices by -1. You can do the same across "
    + "the x axis by multiplying the y values by -1. Try multiplying the x values "
    + "to reflect the triangle across the y axis.";
briefs.mission4task5_title = "Mission 4, Task 5:";
briefs.mission4task5_text = "Well done! Let's do that again, but this time reflect "
    + "the triangle across the x axis. <br><br>Remember that to reflect the triangle "
    + "across the x axis, you multiply the y values of the vertices by -1. "
    + "Try multiplying your y values to reflect the triangle across the x axis.";
briefs.mission4task6_title = "Mission 4, Task 6:";
briefs.mission4task6_text = "You're almost done! Let’s add one more triangle by "
    + "reflecting the triangle across both the x and y axes. <br><br> Remember "
    + "that you can reflect across the x axis by multiplying the y values by "
    + "-1 and reflect across the y axis by multiplying the x values by "
    + "-1. So, to do both, you will have to multiply both the x and y "
    + "values by -1. Try multiplying your vertices to reflect over the "
    + "x and y axes.";

var briefOpenButton = document.getElementById( "missionBriefOpen" );
briefOpenButton.onclick = reopenMissionBrief;
var briefContinueButton = document.getElementById( "missionBriefContinue" );
briefContinueButton.onclick = hideMissionBrief;
var briefTitle = document.getElementById( "missionBriefTitle" );
var briefText = document.getElementById( "missionBriefContent" );
var briefWrapper = document.getElementById( "missionBriefWrapper" );
var briefWindow = document.getElementById( "missionBriefBackground" );
var lastMissionName;

function reopenMissionBrief() {
    vwf_view.kernel.callMethod( appID, "openMissionBrief", [ currentScenario ] );W
}

function showMissionBrief( missionName ) {
    var title, text;
    title = briefs[ missionName + "_title" ];
    text = briefs[ missionName + "_text" ];
    if ( title && text ) {
        briefTitle.innerHTML = title;
        briefText.innerHTML = text;
        briefWrapper.style.display = "block";
        briefWindow.style.display = "block";
        lastMissionName = missionName;
    } else {
        hideMissionBrief();
    }
}

function hideMissionBrief() {
    briefWindow.style.display = "none";
    if ( lastMissionName ) {
        vwf_view.kernel.fireEvent( "missionBriefClosed", [ lastMissionName ] );
        lastMissionName = undefined;
    }
}

//@ sourceURL=source/view/missionBriefs.js