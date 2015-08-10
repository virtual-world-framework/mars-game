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

function showTooltip( x, y, content ) {
    var tooltip = document.createElement( "div" );
    tooltip.className = "tooltip";
    tooltip.innerHTML = tooltipContentToHTML( content );
    tooltip.style.position = "absolute";

    $( "#blocklyWrapper" ).append( tooltip );
    //document.body.appendChild( tooltip );

    document.addEventListener("click", removeTooltipClick);
    document.addEventListener("mousemove", removeTooltipHoverout);
    // Return an empty string because blockly gets mad if we don't
    return "";
}

function showTooltipInBlockly( block, content ) {
    if ( block && block.isInFlyout ) {

        //var pos = block.getRelativeToSurfaceXY();
        //var dim = block.getHeightWidth();        
        //var offsetX = parseInt( $( "#blocklyWrapper" ).css( "right" ) );
        //var offsetY = parseInt( $( "#blocklyWrapper" ).css( "bottom" ) ); 
        //return showTooltip( pos.x + offsetX, pos.y + offsetY, content );
        return showTooltip(0,0,content);
   }
    return "";
}

function removeTooltipHoverout(event){

    if(!(event.target.getAttribute("class") == "blocklyPath" || 
        event.target.getAttribute("class") == "blocklyText" || 
        event.target.parentNode.getAttribute("class") == "blocklyEditableText" ||
        event.target.parentNode.getAttribute("class"))){
        $(".tooltip").remove();
        document.removeEventListener("mousemove",removeTooltipHoverout);
        
    }
}

function removeTooltipClick(event){
    $(".tooltip").remove();
    document.removeEventListener("click",removeTooltipClick);
}

function tooltipContentToHTML( content ) {

    if ( content ) {
        var returnImg = content.imagePath ? "<img src=" + content.imagePath + " />" : "";
        var returnText = "<p>" + content.text + "</p>"; 
        return returnImg + returnText;
    }
    return "";
}

//@ sourceURL=source/tooltips.js