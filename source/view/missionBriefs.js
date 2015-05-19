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
briefs.mission3task1_text = "Your next mission is to find the Base Pod, which contains the supplies you’ll need to start building a base for the human explorers.  Although we don’t know where the pod landed, we do have a weak radio signal that will guide you to its location.  You can use your Signal Sensor to get the direction of the signal, which is output as an angle.  0 degrees points out to the right, 90 degrees up toward the top of the screen, 180 degrees is to the left, and so forth.  Using the signal sensor, you can move forward until the signal is directly to your right, then turn right and continue forward until your Metal Detector tells you that you’ve arrived.";
briefs.mission4task1_title = "Mission 4, Task 1:";
briefs.mission4task1_text = "Congratulations!  You’ve made it to the base pod, but now you have another problem – your battery is rapidly being depleted, and you don’t have a good source of power available to you.  Luckily, the base pod contains a generous supply of Nano-Builders, microscopic robots that can construct a wide variety of materials out of nothing but Martian soil and air.  You will need to use your newest rover, Peregrine, to deploy the Nano-Builders.  To make things easier, we’ve configured the Helicam to illuminate the triangle where the first set of Nano-Builders should be placed.  Peregrine comes with a built-in procedure to place triangles of Nano-Builders, so all you need to do is specify the vertices (or corners) of the triangle in the top 6 blocks of the program, and he’ll take it from there!  ";
briefs.mission4task2_title = "Mission 4, Task 2:";
briefs.mission4task2_text = "Well done!  Nano-Builder deployment successful. <br><br>Unfortunately, the spot where we had you place this first triangle is awfully close to that cliff wall, and so it will be in the shade much of the time.  Let’s translate the triangle 10 spaces to the right.  “Translate” is just a fancy word that means that we’re going to move the triangle, and it’s accomplished by adding (or subtracting) the appropriate amount to the X and Y values for each vertex.  In this case, we want to move 10 spaces in the positive X direction, so you just need to add 10 to the X value of each vertex.";
briefs.mission4task3_title = "Mission 4, Task 3:";
briefs.mission4task3_text = "Good work!  Now that you’ve got that initial triangle drawn, let’s Dilate it, which means that we’re going to scale it (change its size), to make it bigger.  When the triangle is at the origin, as this one happens to be, you can dilate it simply by multiplying the X and Y values of each of its vertices by magnitude of the change you want to make.  In this case we want to make the triangle twice as big, so you can multiply the X and Y values of each vertex by 2.";
briefs.mission4task4_title = "Mission 4, Task 4:";
briefs.mission4task4_text = "Excellent!  That section is set.  Let’s lay out some more sections before we activate the Nano-Builders and construct our new solar panels. <br><br>For the next section, we rather than specifying a new set of vertices, let’s just reflect our first big triangle across the Y axis.  You can do this by multiplying each of the X values by -1 (note that to reflect across the Y axis you negate the X values and, similarly, to reflect across the X axis you negate the Y values).";
briefs.mission4task5_title = "Mission 4, Task 5:";
briefs.mission4task5_text = "Well done!  Let’s reflect that first large triangle again, but across the X axis this time.";
briefs.mission4task6_title = "Mission 4, Task 6:";
briefs.mission4task6_text = "Almost there!  Let’s make one more triangle by reflecting the original large triangle across both the X and Y axes.";

var briefOpenButton = document.getElementById( "missionBriefOpen" );
briefOpenButton.onclick = openCurrentMissionBrief;
var briefContinueButton = document.getElementById( "missionBriefContinue" );
briefContinueButton.onclick = hideMissionBrief;
var briefTitle = document.getElementById( "missionBriefTitle" );
var briefText = document.getElementById( "missionBriefContent" );
var briefWrapper = document.getElementById( "missionBriefWrapper" );
var briefWindow = document.getElementById( "missionBriefBackground" );

function showMissionBrief( missionName ) {
    var title, text;
    title = briefs[ missionName + "_title" ];
    text = briefs[ missionName + "_text" ];
    if ( title && text ) {
        briefTitle.innerHTML = title;
        briefText.innerHTML = text;
        briefWrapper.style.display = "block";
        briefWindow.style.display = "block";
    } else {
        hideMissionBrief();
    }
}

function openCurrentMissionBrief() {
    showMissionBrief( currentScenario );
}

function hideMissionBrief() {
    briefWindow.style.display = "none";
}

//@ sourceURL=source/view/missionBriefs.js