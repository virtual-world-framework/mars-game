var div;
var images;
var index;
var numberOfScreens;

function setUpIntro() {
    div = document.createElement( 'div' );
    div.id = "introScreen";
    div.style.height = "100%";
    div.style.width = "100%";
    div.style.position = "absolute";
    div.style.top = "0";
    div.style.left = "0";
    div.style.backgroundColor = "#000";

    images = [];
    numberOfScreens = 3;

    var dir = "../assets/images/introScreens/";
    for ( var i = 0; i < numberOfScreens; i++ ) {
        var image = document.createElement( 'img' );
        image.src = dir + "screen" + i + ".png";
        image.style.margin = "-384px 0 0 -512px";
        image.style.top = "50%";
        image.style.left = "50%";
        image.style.position = "absolute";
        image.onclick = nextIntroSlide;
        images.push( image );
    }

    document.body.appendChild( div );

    index = -1;
    nextIntroSlide();
}

function nextIntroSlide() {

    if ( div ) {
        index++;

        //If we're at the end of the deck, remove the intro screen div
        if ( index > images.length - 1 ) {
            document.body.removeChild( div );
            delete div;
        }

        //Otherwise, move to next screen
        else {
            if ( index != 0 ){
                div.removeChild( div.lastChild );
            }
            div.appendChild( images[ index ] );
        }
    }
}

function prevIntroSlide() {

    if ( ( div ) && ( index > 0 ) ) {
        index--;
        div.removeChild( div.lastChild );
        div.appendChild( images[ index ] );
    }
}

//@ sourceURL=source/introScreenController.js