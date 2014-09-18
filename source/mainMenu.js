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
    continueScenario: undefined,
    assetCount: undefined,
    assetsLoaded: undefined,
    planet: undefined,
    planetAxis: undefined,
    lastTime: undefined,

    initialize: function() {
        this.createScene();
        this.createOverlay();
    },

    createScene: function() {
        var loader, light, ambient;
        this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
        window.addEventListener( "resize", this.updateMenuCamera.bind( this ) );
        this.camera.position.set( 0, 0, 0 );
        this.camera.rotateX( Math.PI / 2 );
        this.camera.rotateY( Math.PI * 1.25 );
        this.scene = new THREE.Scene();
        loader = new THREE.ColladaLoader();
        this.assetCount = 4;
        this.assetsLoaded = 0;
        loader.load( "assets/3d/Start/orange_cloud.dae", this.addClouds.bind( this ) );
        loader.load( "assets/3d/Start/planet_mars.dae", this.addPlanet.bind( this ) );
        loader.load( "assets/3d/Start/satellite.dae", this.addSatellite.bind( this ) );
        loader.load( "assets/3d/Start/stars.dae", this.addStars.bind( this ) );
        light = new THREE.DirectionalLight( 0xffffff, 1.2 );
        light.position.set( 1, 0.5, 0.5 );
        ambient = new THREE.AmbientLight( 0xFFFFFF );
        this.scene.add( light );
        this.scene.add( ambient );
        this.lastTime = Date.now();
    },

    addPlanet: function( collada ) {
        var model = collada.scene;
        model.position.set( 5, -9, 0 );
        this.planet = model;
        this.planetAxis = new THREE.Vector3( 0.8, 0, 1.2 );
        this.planetAxis.normalize();
        this.scene.add( model );
        this.assetLoaded();
    },

    addStars: function( collada ) {
        var model = collada.scene;
        this.scene.add( model );
        this.assetLoaded();
    },

    addSatellite: function( collada ) {
        var model = collada.scene;
        model.children[ 1 ].scale.set( 1, 1, 1 );
        model.children[ 1 ].position.set( 1.25, -1.75, 0.75 );
        this.scene.add( model );
        this.assetLoaded();
    },

    addClouds: function( collada ) {
        var model = collada.scene;
        model.position.set( 5, -5, 0 );
        this.scene.add( model );
        this.assetLoaded();
    },

    assetLoaded: function() {
        this.assetsLoaded++;
        if ( this.assetsLoaded >= this.assetCount ) {
            $( "#transitionScreen" ).fadeOut();
        }
    },

    createOverlay: function() {
        var title, playButton, continueButton, settingsButton, backButton, volume;
        var loginForm, loginTextBox, loginButton, loginHeading, container, logout;

        this.overlay = document.createElement( "div" );
        this.overlay.id = "MainMenu-Wrapper";
        this.overlay.style.display = "none";

        container = document.createElement( "div" );
        container.id = "MainMenu-Container";

        this.overlay.mainMenu = document.createElement( "div" );
        this.overlay.mainMenu.id = "MainMenu-Main";
        // UNCOMMENT FOR INSTRUMENTATION
        // this.overlay.mainMenu.style.display = "none";

        title = document.createElement( "div" );
        title.id = "MainMenu-Title";
        title.main = document.createElement( "h1" );
        title.main.innerHTML = "Nomad";
        title.sub = document.createElement( "h2" );
        title.sub.innerHTML = "Crash Landing";

        playButton = document.createElement( "div" );
        playButton.id = "MainMenu-PlayButton";
        playButton.className = "MainMenu-Button"
        playButton.innerHTML = "New Game";
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

        continueButton = document.createElement( "div" );
        continueButton.id = "MainMenu-ContinueButton";
        continueButton.className = "MainMenu-Button"
        continueButton.innerHTML = "Continue";
        continueButton.style.display = "none";
        continueButton.onmouseover = function( event ) {
            appendClass( this, "hover" );
        }
        continueButton.onmouseout = function( event ) {
            removeClass( this, "hover" );
            removeClass( this, "select" );
        }
        continueButton.onmousedown = function( event ) {
            removeClass( this, "hover" );
            appendClass( this, "select" );
        }
        continueButton.onclick = this.resumeGame.bind( this );

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

        // UNCOMMENT FOR INSTRUMENTATION
        // this.overlay.loginMenu = document.createElement( "div" );
        // this.overlay.loginMenu.id = "loginBox";
        // loginForm = document.createElement( "form" );
        // loginForm.id = "loginForm";
        // loginHeading = document.createElement( "div" );
        // loginHeading.id = "loginHeading";
        // loginHeading.innerHTML = "Please enter a player ID.";
        // loginTextBox = document.createElement( "input" );
        // loginTextBox.id = "idTextBox";
        // loginTextBox.type = "text";
        // loginButton = document.createElement( "input" );
        // loginButton.id = "submitButton";
        // loginButton.type = "button";
        // loginButton.value = "Submit";
        // logout = document.createElement( "div" );
        // logout.id = "logout";
        // loginForm.appendChild( loginHeading );
        // loginForm.appendChild( loginTextBox );
        // loginForm.appendChild( loginButton );
        // this.overlay.loginMenu.appendChild( loginForm );
        // this.overlay.appendChild( this.overlay.loginMenu );
        // loginForm.onsubmit = this.submitUserID.bind( loginTextBox );
        // loginButton.onclick = this.submitUserID.bind( loginTextBox );
        // logout.onclick = this.logoutUser.bind( this );
        // this.overlay.appendChild( logout );

        title.appendChild( title.main );
        title.appendChild( title.sub );
        this.overlay.mainMenu.appendChild( playButton );
        this.overlay.mainMenu.appendChild( continueButton );
        this.overlay.mainMenu.appendChild( settingsButton );
        this.overlay.settingsMenu.appendChild( backButton );
        this.overlay.settingsMenu.appendChild( volume );
        container.appendChild( title );
        container.appendChild( this.overlay.mainMenu );
        container.appendChild( this.overlay.settingsMenu );
        this.overlay.appendChild( container );
        document.body.appendChild( this.overlay );
    },

    updateMenuCamera: function() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    },

    setupRenderer: function( renderer ) {
        this.overlay.style.display = "block";
        renderer.setClearColor( 0x000000 );
    },

    render: function( renderer ) {
        var time = Date.now();
        var theta = time / 300 % 360 * Math.PI / 180;
        var theta2 = time / 100 % 360 * Math.PI / 180;
        this.camera.position.set( Math.sin( theta ) * 0.3, 0, 2 + Math.cos( theta2 ) * 0.1 - 1.5 );
        if ( this.planet ) {
            this.planet.rotateOnAxis( this.planetAxis, ( time - this.lastTime ) / 100000 );
        }
        renderer.render( this.scene, this.camera );
        this.lastTime = time;
    },

    playGame: function() {
        this.overlay.style.display = "none";
        vwf_view.kernel.fireEvent( vwf_view.kernel.application(), "gameStarted" );
    },

    resumeGame: function() {
        this.overlay.style.display = "none";
        vwf_view.kernel.setProperty( vwf_view.kernel.application(), "activeScenarioPath", this.continueScenario );
    },

    openSettings: function() {
        this.overlay.loginMenu.style.display = "none";
        this.overlay.mainMenu.style.display = "none";
        this.overlay.settingsMenu.style.display = "block";
        this.setVolumeSliderPosition( cachedVolume );
    },

    openMain: function() {
        this.overlay.loginMenu.style.display = "none";
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

    submitUserID: function( event ) {
        var vwfScene = vwf_view.kernel.application();
        var logoutDiv = document.getElementById( "logout" );
        var userID = this.value;
        vwf_view.kernel.callMethod( vwfScene, "attemptLogin", [ userID ] );
        logout.innerHTML = userID + " - <a>Log Out</a>";
        event.preventDefault();
    },

    loggedIn: function( scenarioName ) {
        if ( scenarioName ) {
            var continueButton = document.getElementById( "MainMenu-ContinueButton" );
            continueButton.style.display = "block";
            this.continueScenario = scenarioName;
        }
        this.openMain();
    },

    logoutUser: function( event ) {
        var logoutDiv = document.getElementById( "logout" );
        logoutDiv.innerHTML = "";
        this.overlay.loginMenu.style.display = "block";
        this.overlay.settingsMenu.style.display = "none";
        this.overlay.mainMenu.style.display = "none";
    }
}

//@ sourceURL=source/mainMenu.js