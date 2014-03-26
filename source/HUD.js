HUD = function() {

	this.initialize();
	return this;

}

HUD.prototype = {

	constructor: HUD,
	scene: undefined,
	camera: undefined,
	quad: undefined,
	elements: undefined,

	initialize: function() {

		this.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 10 );
		this.scene = new THREE.Scene();
		this.quad = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), null );
		this.scene.add( this.quad );
		this.elements = {};
		this.update();

	},

	update: function() {

		var canvas = document.createElement('CANVAS');
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		this.draw( canvas );
		texture = new THREE.Texture( canvas );
		texture.needsUpdate = true;
		this.quad.material = new THREE.MeshBasicMaterial( { map: texture, transparent: true } );

	},

	draw: function( canvas ) {

		var context = canvas.getContext( '2d' );

	    var els = this.elements;
	    var anchor = {
	    	"x": 0,
	    	"y": 0
	    }

	    for ( el in els ) {

	    	switch ( els[ el ].alignX ) {

	    		case "left":
	    			anchor.x = 0;
	    			break;

	    		case "center":
	    			anchor.x = -els[ el ].width / 2;
	    			anchor.x += canvas.width / 2;
	    			break;

	    		case "right":
	    			anchor.x = -els[ el ].width;
	    			anchor.x += canvas.width;
	    			break;

	    	}

	    	switch ( els[ el ].alignY ) {

	    		case "top":
	    			anchor.y = 0;
	    			break;

	    		case "middle":
	    			anchor.y = -els[ el ].height / 2;
	    			anchor.y += canvas.height / 2;
	    			break;

	    		case "bottom":
	    			anchor.y = -els[ el ].height;
	    			anchor.y += canvas.height;
	    			break;

	    	}

	    	anchor.x += els[ el ].offset.x;
	    	anchor.y += els[ el ].offset.y;

	    	els[ el ].draw( context, anchor );

	    	anchor = {
		    	"x": 0,
		    	"y": 0
		    }

	    }

	},

	createElement: function( id, alignX, alignY, offset, params ) {

		// id - Identifier for the element
		// alignX - left, center, right
		// alignY - top, middle, bottom
		// offset - { x, y } Number of pixels the element is offset from the alignment
		// ----- Params -----
		// width - How long the element is (used for positioning)
		// height - How tall the element is (used for positioning)
		// images - An object list of IDs and image src paths
		// vars - An object containing the variables used to render the element
		// drawFunc - Custom function reference to draw the element

		// Initialize the HUD element
		var width = params[ "width" ] || 0;
		var height = params[ "height" ] || 0;
		var df = params[ "drawFunc" ];
		var el = new HUD.Element( id, width, height, df );

		// Add the images to the element
		var imgs = params[ "images" ];

		for ( img in imgs ) {

			el.images.add( img, imgs[ img ] );

		}

		// Set the properties of the element
		var props = params[ "vars" ];

		for ( prop in props ) {

			el.properties.set( prop, props[ prop ] );

		}
		
		// Add the element to the HUD's elements list
		// Initialize the offset position
		this.elements[ id ] = el;
		this.elements[ id ][ "offset" ] = {
			"x": offset.x || 0,
			"y": offset.y || 0
		};

		switch ( alignX.toLowerCase() ) {

			case "left":
			case "center":
			case "right":
				this.elements[ id ][ "alignX" ] = alignX.toLowerCase();
				break;
			default:
				this.elements[ id ][ "alignX" ] = "left";
				break;

		}

		switch ( alignY.toLowerCase() ) {

			case "top":
			case "middle":
			case "bottom":
				this.elements[ id ][ "alignY" ] = alignY.toLowerCase();
				break;
			default:
				this.elements[ id ][ "alignY" ] = "top";
				break;

		}

	}

}

HUD.Element = function( id, width, height, drawFunc ) {

	this.initialize( id, width, height, drawFunc );
	return this;

}

HUD.Element.prototype = {

	constructor: HUD.Element,
	id: undefined,
	width: undefined,
	height: undefined,

	images: {

		add: function( imageID, imageSrc ) {

			this[ imageID ] = new Image();
			this[ imageID ].src = imageSrc;

		}

	},

	properties: {

		set: function( propertyID, propertyValue ) {

			this[ propertyID ] = propertyValue;

		}

	},

	initialize: function( id, width, height, drawFunc ) {

		this.id = id;
		this.width = width;
		this.height = height;

		if ( drawFunc instanceof Function ) {

			this.draw = drawFunc;

		}

	},

	draw: function( context, position ) { }
}