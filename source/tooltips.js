function showTooltip( x, y, content ) {
    var tooltip = document.createElement( "div" );
    tooltip.className = "tooltip";
    tooltip.innerHTML = tooltipContentToHTML( content );
    tooltip.style.left = x + "px";
    tooltip.style.top = y + "px";
    document.body.appendChild( tooltip );

    document.addEventListener( "mousemove", removeTooltip );

    // Return an empty string because blockly gets mad if we don't
    return "";
}

function showTooltipInBlockly( block, content ) {
    if ( block && block.isInFlyout ) {
        var pos = block.getRelativeToSurfaceXY();
        var dim = block.getHeightWidth();        
        var offsetX = parseInt( $( "#blocklyWrapper" ).css( "left" ) ) + dim.width;
        var offsetY = parseInt( $( "#blocklyWrapper" ).css( "top" ) ) + parseInt( $( "#blocklyWrapper-top" ).css( "height" ));
        return showTooltip( pos.x + offsetX, pos.y + offsetY, content );
    }
    return "";
}

function removeTooltip() {
    $( ".tooltip" ).fadeOut( function() {
        $( ".tooltip" ).remove();
        document.removeEventListener( "mousemove", removeTooltip );
    } );
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