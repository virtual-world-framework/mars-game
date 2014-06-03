var intro;

function setUpIntro() {

    intro = {
        "div" : document.createElement( 'div' ),
        "image" : document.createElement( 'img' ),
        "imagePaths" : [],
        "index" : -1,
        "numberOfScreens" : 3
    };

    intro.div.id = "introScreen";
    intro.div.style.height = "100%";
    intro.div.style.width = "100%";
    intro.div.style.position = "absolute";
    intro.div.style.top = "0";
    intro.div.style.left = "0";
    intro.div.style.backgroundColor = "#000";

    intro.image.className = "introImage";
    intro.image.style.margin = "-384px 0 0 -512px";
    intro.image.style.top = "50%";
    intro.image.style.left = "50%";
    intro.image.style.position = "absolute";
    intro.image.onclick = nextIntroSlide;    

    var dir = "../assets/images/introScreens/";
    for ( var i = 0; i < intro.numberOfScreens; i++ ) {
        intro.imagePaths.push( dir + "screen" + i + ".png" );
    }

    document.body.appendChild( intro.div );
    intro.div.appendChild( intro.image );

    nextIntroSlide();
}

function nextIntroSlide() {

    if ( intro.div ) {
        intro.index++;

        //If we're at the end of the deck, remove the intro screen div
        if ( intro.index > intro.imagePaths.length - 1 ) {
            $( "#transitionScreen" ).fadeIn( function() {
                document.body.removeChild( intro.div );
                delete intro.div;
                $( "#transitionScreen" ).fadeOut();
            } );      
        }

        //Otherwise, move to next screen
        else {
            $( "#transitionScreen" ).fadeIn( function() {
                intro.image.src = intro.imagePaths[ intro.index ];
                intro.image.onload = $( "#transitionScreen" ).fadeOut();
            } );
        }
    }
}

function prevIntroSlide() {

    if ( ( intro.div ) && ( intro.index > 0 ) ) {
        intro.index--;
        $( "#transitionScreen" ).fadeIn( function() {
            intro.image.src = intro.imagePaths[ intro.index ];
            intro.image.onload = $( "#transitionScreen" ).fadeOut();
        } );
    }
}

//@ sourceURL=source/introScreenController.js