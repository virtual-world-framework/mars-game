var intro;

function setUpIntro() {

    intro = {
        "div" : document.createElement( 'div' ),
        "image" : document.createElement( 'img' ),
        "imagePaths" : [],
        "index" : -1,
        "numberOfScreens" : 4
    };

    intro.div.id = "introScreen";
    intro.div.onclick = nextIntroSlide;

    intro.image.className = "introImage";

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

            // Fire an event on the model side to let things know that the 
            //  intro is complete.
            vwf_view.kernel.fireEvent( vwf_view.kernel.application(),
                                       "introScreensComplete",
                                       [] );
        }

        //Otherwise, move to next screen
        else {
            $( "#transitionScreen" ).fadeIn( function() {
                intro.image.src = intro.imagePaths[ intro.index ];
                intro.image.onload = function() {
                    $( "#transitionScreen" ).fadeOut();
                };
            } );
        }
    }
}

function prevIntroSlide() {

    if ( ( intro.div ) && ( intro.index > 0 ) ) {
        intro.index--;
        $( "#transitionScreen" ).fadeIn( function() {
            intro.image.src = intro.imagePaths[ intro.index ];
            intro.image.onload = function() {
                $( "#transitionScreen" ).fadeOut();
            };
        } );
    }
}

//@ sourceURL=source/introScreenController.js