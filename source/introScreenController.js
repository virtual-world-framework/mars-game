var intro;

function setUpIntro( imagePathArray ) {
    intro = {
        "div" : document.createElement( 'div' ),
        "image" : document.createElement( 'img' ),
        "imagePaths" : imagePathArray || new Array(),
        "index" : -1
    };
    intro.div.id = "introScreen";
    intro.div.onclick = nextIntroSlide;
    intro.image.className = "introImage";
    document.body.appendChild( intro.div );
    intro.div.appendChild( intro.image );
    nextIntroSlide();
}

function nextIntroSlide() {
    if ( intro.div ) {
        intro.index++;
        if ( intro.index > intro.imagePaths.length - 1 ) {
            $( "#transitionScreen" ).fadeIn( removeIntroDiv );
            vwf_view.kernel.fireEvent( vwf_view.kernel.application(), "introScreensComplete" );
        } else {
            $( "#transitionScreen" ).fadeIn( advanceSlide );
        }
    }
}

function prevIntroSlide() {
    if ( intro.div && intro.index > 0 ) {
        intro.index--;
        $( "#transitionScreen" ).fadeIn( advanceSlide );
    }
}

function removeIntroDiv() {
    document.body.removeChild( intro.div );
    $( "#transitionScreen" ).fadeOut();
}

function advanceSlide() {
    intro.image.src = intro.imagePaths[ intro.index ];
    intro.image.onload = fadeTransitionOut;
}

function fadeTransitionOut() {
    $( "#transitionScreen" ).fadeOut();
}

//@ sourceURL=source/introScreenController.js