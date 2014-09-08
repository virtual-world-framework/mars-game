// Copyright 2014 Lockheed Martin Corporation
//
// Licensed under the Apache License, Version 2.0 (the "License"); you may 
// not use this file except in compliance with the License. You may obtain 
// a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software 
// distributed under the License is distributed on an "AS IS" BASIS, 
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and 
// limitations under the License.

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
        var playButton, settingsButton, backButton, volume, loginForm, loginTextBox, loginButton;

        this.overlay = document.createElement( "div" );
        this.overlay.id = "MainMenu-Wrapper";
        this.overlay.style.display = "none";

        this.overlay.mainMenu = document.createElement( "div" );
        this.overlay.mainMenu.id = "MainMenu-Main";
        // this.overlay.mainMenu.style.display = "none";

        playButton = document.createElement( "div" );
        playButton.id = "MainMenu-PlayButton";
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

        settingsButton = document.createElement( "div" );
        settingsButton.id = "MainMenu-SettingsButton";
        settingsButton.className = "MainMenu-Button"
        settingsButton.innerHTML = "Settings";
        settingsButton.onmouseover = function( event ) {
            appendClass( this, "hover" );
        }
        settingsButton.onmouseout = function( event ) {
            removeClass( this, "hover" );
            removeClass( this, "select" );
        }
        settingsButton.onmousedown = function( event ) {
            removeClass( this, "hover" );
            appendClass( this, "select" );
        }
        settingsButton.onclick = this.openSettings.bind( this );

        this.overlay.settingsMenu = document.createElement( "div" );
        this.overlay.settingsMenu.id = "MainMenu-Settings";
        this.overlay.settingsMenu.style.display = "none";

        backButton = document.createElement( "div" );
        backButton.id = "MainMenu-BackButton";
        backButton.className = "MainMenu-Button"
        backButton.innerHTML = "Back";
        backButton.onmouseover = function( event ) {
            appendClass( this, "hover" );
        }
        backButton.onmouseout = function( event ) {
            removeClass( this, "hover" );
            removeClass( this, "select" );
        }
        backButton.onmousedown = function( event ) {
            removeClass( this, "hover" );
            appendClass( this, "select" );
        }
        backButton.onclick = this.openMain.bind( this );

        volume = document.createElement( "div" );
        volume.id = "MainMenu-Volume";
        volume.mute = document.createElement( "div" );
        volume.mute.id = "MainMenu-MuteButton";
        volume.appendChild( volume.mute );
        volume.slider = document.createElement( "div" );
        volume.slider.id = "MainMenu-Slider";
        volume.appendChild( volume.slider );
        volume.slider.readout = document.createElement( "div" );
        volume.slider.readout.id = "MainMenu-Readout";
        volume.slider.appendChild( volume.slider.readout );
        volume.slider.handle = document.createElement( "div" );
        volume.slider.handle.id = "MainMenu-Handle";
        volume.slider.appendChild( volume.slider.handle );

        volume.mute.onclick = this.muteVolume.bind( this );
        volume.slider.onmousedown = this.moveVolumeSlider.bind( this );
        volume.slider.onmousemove = this.moveVolumeSlider.bind( this );
        volume.slider.onmouseout = this.moveVolumeSlider.bind( this );


        this.loginMenu = document.createElement( "div" );
        this.loginMenu.id = "loginBox";
        loginForm = document.createElement( "form" );
        loginForm.id = "loginForm";
        loginTextBox = document.createElement( "input" );
        loginTextBox.id = "idTextBox";
        loginTextBox.type = "text";
        loginButton = document.createElement( "input" );
        loginButton.id = "submitButton";
        loginButton.type = "button";
        loginButton.value = "Submit";
        loginForm.appendChild( loginTextBox );
        loginForm.appendChild( loginButton );
        this.loginMenu.appendChild( loginForm );
        this.overlay.appendChild( this.loginMenu );
        loginButton.onclick = this.submitUserID.bind( loginTextBox );

        this.overlay.mainMenu.appendChild( playButton );
        this.overlay.mainMenu.appendChild( settingsButton );
        this.overlay.settingsMenu.appendChild( backButton );
        this.overlay.settingsMenu.appendChild( volume );
        this.overlay.appendChild( this.overlay.mainMenu );
        this.overlay.appendChild( this.overlay.settingsMenu );
        document.body.appendChild( this.overlay );
    },

    placeRover: function( collada ) {
        var rover = collada.scene;
        rover.position.set( 1.5, 5, 0 );
        rover.rotateZ( Math.PI / 1.5 );
        this.scene.add( rover );
        $( "#transitionScreen" ).fadeOut();
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
    },

    openSettings: function() {
        // this.overlay.loginMenu.style.display = "none";
        this.overlay.mainMenu.style.display = "none";
        this.overlay.settingsMenu.style.display = "block";
        this.setVolumeSliderPosition( cachedVolume );
    },

    openMain: function() {
        // this.overlay.loginMenu.style.display = "none";
        this.overlay.settingsMenu.style.display = "none";
        this.overlay.mainMenu.style.display = "block";
    },

    setVolume: function( value ) {
        var sm, muteButton;
        sm = vwf_view.kernel.find( vwf_view.kernel.application(), "/soundManager" )[ 0 ];
        if ( sm ) {
            value = Math.min( 1, Math.max( 0, value ) );
            muteButton = document.getElementById( "MainMenu-MuteButton" );
            if ( value === 0 ) {
                appendClass( muteButton, "muted" );
                muted = true;
            } else {
                removeClass( muteButton, "muted" );
                muted = false;
                cachedVolume = value;
            }
            this.setVolumeSliderPosition( value );
            vwf_view.kernel.callMethod( sm, "setMasterVolume", [ value ] );
        }
    },

    moveVolumeSlider: function( event ) {
        var pct, handle, slider, deadzone;
        if ( event.which === 1 ) {
            handle = document.getElementById( "MainMenu-Handle" );
            slider = document.getElementById( "MainMenu-Slider" );
            deadzone = handle.clientWidth / 2;
            pct = ( event.offsetX - deadzone ) / ( slider.clientWidth - deadzone * 2 );
            this.setVolume( pct );
        }
    },

    muteVolume: function() {
        if ( muted ) {
            this.setVolume( cachedVolume );
        } else {
            this.setVolume( 0 );
        }
    },

    setVolumeSliderPosition: function( volume ) {
        var volumeHandle = document.getElementById( "MainMenu-Handle" );
        var deadzone = volumeHandle.clientWidth / 2;
        var pos = volume * ( volumeHandle.parentNode.clientWidth - deadzone * 2 );
        var readout, readoutPct;
        volumeHandle.style.marginLeft = pos + "px";
        readout = document.getElementById( "MainMenu-Readout" );
        readoutPct = volume * 100;
        readoutPct = Math.round( readoutPct );
        readout.innerHTML = "Volume: " + readoutPct + "%";
    },

    submitUserID: function() {
        var vwfScene = vwf_view.kernel.application();
        vwf_view.kernel.callMethod( vwfScene, "attemptLogin", [ this.value ] );
    },

    loggedIn: function( scenarioName ) {
        // this.openMain();        
    }
}

//@ sourceURL=source/mainMenu.js