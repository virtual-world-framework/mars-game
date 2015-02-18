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
    // An action generator for creating the starting actions (which fire every
    //  time the scenario starts)/
    this.children.create( "actionGen",
                          "source/triggers/generators/generator_Action.vwf" );

    // A child that will hold the starting actions once they've been generated
    this.children.create( "startingActionSet", 
                          "http://vwf.example.com/node.vwf" );

    this.future( 0 ).postInit();
}

this.postInit = function() {
    if ( !this.name ) {
        return; // we're the prototype, not an actual scenario.
    }

    // NOTE: unlike every other action, we don't have a parent trigger.  
    //  Hopefully that won't break anything...
    var payload = { trigger: undefined, scenario: this };

    if ( this.startState ) {
        for ( var i = 0; i < this.startState.length; ++i ) {
            this.actionGen.generateObject( this.startState[ i ], 
                                           this.startingActionSet, 
                                           payload );
        }
    }

    this.scene.scenarioChanged = this.events.add( function( scenarioName ) {
        this.onScenarioChanged( scenarioName );
    }, this );

    this.scene.scenarioReset = this.events.add( function( scenarioName ) {
        this.onScenarioReset( scenarioName );
    }, this );

    this.triggerManager.loadTriggers( this );

    if ( this.runOnStartup ) {
        this.future( 0 ).startInitialScenario$()
    }
}

this.startScenario = function() {
    this.assert( this.isRunning, "The scenario should be running by now!" );
}

this.failed = function() {
    // NOTE: we may need to set this.isRunning here like we do on success - if
    //  we run into a situation where a trigger causes multiple failures before
    //  the player gets a chance to click (or something like that) then we may
    //  want to try that - but for now, it's not happening, so I'm loathe to 
    //  make the change.

    // If we need to do anything on failure, it should go in here.
    this.scene.scenarioFailed( this );
    this.scene.stopAllExecution();
}

this.completed = function() {
    // We set isRunning to false when we succeed (and it can also be set other
    //  ways).  This prevents us from succeeding on the same scenarion more than
    //  once (which confuses the snot out of the scene).
    if ( !this.isRunning ) {
        return;
    }

    // HACK: This is a bit of a hack, but it should solve the problem 
    //  for now.  We want to always store the heading of the rover on
    //  success, so look up the rover, and then stuff that value onto 
    //  the blackboard.
    var rover = this.scene.find( "//rover" )[ 0 ];
    if ( rover ) {
        this.scene.sceneBlackboard[ "lastHeading$" ] = rover.heading;
    } else {
        this.logger.warnx( "completed", "Rover not found!!" );
    }

    this.isRunning = false;
    this.scene.scenarioSucceeded( this );
}

this.onScenarioChanged = function( scenarioName ) {
    if ( scenarioName === this.name ) {
        this.assert( !this.isRunning, "Scenario is already running!" );
        this.isRunning = true;
    } else {
        this.isRunning = false;
    }
}

this.onScenarioReset = function( scenarioName ) {
    if ( scenarioName === this.name ) {
        this.assert( this.isRunning, "How can we reset when we're not running?!" );

        // Stopping and starting again will reset everything.
        this.isRunning = false;
        this.isRunning = true;
    } else {
        this.assert( !this.isRunning, "How is a different scenario resetting when " +
                     "we're running?!" );
    }
}

this.start = function() {
    this.logger.logx( "start", "Scenario started." );

    // This resets any blinking GUI elements or other special HUD effects from
    //  previous scenarios.  We need to do it before the scenarioStarted event,
    //  which may set some of those effects going.
    this.scene.resetHUDState();

    // HACK: This is a bit of a hack, but it should work for now.  We want to
    //  look up the orientation of the rover from the last scenario success
    //  set it back to that.  We do this before loading the start state, so
    //  that the start state can override it.
    var rover = this.scene.find( "//rover" )[ 0 ];
    if ( rover ) {
        if ( this.scene.sceneBlackboard[ "lastHeading$" ] ) {
            rover.setHeading( this.scene.sceneBlackboard[ "lastHeading$" ] );
        } else {
            rover.setHeading( 0 );
        }
    } else {
        this.logger.warnx( "startScenario", "Rover not found!!" );
    }

    // Set the starting state
    for ( var i = 0; i < this.startingActionSet.children.length; ++i ) {
        this.startingActionSet.children[ i ].executeAction();
    }

    // Reset the global triggers
    var globalTriggers = this.scene.globalTriggerManager;
    globalTriggers.isEnabled = false;
    globalTriggers.isEnabled = true;

    // Enable the triggers
    this.assert( !this.triggerManager.isEnabled, "How is the trigger " +
                 "manager enabled when the scenario isn't?!" );
    this.triggerManager.isEnabled = true;

    // TODO: remove any real dependency on task.
    this.enter();

    // Let the world know that the scenario just started.
    this.scene.scenarioStarted( this );
}

this.stop = function() {
    // Disable the triggers
    this.assert( this.triggerManager.isEnabled, "How is the trigger " +
                 "manager not enabled when the scenario is?!" );
    this.triggerManager.isEnabled = false;

    this.logger.logx( "stop", "Scenario stopped." );
}

this.setIsRunning$ = function( value ) {
    if ( value && !this.isRunning ) {
        this.isRunning = true;
        this.start();
    } else if ( !value && this.isRunning ) {
        this.isRunning = false;
        this.stop();
    }
}

this.startInitialScenario$ = function() {
    this.scene.activeScenarioPath = this.scenarioName;
}

//@ sourceURL=source/scenario/scenario.js