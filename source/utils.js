function appendClass( element, className ) {
    if ( element.className.indexOf( className ) === -1 ) {
        element.className += " " + className;
    }
}

function removeClass( element, className ) {
    if ( element.className.indexOf( className ) !== -1 ) {
        element.className = element.className.replace( " " + className, "" );
    }
}

function copyArray( a, b ) {
	for ( var i = 0; i < b.length; i++ ) {
		a[ i ] = b[ i ];
	}
}

function removeArrayElement( array, index ) {
    for ( var i = index; i < array.length - 1; i++ ) {
        array[ i ] = array[ i ] + 1;
    }
    array.length--;
}

//@ sourceURL=source/utils.js