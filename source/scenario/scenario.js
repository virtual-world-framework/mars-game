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
    this.children.create( "startStateExecutor", 
                          "source/triggers/generators/declarativeFunctionExecutor.vwf" );

    this.future( 0 ).postInit();
}

this.postInit = function() {
    if ( !this.name ) {
        return; // we're the prototype, not an actual scenario.
    }

    this.startStateExecutor.addFunctionSet( this.startStateParamSet );


    this.assert( this.scene && this.triggerManager );

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
    if ( this.startState && this.startState.length > 0 ) {
        for ( var i = 0; i < this.startState.length; ++i ) {
            var param = this.startState[ i ];
            this.startStateExecutor.executeFunction( param, this.scene );
        }
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

this.startStateParamSet.setProperty = function( params, context ) {
    if ( !params || ( params.length !== 3 ) ) {
        context.logger.errorx( "setProperty", 
                            "The setProperty condition requires three " +
                            "arguments: the object name, the property name, " +
                            "and the property value." );
        return undefined;
    }

    var objectName = params[ 0 ];
    var propertyName = params[ 1 ];
    var value = params[ 2 ];

    var object = context.find( "//" + objectName )[ 0 ];
    object[ propertyName ] = value;
}

this.startStateParamSet.callMethod = function( params, context ) {
    if ( !params || ( params.length < 2 ) ) {
        context.logger.errorx( "callMethod", 
                            "The callMethod condition requires at least two ",
                            "arguments: the object name and the method name." );
        return undefined;
    }

    var objectName = params[ 0 ];
    var methodName = params[ 1 ];
    var args = params.slice( 2 );

    var object = context.find( "//" + objectName )[ 0 ];
    object[ methodName ].apply( object, args );
}

this.startStateParamSet.setSceneProperty = function( params, context ) {
    if ( !params || ( params.length !== 2 ) ) {
        context.logger.errorx( "setSceneProperty", 
                            "The setSceneProperty condition requires two " +
                            "arguments: the property name and the property " +
                            "value." );
        return undefined;
    }

    var propertyName = params[ 0 ];
    var value = params[ 1 ];
    
    context[ propertyName ] = value;
}

this.startStateParamSet.emptyInventory = function( params, context ) { 
    if ( !params || ( params.length !== 1 ) ) {
        context.logger.errorx( "emptyInventory", 
                            "The emptyInventory condition requires the path " +
                            "of the inventory object." );
        return undefined;
    }

    var inventoryPath = params[ 0 ];
    var inventory = context.find( "//" + inventoryPath )[ 0 ];
    inventory.empty();
}

this.startStateParamSet.addToInventory = function( params, context ) {
    if ( !params || ( params.length !== 2 ) ) {
        context.logger.errorx( "addToInventory", "The addToInventory condition " +
                            "requires 2 parameters: The path of the inventory object " +
                            "and an array of names of the objects to be added." );
        return undefined;
    }

    var inventory = context.find( "//" + params[0] )[ 0 ];

    var objects = params[1];
    var object;
    for ( var i = 0; i < objects.length; i++ ) {
        object = context.find( "//" + objects[ i ] )[ 0 ];
        inventory.add( object );
    }
}

this.startStateParamSet.addToGrid = function( params, context ) {
    if ( !params || ( params.length !== 2 ) ) {
        context.logger.errorx( "addToGrid",
                            "The addToGrid condition requires 2 arguments: " +
                            "the object to be added, and the coordinates of " +
                            "the grid tile." );
        return undefined;
    }

    var objectName = params[ 0 ];
    var gridCoord = params[ 1 ];

    var object = context.find( "//" + objectName )[ 0 ];
    var activeScenario = context.getCurrentScenario();
    activeScenario.grid.addToGridFromCoord( object, gridCoord );
}

this.startStateParamSet.removeFromGrid = function( params, context ) {
    if ( !params || ( params.length !== 2 ) ) {
        context.logger.errorx( "removeFromGrid",
                            "The removeFromGrid condition requires 2 arguments: " +
                            "the object to be added, and the coordinates of " +
                            "the grid tile." );
        return undefined;
    }

    var objectName = params[ 0 ];
    var gridCoord = params[ 1 ];

    var object = context.find( "//" + objectName )[ 0 ];
    var activeScenario = context.getCurrentScenario();
    activeScenario.grid.removeFromGrid( object, gridCoord );
}

this.startStateParamSet.enableBlocklyTabs = function( params, context ) {
    if ( !params || params.length < 1 ) {
        self.logger.errorx( "enableBlocklyTabs",
                            "The enableBlocklyTabs condition requires at least" +
                            " one parameter: the name of a blockly tab to be enabled." );
        return undefined;
    }

    var object;
    context.clearBlocklyTabs();
    for ( var i = 0; i < params.length; i++ ) {
        object = context.find( "//" + params[ i ] )[ 0 ];
        if ( object ) {
            context.enableBlocklyTab( object.id );
        }
    }
}

this.startStateParamSet.loadToolbox = function( params, context ) {
    if ( params && params.length !== 2 ) {
        self.logger.errorx( "loadToolbox",
                            "The loadToolbox condition takes two parameters:" +
                            " The blockly node name and the path to the xml" +
                            " blockly toolbox." );
        return undefined;
    }

    var node = context.find( "//" + params[ 0 ] )[ 0 ];
    var toolbox = params[ 1 ];
    node.blockly_toolbox = toolbox;
    if ( context.blockly_activeNodeID === node.id ) {
        context.blockly_toolbox = toolbox;
    }
}

//@ sourceURL=source/scenario.js