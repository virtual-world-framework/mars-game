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
    overlay: undefined,
    lastTime: undefined,
    menus: undefined,
    buttons: undefined,
    controls: undefined,
    settings: undefined,
    soundManager: undefined,
    currentScenario: undefined,

    initialize: function() {
        this.menus = {};
        this.buttons = {};
        this.controls = {};
        this.settings = {
            "volume": 1,
            "muted": false
        };
        this.initializeHTML();
    },

    initializeHTML: function() {
        this.overlay = document.getElementById( "mainMenuWrapper" );
        this.menus.main = document.getElementById( "mainMenu" );
        this.menus.settings = document.getElementById( "mm_settingsMenu" );
        this.menus.login = document.getElementById( "mm_loginMenu" );
        this.buttons.newGame = document.getElementById( "newGame" );
        this.buttons.continue = document.getElementById( "continue" );
        this.buttons.settings = document.getElementById( "mm_settings" );
        this.buttons.login = document.getElementById( "mm_login" );
        this.buttons.back = document.getElementById( "mm_backToMain" );
        this.controls.mute = document.getElementById( "mm_mute" );
        this.controls.volumeSlider = document.getElementById( "mm_volumeSlider" );
        this.menus.settings.style.display = "none";
       // this.buttons.continue.style.display = "none";
        this.buttons.newGame.addEventListener( "click", this.playGame.bind( this ) );
        this.buttons.continue.addEventListener( "click", this.resumeGame.bind( this ) );
        this.buttons.settings.addEventListener( "click", this.openSettings.bind( this ) );
        this.buttons.login.addEventListener( "click", this.openLogin.bind( this ) );
        this.buttons.back.addEventListener( "click", this.openMain.bind( this ) );
        this.controls.mute.addEventListener( "click", this.muteVolume.bind( this ) );
        this.controls.volumeSlider.addEventListener( "mousemove", this.moveVolumeSlider.bind( this ) );
        this.controls.volumeSlider.addEventListener( "mousedown", this.moveVolumeSlider.bind( this ) );
        this.controls.volumeSlider.addEventListener( "mouseout", this.moveVolumeSlider.bind( this ) );
        var keys = Object.keys( this.buttons );
        var btn;
        var highlight = function() {
            this.classList.add( "hover" );
        }
        var unhighlight = function() {
            this.classList.remove( "hover" );
            this.classList.remove( "select" );
        }
        var select = function() {
            this.classList.add( "select" );
        }
        var deselect = function() {
            this.classList.remove( "select" );
        }
        for ( var i = 0; i < keys.length; i++ ) {
            btn = keys[ i ];
            this.buttons[ btn ].addEventListener( "mouseover", highlight );
            this.buttons[ btn ].addEventListener( "mouseout", unhighlight );
            this.buttons[ btn ].addEventListener( "mousedown", select );
            this.buttons[ btn ].addEventListener( "mouseup", deselect );
        }
    },

    playGame: function() {
        $( "#transitionScreen" ).fadeTo( 0, 1 );
        vwf_view.kernel.callMethod( vwf_view.kernel.application(), "newGame" );
    },

    resumeGame: function() {
        this.overlay.style.display = "none";
        // TODO: In the future, the current scenario and other information will have to be stored
        //   in some kind of game save and that state will be loaded automatically. No scenario will be
        //   specified.
        vwf_view.kernel.callMethod( vwf_view.kernel.application(), "continueGame", [ this.currentScenario ] );
    },

    openSettings: function() {
        this.menus.main.style.display = "none";
        this.menus.settings.style.display = "block";
        this.setVolumeSliderPosition( this.settings.volume );
    },

    openLogin: function() {
        this.menus.main.style.display = "none";
        this.menus.login.style.display = "block";
    },

    openMain: function() {
        this.menus.settings.style.display = "none";
        this.menus.main.style.display = "block";
    },

    getSoundManager: function() {
        if ( !this.soundManager ) {
            this.soundManager = vwf_view.kernel.find( vwf_view.kernel.application(), "/soundManager" )[ 0 ];
        }
        return this.soundManager;
    },

    setVolume: function( value ) {
        if ( this.getSoundManager() ) {
            value = Math.min( 1, Math.max( 0, value ) );
            if ( value === 0 ) {
                this.controls.mute.classList.add( "muted" );
                this.settings.muted = true;
            } else {
                this.controls.mute.classList.remove( "muted" );
                this.settings.muted = false;
                this.settings.volume = value;
            }
            this.setVolumeSliderPosition( value );
            vwf_view.kernel.callMethod( this.soundManager, "setMasterVolume", [ value ] );
        }
    },

    moveVolumeSlider: function( event ) {
        var pct, handle, slider, deadzone;
        if ( event.which === 1 ) {
            handle = document.getElementById( "mm_volumeHandle" );
            slider = document.getElementById( "mm_volumeSlider" );
            deadzone = handle.clientWidth / 2;
            pct = ( event.offsetX - deadzone ) / ( slider.clientWidth - deadzone * 2 );
            this.setVolume( pct );
        }
    },

    muteVolume: function() {
        if ( this.settings.muted ) {
            this.setVolume( this.settings.volume );
        } else {
            this.setVolume( 0 );
        }
    },

    setVolumeSliderPosition: function( volume ) {
        var volumeHandle = document.getElementById( "mm_volumeHandle" );
        var deadzone = volumeHandle.clientWidth / 2;
        var pos = volume * ( volumeHandle.parentNode.clientWidth - deadzone * 2 );
        var readout, readoutPct;
        volumeHandle.style.marginLeft = pos + "px";
        readout = document.getElementById( "mm_volumeDisplay" );
        readoutPct = volume * 100;
        readoutPct = Math.round( readoutPct );
        readout.innerHTML = "Volume: " + readoutPct + "%";
    },

    setVisible: function( value ) {
        var display = value ? "block" : "none";
        this.overlay.style.display = display;
    },

    setContinueScenario: function( scenarioName ) {
        this.currentScenario = scenarioName;
        this.buttons.continue.style.display = "block";
    }
}

//@ sourceURL=source/view/mainMenu.js