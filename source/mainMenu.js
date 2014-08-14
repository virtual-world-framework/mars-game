MainMenu = function() {
    this.initialize();
    return this;
}

MainMenu.prototype = {
    constructor: MainMenu,
    scene: undefined,
    camera: undefined,
    overlay: undefined,
    lastRenderTime: undefined,
    assetsLoaded: undefined,

    initialize: function() {
        this.assetsLoaded = false;
        this.delayMenu = 5;
        this.createScene();
        this.createOverlay();
    },

    createScene: function() {
        var loader, rover, geo, ground, wall, groundMat, light, ambient;
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
        wall = new THREE.Mesh( geo, groundMat );
        wall.rotateX( Math.PI / 2 );
        wall.position.set( 0, 50, 50 );
        this.scene.add( light );
        this.scene.add( ambient );
        this.scene.add( ground );
        this.scene.add( wall );
    },

    createOverlay: function() {
        var playButton;
        this.overlay = document.createElement( "div" );
        this.overlay.id = "MainMenu-Wrapper";
        playButton = document.createElement( "div" );
        playButton.id = "MainMenu-Play";
        playButton.innerHTML = "Play Game";
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
        var time = vwf_view.kernel.time();
        if ( this.assetsLoaded ) {
            renderer.render( this.scene, this.camera );
            this.lastRenderTime = time;
        }
    }
}

//@ sourceURL=source/mainMenu.js