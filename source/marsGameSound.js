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

"use strict";

this.initialize = function() {
    //Load sounds defined in yaml file
    this.setVoiceSet( this.voiceSet ); //TODO: get rid of this
    var currSoundName;
    for( currSoundName in this.soundSet ) {
        var currSound = this.soundSet[currSoundName];
        if( !isTTSSound(currSound) ){
            this.loadSound( currSound );
        }
    }

    //TODO: intialize meSpeak... 
    meSpeak.loadConfig("mespeak/mespeak_config.json");
    meSpeak.loadVoice("mespeak/en.json");

    this.future( 0 ).setUpSubtitles();
}

this.setUpSubtitles = function() {
    var scene = this.find( "/" )[ 0 ];
    if ( scene && this.setUpOnce ) {
        this.setUpOnce = false;
        this.soundStarted = this.events.add( startSubtitle.bind( this ) );
        this.soundFinished = this.events.add( stopSubtitle.bind( this ) );
    }
}

this.playSoundWrapper = function( soundName, exitCallback ){
    var currSound = this.soundSet[soundName];
    if( isTTSSound(currSound) ){
        console.log("Playing TTS sound");
        

        var speechStr = currSound.textToSpeechInput;
        if(speechStr){
            //var speechStr = rawSubtitle.replace(/\[.*\]: /, ""); //Get rid of "[Rover]: ", "[MC]:", etc.
            var currVoice = currSound.voice;
            var meSpeakOpts = {};

            //TODO: there might be a way to assign this.voiceSet[currVoice] directly to meSpeakOpts, which would
            //make the code cleaner.
            if ( this.voiceSet[currVoice].ttsAmplitude !== undefined ) {
                meSpeakOpts.amplitude = this.voiceSet[currVoice].ttsAmplitude;
            } 
            if ( this.voiceSet[currVoice].ttsVariant !== undefined ) {
                meSpeakOpts.variant = this.voiceSet[currVoice].ttsVariant;
            } 
            if ( this.voiceSet[currVoice].ttsWordGap !== undefined ) {
                meSpeakOpts.wordgap = this.voiceSet[currVoice].ttsWordGap;
            } 
            if ( this.voiceSet[currVoice].ttsSpeed !== undefined ) {
                meSpeakOpts.speed = this.voiceSet[currVoice].ttsSpeed;
            } 
            if ( this.voiceSet[currVoice].ttsPitch !== undefined ) {
                meSpeakOpts.pitch = this.voiceSet[currVoice].ttsPitch;
            } 
            
            meSpeakOpts.rawdata = 'default';
            var meSpeakBuf = meSpeak.speak( speechStr, meSpeakOpts );

            currSound.playOnLoad = true; //no need to call playSound()
            currSound.deleteAfterPlay = true;
            this.loadSound( currSound, undefined, undefined, meSpeakBuf ); 
        } else {
            //TODO: Um... throw a warning? We aren't supposed to be in this state...
        }

        //TODO: pass the buffer as an extra option to playsound.
        
    } else {
        console.log("Playing normal sound");
        this.playSound( soundName, exitCallback );
    }
    
}

function isTTSSound( soundDefinition ){
    return soundDefinition.voice && soundDefinition.textToSpeechInput;
}

function startSubtitle( instanceHandle ) {
    var scene = this.find( "/" )[ 0 ];
    if ( this.hasSubtitle( instanceHandle ) ) {
        var subtitle = this.getSubtitle( instanceHandle );
        //Get the time in seconds
        var time = this.getDuration( instanceHandle );
        scene.addSubtitle( subtitle, time );
        //Parse subtitle to find the character image to display
        var character = subtitle.split( ":" )[ 0 ];
        if ( character ) {
            character = character.slice( 1, character.length - 1 );
            var imagePath = "";
            if ( character === "ROVER" ) {
                var imagePath = "assets/images/hud/comms_rover.png";
            } else if ( character === "MC" ) {
                var imagePath = "assets/images/hud/comms_missioncontrol.png";
            }
            scene.showCommsImage( imagePath );
        }                
    }
}

function stopSubtitle( instanceHandle ) {
    var scene = this.find( "/" )[ 0 ];
    if ( this.hasSubtitle( instanceHandle ) ) {
        scene.hideCommsImage();
    }
}

//@ sourceURL=source/marsGameSound.js
