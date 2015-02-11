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

this.initialize = function() {
    this.children.create( "actions", "http://vwf.example.com/node.vwf" );
}

this.onGenerated = function( params, generator, payload ) {
    if ( !this.initTriggerObject( params, generator, payload ) ) {
        return false;
    }

    if ( !params || ( params.length < 2 ) ) {
        this.logger.errorx( "onGenerated", 
                            "This action requires at least two arguments: " +
                            "the time to delay (in seconds) and one or more " +
                            "actions to take once the delay is complete." );
        return false;
    }

    this.scenario = payload.scenario;
    if ( !this.scenario ) {
        return false;
    }

    this.delay = params[ 0 ];
    if ( delay <= 0 ) {
        this.logger.errorx( "onGenerated", "The delay must be greater than 0.");
        return false;
    }

    for ( var i = 1; i < params.length; ++i ) {
        generator.generateObject( params[ i ], this.actions, payload );
    }

    return true;
}

this.executeAction = function() {
    this.future( this.delay ).executeDelayedActions();
}

this.executeDelayedActions = function() {
    if ( this.scenario === this.scene.getCurrentScenario() ) {
        for ( var i = 0; i < this.actions.children.length; ++i ) {
            this.parentTrigger.spew( "fire", "Starting delayed action " + i + 
                                     " ('" + this.actions.children[ i ].name + 
                                     "')." );

            this.actions.children[ i ].executeAction();

            this.parentTrigger.spew( "fire", "Finished delayed action " + i + 
                                     " ('" + this.actions.children[ i ].name + 
                                     "')." );
        }
    } else {
        // TODO: is an assert overkill here?
        this.assert( false, 
                     "The scenario ended before the delayed actions fired!" );
    }
}

//@ sourceURL=source/triggers/actions/action_delay.js
