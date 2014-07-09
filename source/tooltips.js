function showTooltip( x, y, width, height, content ) {
	var tooltip = document.createElement( "div" );
	tooltip.className = "tooltip";
	tooltip.innerHTML = content;
	tooltip.style.left = x + "px";
	tooltip.style.top = y + "px";
	tooltip.style.width = width + "px";
	tooltip.style.height = height + "px";

	tooltip.onmouseout = function() {
		document.body.removeChild( this );
		delete this;
	}

	document.body.appendChild( tooltip );

	// Return an empty string because blockly gets mad if we don't
	return "";
}

//@ sourceURL=source/tooltips.js