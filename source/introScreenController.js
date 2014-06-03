var intro;

function setUpIntro() {

    intro = {
        "div" : document.createElement( 'div' ),
        "images" : [],
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

    var dir = "../assets/images/introScreens/";
    for ( var i = 0; i < intro.numberOfScreens; i++ ) {
        var image = document.createElement( 'img' );
        image.className = "introImage";
        image.src = dir + "screen" + i + ".png";
        image.style.margin = "-384px 0 0 -512px";
        image.style.top = "50%";
        image.style.left = "50%";
        image.style.position = "absolute";
        image.onclick = nextIntroSlide;
        intro.images.push( image );
    }

    document.body.appendChild( intro.div );

    nextIntroSlide();
}

function nextIntroSlide() {

    if ( intro.div ) {
        intro.index++;

        //If we're at the end of the deck, remove the intro screen div
        if ( intro.index > intro.images.length - 1 ) {
            $( ".introImage" ).fadeOut( function() {
                $( "#introScreen" ).fadeOut( function() {
                    document.body.removeChild( intro.div );
                    delete intro.div;
                } );        
            } );            
        }

        //Otherwise, move to next screen
        else {
            if ( intro.index != 0 ){
                $( ".introImage" ).fadeOut( function() {
                    intro.div.removeChild( intro.div.lastChild );
                    intro.div.appendChild( intro.images[ intro.index ] );
                    $( ".introImage" ).fadeIn();                    
                } );
            }
            else {
                intro.div.appendChild( intro.images[ intro.index ] );
                $( ".introImage" ).fadeIn();
            }
        }
    }
}

function prevIntroSlide() {

    if ( ( intro.div ) && ( intro.index > 0 ) ) {
        $( ".introImage" ).fadeOut( function() {
            intro.index--;
            intro.div.removeChild( intro.div.lastChild );
            intro.div.appendChild( intro.images[ intro.index ] );
            $( ".introImage" ).fadeIn();
        } );
    }
}

//@ sourceURL=source/introScreenController.js