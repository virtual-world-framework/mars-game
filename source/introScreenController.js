var div;
var images;
var index;
var numberOfScreens;

function setUpIntro() {
    div = document.createElement( 'DIV' );

    images = [];
    numberOfScreens = 3;

    var dir = "../assets/images/introScreens/";
    for ( var i = 0; i < numberOfScreens; i++ ) {
        var image = document.createElement( 'img' );
        image.src = dir + "screen" + i + ".png";
        images.push( image );
    }


    index = 0;
    nextIntroSlide();

    document.body.appendChild( div );
}

function nextIntroSlide() {
    if ( index >= images.length ) {
        document.body.removeChild( div );
        delete div;
    }
    else {
        if ( index != 0 ){
            div.removeChild( div.firstChild );
        }
        div.appendChild( images[ index++ ] );
    }
}

//@ sourceURL=source/introScreenController.js