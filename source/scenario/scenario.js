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

var activeScenario;
var scene;

this.initialize = function() {
    this.children.create( "startStateExecutor", 
                          "source/triggers/declarativeFunctionExecutor.vwf" );

    this.future( 0 ).onSceneLoaded();
}

this.onSceneLoaded = function() {
    var searchArray = this.find( this.scenePath );
    if ( searchArray.length ) {
        scene = searchArray[ 0 ];
    } else {
        this.logger.errorx( "startScenario", "Failed to find the scene!" );
    }
}

this.startScenario = function() {
    this.logger.logx( this.scenarioName + ".startScenario", "Scenario started." );

    if ( activeScenario !== this ) {

        // Clear out the triggers from the previous scenario.
        // NOTE: it might be better to do this inside success/failure, so
        //   that it doesn't wait until the player clicks forward to happen.
        var lastScenario = activeScenario;
        if ( lastScenario && lastScenario.triggerManager && 
             !lastScenario.triggerManager.isEmpty() ) {
            this.logger.warnx( "startScenario", "How did the last scenario's " +
                               "trigger manager not get cleared on success?" );
            lastScenario.triggerManager.clearTriggers();
        }

        activeScenario = this;

        this.startStateExecutor.functionSets = [];
        this.startStateExecutor.addFunctionSet( this.startStateParamSet );

        if ( this.grid ) {
            scene.createGridDisplay( this.grid );
        }

        // The global trigger list has late load triggers which need to be 
        //   loaded last (for order of operations reasons), so we will unload
        //   them, load this scenarios triggers, and then reload them.
        // NOTE: we now only clear triggers when we advance the scenario, not
        //   when we reset it.
        var globalTriggers = scene.globalTriggerManager;
        globalTriggers.clearTriggerList( globalTriggers.lateLoadTriggers );

        this.triggerManager.loadTriggers( scene );

        globalTriggers.loadTriggerList( globalTriggers.lateLoadTriggers, scene );
    }

    // HACK: This is a bit of a hack, but it should work for now.  We want to
    //  look up the orientation of the rover from the last scenario success
    //  set it back to that.  We do this before loading the start state, so
    //  that the start state can override it.
    var rover = scene.find( "//rover" )[ 0 ];
    if ( rover ) {
        if ( scene.sceneBlackboard[ "lastHeading$" ] ) {
            rover.setHeading( scene.sceneBlackboard[ "lastHeading$" ] );
        } else {
            rover.setHeading( 0 );
        }
    } else {
        this.logger.warnx( "startScenario", "Rover not found!!" );
    }

    if ( this.startState && this.startState.length > 0 ) {
        for ( var i = 0; i < this.startState.length; ++i ) {
            var param = this.startState[ i ];
            this.startStateExecutor.executeFunction( param, scene );
        }
    }

    this.enter();
    scene.scenarioStarted( this );
}

this.failed = function() {
    // If we need to do anything on failure, it should go in here.
    if ( scene ) {
        scene.scenarioFailed( this );
        scene.stopAllExecution();
    }
}

this.completed = function() {
    // If we need to do anything on success, it should go in here.
    if ( scene ) {
        scene.scenarioSucceeded( this );
        this.triggerManager.clearTriggers();

        // HACK: This is a bit of a hack, but it should solve the problem 
        //  for now.  We want to always store the heading of the rover on
        //  success, so look up the rover, and then stuff that value onto 
        //  the blackboard.
        var rover = scene.find( "//rover" )[ 0 ];
        if ( rover ) {
            scene.sceneBlackboard[ "lastHeading$" ] = rover.heading;
        } else {
            this.logger.warnx( "completed", "Rover not found!!" );
        }
    }
}

this.startStateParamSet.setProperty = function( params, context ) {
    if ( !params || ( params.length !== 3 ) ) {
        activeScenario.logger.errorx( "setProperty", 
                            "The setProperty condition requires three " +
                            "arguments: the object name, the property name, " +
                            "and the property value." );
        return undefined;
    }

    var objectName = params[ 0 ];
    var propertyName = params[ 1 ];
    var value = params[ 2 ];

    var object = activeScenario.startStateExecutor.findInContext( context, objectName );
    object[ propertyName ] = value;
}

this.startStateParamSet.callMethod = function( params, context ) {
    if ( !params || ( params.length < 2 ) ) {
        activeScenario.logger.errorx( "callMethod", 
                            "The callMethod condition requires at least two ",
                            "arguments: the object name and the method name." );
        return undefined;
    }

    var objectName = params.shift();
    var methodName = params.shift();

    var object = activeScenario.startStateExecutor.findInContext( context, objectName );
    object[ methodName ].apply( object, params );
}

this.startStateParamSet.setSceneProperty = function( params, context ) {
    if ( !params || ( params.length !== 2 ) ) {
        activeScenario.logger.errorx( "setSceneProperty", 
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
        activeScenario.logger.errorx( "emptyInventory", 
                            "The emptyInventory condition requires the path " +
                            "of the inventory object." );
        return undefined;
    }

    var inventoryPath = params[ 0 ];
    var inventory = activeScenario.startStateExecutor.findInContext( context, inventoryPath );
    inventory.empty();
}

this.startStateParamSet.addToInventory = function( params, context ) {
    if ( !params || ( params.length !== 2 ) ) {
        activeScenario.logger.errorx( "addToInventory", "The addToInventory condition " +
                            "requires 2 parameters: The path of the inventory object " +
                            "and an array of names of the objects to be added." );
        return undefined;
    }

    var inventory = activeScenario.startStateExecutor.findInContext( context, params[0] );

    var objects = params[1];
    var object;
    for ( var i = 0; i < objects.length; i++ ) {
        object = activeScenario.startStateExecutor.findInContext( context, objects[ i ] );
        inventory.add( object.id );
    }
}

this.startStateParamSet.addToGrid = function( params, context ) {
    if ( !params || ( params.length !== 2 ) ) {
        activeScenario.logger.errorx( "addToGrid",
                            "The addToGrid condition requires 2 arguments: " +
                            "the object to be added, and the coordinates of " +
                            "the grid tile." );
        return undefined;
    }

    var objectName = params[ 0 ];
    var gridCoord = params[ 1 ];

    var object = activeScenario.startStateExecutor.findInContext( context, objectName );
    activeScenario.grid.addToGridFromCoord( object, gridCoord );
}

this.startStateParamSet.removeFromGrid = function( params, context ) {
    if ( !params || ( params.length !== 2 ) ) {
        activeScenario.logger.errorx( "removeFromGrid",
                            "The removeFromGrid condition requires 2 arguments: " +
                            "the object to be added, and the coordinates of " +
                            "the grid tile." );
        return undefined;
    }

    var objectName = params[ 0 ];
    var gridCoord = params[ 1 ];

    var object = activeScenario.startStateExecutor.findInContext( context, objectName );
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
        object = activeScenario.startStateExecutor.findInContext( context, params[ i ] );
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

    var node = activeScenario.startStateExecutor.findInContext( context, params[ 0 ] );
    var toolbox = params[ 1 ];
    node.blockly_toolbox = toolbox;
    if ( context.blockly_activeNodeID === node.id ) {
        context.blockly_toolbox = toolbox;
    }
}

//@ sourceURL=scenario.js