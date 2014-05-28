var div;
var images;
var index;
var numberOfScreens;

function setUpIntro() {
    div = document.createElement( 'div' );
    div.id = "introScreen";
    div.onclick = nextIntroSlide;
    div.style.height = "256px";
    div.style.width = "512px";
    div.style.marginLeft = "-256px";
    div.style.marginTop = "-128px";
    div.style.position = "absolute";
    div.style.top = "50%";
    div.style.left = "50%";
    div.style.backgroundColor = "#424242";

    images = [];
    numberOfScreens = 3;

    var dir = "../assets/images/introScreens/";
    for ( var i = 0; i < numberOfScreens; i++ ) {
        var image = document.createElement( 'img' );
        image.src = dir + "screen" + i + ".png";
        image.style.display = "block";
        image.style.marginLeft = "auto";
        image.style.marginRight = "auto";
        image.style.marginTop = "15%";
        images.push( image );
    }


    index = 0;
    nextIntroSlide();

    document.body.appendChild( div );
}

function nextIntroSlide() {
    if ( index > images.length - 1 ) {
        if ( div ){
            document.body.removeChild( div );
            delete div;
        }
    }
    else {
        if ( index != 0 ){
            div.removeChild( div.firstChild );
        }
        div.appendChild( images[ index++ ] );
    }
}

function prevIntroSlide() {
    if ( index > 0 ) {
        div.removeChild( div.lastChild );
        div.appendChild( images[ --index ] );
    }
}

//@ sourceURL=source/introScreenController.js