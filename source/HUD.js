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
    sortedElements: undefined,
    picks: undefined,
    canvas: undefined,
    visible: undefined,
    defaultHandlers: undefined,

    initialize: function() {
        this.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 10 );
        this.scene = new THREE.Scene();
        this.quad = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), null );
        this.scene.add( this.quad );
        this.elements = {};
        this.elementCount = 0;
        this.sortedElements = [];
        this.picks = [];
        this.canvas = document.createElement('CANVAS');
        this.quad.material = new THREE.MeshBasicMaterial();
        this.quad.material.map = new THREE.Texture( this.canvas );
        this.quad.material.transparent = true;
        this.visible = true;
        this.update();
        var gameCanvas = document.getElementById( vwf_view.kernel.application() );
        this.defaultHandlers = {};
        this.registerEventListeners( gameCanvas );
    },

    update: function() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        if ( this.visible ) {
            this.draw();
        }
        this.quad.material.map.needsUpdate = true;
        this.quad.material.needsUpdate = true;
    },

    draw: function() {
        var context = this.canvas.getContext( '2d' );
        this.sortedElements.length = 0;

        for ( var el in this.elements ) {
            var element = this.elements[ el ];
            element.position.x = 0;
            element.position.y = 0;

            switch ( element.alignH ) {
                case "left":
                    element.position.x = 0;
                    break;
                case "center":
                    element.position.x = -element.width / 2;
                    element.position.x += this.canvas.width / 2;
                    break;
                case "right":
                    element.position.x = -element.width;
                    element.position.x += this.canvas.width;
                    break;
            }

            switch ( element.alignV ) {
                case "top":
                    element.position.y = 0;
                    break;
                case "middle":
                    element.position.y = -element.height / 2;
                    element.position.y += this.canvas.height / 2;
                    break;
                case "bottom":
                    element.position.y = -element.height;
                    element.position.y += this.canvas.height;
                    break;
            }

            element.position.x += element.offset.x;
            element.position.y += element.offset.y;

            if ( element.visible ) {
                this.sortedElements.push( element );
            }
        }

        this.sortedElements.sort( this.sortFunction );
        for ( var i = 0; i < this.sortedElements.length; i++ ) {
            this.sortedElements[ i ].draw( context, this.sortedElements[ i ].position );
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

    sortFunction: function( a, b ) {
        return a.drawOrder - b.drawOrder;
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
        // Use sortedElements since they are all visible
        var elements = this.sortedElements;
        this.picks.length = 0;
        // Loop backward to order picks from nearest to furthest
        for ( var i = elements.length - 1; i >= 0; i-- ) {
            var pos = elements[ i ].position;
            var width = pos.x + elements[ i ].width;
            var height = pos.y + elements[ i ].height;

            if ( event.clientX > pos.x && event.clientX < width && 
                 event.clientY > pos.y && event.clientY < height ) {

                if ( elements[ i ].isMouseOver !== true ) {
                    elements[ i ].isMouseOver = true;
                    elements[ i ].onMouseOver( event );
                }
                this.picks.push( elements[ i ] );

            } else if ( elements[ i ].isMouseOver === true ) {
                elements[ i ].isMouseOver = false;
                elements[ i ].onMouseOut( event );
            }
        }
    },

    registerEventListeners: function( gameCanvas ) {
        var emptyEvent = function( event ) {};
        this.defaultHandlers.onClick = gameCanvas.onclick;
        gameCanvas.onclick = emptyEvent;
        gameCanvas.addEventListener( "click", this.handleEvent.bind( this ) );

        this.defaultHandlers.onMouseUp = gameCanvas.onmouseup;
        gameCanvas.onmouseup = emptyEvent;
        gameCanvas.addEventListener( "mouseup", this.handleEvent.bind( this ) );

        this.defaultHandlers.onMouseDown = gameCanvas.onmousedown;
        gameCanvas.onmousedown = emptyEvent;
        gameCanvas.addEventListener( "mousedown", this.handleEvent.bind( this ) );

        this.defaultHandlers.onMouseMove = gameCanvas.onmousemove;
        gameCanvas.onmousemove = emptyEvent;
        gameCanvas.addEventListener( "mousemove", this.handleEvent.bind( this ) );
    },

    handleEvent: function( event ) {
        this.pick( event );
        var topPick = this.picks[ 0 ];
        var type;

        switch ( event.type ) {
            case "click":
                type = "onClick";
                break;
            case "mouseup":
                type = "onMouseUp";
                break;
            case "mousedown":
                type = "onMouseDown";
                break;
            case "mousemove":
                type = "onMouseMove";
                break;
            default:
                console.log( "HUD.handleEvent - Unhandled event type: " + event.type );
                return;
        }

        if ( topPick ) {
            this.elements[ topPick.id ][ type ]( event );
        } else if ( this.defaultHandlers[ type ] instanceof Function ) {
            this.defaultHandlers[ type ]( event );
        }
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