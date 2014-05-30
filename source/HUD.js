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
    elementCount: undefined,
    canvas: undefined,
    visible: undefined,

    initialize: function() {

        this.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 10 );
        this.scene = new THREE.Scene();
        this.quad = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), null );
        this.scene.add( this.quad );
        this.elements = {};
        this.elementCount = 0;
        this.canvas = document.createElement('CANVAS');
        this.visible = true;
        this.update();

        var gameCanvas = document.getElementById( vwf_view.kernel.application() );
        this.registerEventListeners( gameCanvas );

    },

    update: function() {

        var canvas = this.canvas;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Draw the HUD to a canvas
        if ( this.visible ) {
            this.draw( canvas );
        }

        // Dispose of the last HUD texture
        var texture;
        if ( this.quad.material && this.quad.material.map ) {
            texture = this.quad.material.map;
            this.quad.material.map = undefined;
            texture.dispose();
        }

        // Create a material using the HUD canvas as the source texture
        texture = new THREE.Texture( canvas );
        texture.needsUpdate = true;
        this.quad.material = new THREE.MeshBasicMaterial( { map: texture, transparent: true, opacity: 0.85 } );

    },

    draw: function( canvas ) {

        var context = canvas.getContext( '2d' );

        var els = this.elements;

        var orderedElements = new Array();

        for ( var el in els ) {

            var anchor = {
                "x": 0,
                "y": 0
            }

            switch ( els[ el ].alignH ) {

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

            switch ( els[ el ].alignV ) {

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

            els[ el ].position = anchor;

            orderedElements.push( els[ el ] );

        }

        orderedElements.sort( function( a, b ) {
            return a.drawOrder - b.drawOrder;
        } );

        for ( var i = 0; i < orderedElements.length; i++ ) {

            if ( orderedElements[i].visible ) {

                orderedElements[i].draw( context, orderedElements[i].position );

            }

        }

    },

    add: function( element, alignH, alignV, offset ) {

        // Add the element to the HUD's elements list
        // Initialize the offset position
        this.elements[ element.id ] = element;

        if ( offset && !( isNaN( offset.x ) || isNaN( offset.y ) ) ) {

            this.elements[ element.id ][ "offset" ] = {
                "x": offset.x,
                "y": offset.y
            };

        } else {

            this.elements[ element.id ][ "offset" ] = {
                "x": 0,
                "y": 0
            };

        }
        
        this.elements[ element.id ][ "position" ] = {
            "x": 0,
            "y": 0
        }

        switch ( alignH ) {

            case "left":
            case "center":
            case "right":
                this.elements[ element.id ][ "alignH" ] = alignH;
                break;
            default:
                this.elements[ element.id ][ "alignH" ] = "left";
                break;

        }

        switch ( alignV ) {

            case "top":
            case "middle":
            case "bottom":
                this.elements[ element.id ][ "alignV" ] = alignV;
                break;
            default:
                this.elements[ element.id ][ "alignV" ] = "top";
                break;

        }

        this.countElements();

        this.elements[ element.id ][ "drawOrder" ] = this.elementCount;

    },

    remove: function( element ) {

        var index = this.elements[ element.id ].drawOrder;
        delete this.elements[ element.id ];

        for ( var el in this.elements ) {
            if ( this.elements[ el ].drawOrder > index ) {
                this.elements[ el ].drawOrder--;
            }
        }

        this.countElements();
    },

    countElements: function() {
        var count = 0;

        for ( var el in this.elements ) {
            count++;
        }

        this.elementCount = count;
    },

    pick: function( event ) {

        var picks = new Array();
        var els = this.elements;
        var coords = {
            "x": event.clientX,
            "y": event.clientY
        }

        for ( var el in els ) {

            // Ignore picks on hidden elements
            if ( els[ el ].visible !== true ) {
                continue;
            }
            
            var v1 = els[ el ].position;
            var v2 = { 
                "x": v1.x + els[ el ].width,
                "y": v1.y + els[ el ].height
            }

            if ( coords.x > v1.x && coords.x < v2.x && coords.y > v1.y && coords.y < v2.y ) {

                if ( els[ el ].isMouseOver !== true ) {

                    els[ el ].isMouseOver = true;
                    els[ el ].onMouseOver( event );

                }

                picks.push( els[ el ] );

            } else if ( els[ el ].isMouseOver === true ) {

                els[ el ].isMouseOver = false;
                els[ el ].onMouseOut( event );

            }

        }

        return picks;

    },

    registerEventListeners: function( gameCanvas ) {

        gameCanvas.addEventListener( "click", ( function( event ) { 
            
            var picks = this.pick( event );
            var topPick = this.getTopElement( picks );

            if ( topPick !== null ) {
                this.elements[ topPick.id ].onClick( event );
            }
            
        } ).bind(this) );

        gameCanvas.addEventListener( "mouseup", ( function( event ) { 
            
            var picks = this.pick( event );
            var topPick = this.getTopElement( picks );

            if ( topPick !== null ) {
                this.elements[ topPick.id ].onMouseUp( event );
            }
            
        } ).bind(this) );

        gameCanvas.addEventListener( "mousedown", ( function( event ) { 
            
            var picks = this.pick( event );
            var topPick = this.getTopElement( picks );

            if ( topPick !== null ) {
                this.elements[ topPick.id ].onMouseDown( event );
            }
            
        } ).bind(this) );

        gameCanvas.addEventListener( "mousemove", ( function( event ) { 
            
            var picks = this.pick( event );
            var topPick = this.getTopElement( picks );

            if ( topPick !== null ) {
                this.elements[ topPick.id ].onMouseMove( event );
            }
            
        } ).bind(this) );

    },

    getTopElement: function( elements ) {

        var el = null;

        for ( var i = 0; i < elements.length; i++ ) {

            if ( el === null || elements[i].drawOrder > el.drawOrder ) {
                el = elements[i];
            }

        }

        return el;
    },

    moveToTop: function( id ) {
        var index = this.elements[ id ].drawOrder;
        for ( var el in this.elements ) {
            if ( this.elements[ el ].drawOrder > index ) {
                this.elements[ el ].drawOrder--;
            }
        }
        this.elements[ id ].drawOrder = this.elementCount;
    }

}

HUD.Element = function( id, drawFunc, width, height, visible ) {

    this.initialize( id, drawFunc, width, height );
    return this;

}

HUD.Element.prototype = {

    constructor: HUD.Element,
    id: undefined,
    width: undefined,
    height: undefined,
    isMouseOver: undefined,
    visible: undefined,

    initialize: function( id, drawFunc, width, height, visible ) {

        this.id = id;

        if ( drawFunc instanceof Function ) {

            this.draw = drawFunc;

        }

        this.width = isNaN( width ) ? 0 : width;
        this.height = isNaN( height ) ? 0 : height;

        if ( visible === true || visible === undefined ) {

            this.visible = true;

        } else {

            this.visible = false;

        }

    },

    draw: function( context, position ) { },

    onClick: function( event ) { },

    onMouseDown: function( event ) { },

    onMouseUp: function( event ) { },

    onMouseMove: function( event ) { },

    onMouseOver: function( event ) { },

    onMouseOut: function( event ) { }

} //@ sourceURL=source/hud.js