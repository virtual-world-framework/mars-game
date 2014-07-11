function showTooltip( x, y, width, height, content ) {
    var tooltip = document.createElement( "div" );
    tooltip.className = "tooltip";
    tooltip.innerHTML = content;
    tooltip.style.left = x + "px";
    tooltip.style.top = y + "px";
    tooltip.style.width = width + "px";
    tooltip.style.height = height + "px";
    document.body.appendChild( tooltip );

    document.addEventListener( "mousemove", removeTooltip );

    // Return an empty string because blockly gets mad if we don't
    return "";
}

function showTooltipInBlockly( blockPos, width, height, content ) {
    var offsetX = parseInt( $( "#blocklyWrapper" ).css( "left" ) );
    var offsetY = parseInt( $( "#blocklyWrapper" ).css( "top" ) ) + parseInt( $( "#blocklyWrapper-top" ).css( "height" ));
    return showTooltip( blockPos.x + offsetX, blockPos.y + offsetY, width, height, content );
}

function removeTooltip() {
    $( ".tooltip" ).fadeOut( function() {
        $( ".tooltip" ).remove();
        document.removeEventListener( "mousemove", removeTooltip);
    } );
}

//@ sourceURL=source/tooltips.js