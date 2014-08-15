MainMenu = function() {
    this.initialize();
    return this;
}

MainMenu.prototype = {
    constructor: MainMenu,
    scene: undefined,
    camera: undefined,
    overlay: undefined,

    initialize: function() {
        this.delayMenu = 5;
        this.createScene();
        this.createOverlay();
    },

    createScene: function() {
        var loader, rover, geo, ground, groundMat, light, ambient;
        this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
        window.addEventListener( "resize", this.updateMenuCamera.bind( this ) );
        this.camera.position.set( 0, 0, 2.5 );
        this.camera.rotateX( Math.PI / 2.3 );
        this.scene = new THREE.Scene();
        loader = new THREE.ColladaLoader();
        loader.load( "assets/3d/Rover/rover_retro.dae", this.placeRover.bind( this ) );
        light = new THREE.SpotLight( 0xffffff, 1, 0, Math.PI / 2, 1 );
        light.intensity = 1;
        light.position.set( -2, 0, 6 );
        ambient = new THREE.AmbientLight( 0xCCCCCC );
        groundMat = new THREE.MeshPhongMaterial( { color: 0xFFFFFF } );
        geo = new THREE.PlaneGeometry( 100, 100 );
        ground = new THREE.Mesh( geo, groundMat );
        this.scene.add( light );
        this.scene.add( ambient );
        this.scene.add( ground );
    },

    createOverlay: function() {
        var playButton;
        this.overlay = document.createElement( "div" );
        this.overlay.id = "MainMenu-Wrapper";
        this.overlay.style.display = "none";
        playButton = document.createElement( "div" );
        playButton.id = "MainMenu-Play";
        playButton.className = "MainMenu-Button"
        playButton.innerHTML = "Play Game";
        playButton.onmouseover = function( event ) {
            appendClass( this, "hover" );
        }
        playButton.onmouseout = function( event ) {
            removeClass( this, "hover" );
            removeClass( this, "select" );
        }
        playButton.onmousedown = function( event ) {
            removeClass( this, "hover" );
            appendClass( this, "select" );
        }
        playButton.onclick = this.playGame.bind( this );
        this.overlay.appendChild( playButton );
        document.body.appendChild( this.overlay );
    },

    placeRover: function( collada ) {
        var rover = collada.scene;
        rover.position.set( 1.5, 5, 0 );
        rover.rotateZ( Math.PI / 1.5 );
        this.scene.add( rover );
        $( "#transitionScreen" ).fadeOut( "slow" );
    },

    updateMenuCamera: function() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    },

    setupRenderer: function( renderer ) {
        this.overlay.style.display = "block";
        this.scene.fog = new THREE.FogExp2( 0xFFFFFF, 0.04);
        renderer.setClearColor( this.scene.fog.color );
    },

    render: function( renderer ) {
        var theta = Date.now() / 300 % 360 * Math.PI;
        this.camera.position.set( Math.sin( theta / 100 ) / 2, 0, 2 + Math.cos( theta / 60 ) / 5 );
        renderer.render( this.scene, this.camera );
    },

    playGame: function() {
        this.overlay.style.display = "none";
        vwf_view.kernel.fireEvent( vwf_view.kernel.application(), "gameStarted" );
    }
}

//@ sourceURL=source/mainMenu.js