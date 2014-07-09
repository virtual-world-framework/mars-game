function showTooltip( x, y, width, height, content ) {
    var tooltip = document.createElement( "div" );
    tooltip.className = "tooltip";
    tooltip.innerHTML = content;
    tooltip.style.left = x + "px";
    tooltip.style.top = y + "px";
    tooltip.style.width = width + "px";
    tooltip.style.height = height + "px";
    document.body.appendChild( tooltip );

    document.onmousemove = function() {
        $( ".tooltip" ).fadeOut( function() {
            document.body.removeChild( "fast", tooltip );
            delete tooltip;
        } );
    }

    // Return an empty string because blockly gets mad if we don't
    return "";
}

//@ sourceURL=source/tooltips.js