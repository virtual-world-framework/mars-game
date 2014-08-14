MainMenu = function() {
    this.initialize();
    return this;
}

MainMenu.prototype = {
    constructor: MainMenu,
    scene: undefined,
    camera: undefined,
    overlay: undefined,
    assetsLoaded: undefined,
    firstRender: undefined,
    active: undefined,

    initialize: function() {
        this.assetsLoaded = false;
        this.firstRender = true;
        this.active = true;
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
        this.scene.fog = new THREE.Fog( 0xFFFFFF, 4, 30 );
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

    loadAssets: function() {},

    placeRover: function( collada ) {
        var rover = collada.scene;
        rover.position.set( 2, 5, 0 );
        rover.rotateZ( Math.PI / 1.5 );
        this.scene.add( rover );
        this.assetsLoaded = true;
    },

    updateMenuCamera: function() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    },

    render: function( renderer ) {
        if ( this.firstRender ) {
            this.overlay.style.display = "block";
            renderer.setClearColor( this.scene.fog.color );
            this.firstRender = false;
        }
        renderer.render( this.scene, this.camera );
    },

    playGame: function() {
        this.overlay.style.display = "none";
        this.active = false;
    }
}

//@ sourceURL=source/mainMenu.js