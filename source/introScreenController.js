var div;
var images;
var index;

function setUpIntro() {
    div = document.createElement( 'DIV' );
    vwfroot = document.getElementById('vwf-root');

    images = [];

    //for each in directory of images
    var image = document.createElement( 'img' );
    image.src = '../assets/images/birdseye.png';
    images.push( image );
    var image = document.createElement( 'img' );
    image.src = '../assets/images/birdseye2.png';
    images.push(image);

    index = 0;
    nextIntroSlide();

    document.body.appendChild( div );
}

function nextIntroSlide() {
    if ( index >= images.length ){
        document.body.removeChild( div );
        delete div;
    }
    else{
        if (index != 0){
            div.removeChild(div.firstChild);
        }
        div.appendChild(images[index++]);
    }
}

//@ sourceURL=source/introScreenController.js