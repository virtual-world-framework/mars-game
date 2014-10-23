var conditions = {
    "and": {
      "display": "And",
      "description": "This condition is true if all of the contained conditions are true.",
      "requiredArgs": [
        { "Condition": "condition" },
        { "Condition": "condition" }
      ],
      "optionalArgs": [],
      "repeatedArgs": [
        { "Condition": "condition" }
      ]
    },
    "or": {
      "display": "Or",
      "description": "This condition is true if one or more of the contained condition are true.",
      "requiredArgs": [
        { "Condition": "condition" },
        { "Condition": "condition" }
      ],
      "optionalArgs": [],
      "repeatedArgs": [
        { "Condition": "condition" }
      ]
    },
    "not": {
      "display": "Not",
      "description": "This condition is true if the contained condition is false.",
      "requiredArgs": [
        { "Condition": "condition" }
      ],
      "optionalArgs": [],
      "repeatedArgs": []
    },
    "isAtPosition": {
      "display": "Entity is at Position",
      "description": "Checks if an object is at grid position ( x, y ).",
      "requiredArgs": [
        { "Object": "node" },
        { "Position": "point2D" }
      ],
      "optionalArgs": [],
      "repeatedArgs": []
    },
    "hasHeading": {
      "display": "Entity has Heading",
      "description": "Checks if an object is facing the specified heading.",
      "requiredArgs": [
        { "Object": "node" },
        { "Heading": "number" }
      ],
      "optionalArgs": [],
      "repeatedArgs": []
    },
    "hasObject": {
      "display": "Entity has Item",
      "description": "Checks if an object is holding the specified object.",
      "requiredArgs": [
        { "Object": "node" },
        { "Item": "node" }
      ],
      "optionalArgs": [],
      "repeatedArgs": []
    },
    "onMoved": {
      "display": "Entity has Moved",
      "description": "Checks if an object has started moving.",
      "requiredArgs": [
        { "Object": "node" }
      ],
      "optionalArgs": [],
      "repeatedArgs": []
    },
    "moveFailed": {
      "display": "Entity Movement has Failed",
      "description": "Checks if an object's movement has failed and optionally what caused it to fail.",
      "requiredArgs": [
        { "Object": "node" }
      ],
      "optionalArgs": [
        { "Failure Type": "moveFailedType" }
      ],
      "repeatedArgs": []
    },
    "isBlocklyExecuting": {
      "display": "Blockly is Executing",
      "description": "Checks if a Blockly program is currently running.",
      "requiredArgs": [],
      "optionalArgs": [],
      "repeatedArgs": [
        { "Object": "blocklyNode" }
      ]
    },
    "onBlocklyStarted": {
      "display": "Blockly has Started",
      "description": "Checks if a Blockly program has started running.",
      "requiredArgs": [],
      "optionalArgs": [],
      "repeatedArgs": [
        { "Object": "blocklyNode" }
      ]
    },
    "onBlocklyStopped": {
      "display": "Blockly has Stopped",
      "description": "Checks if a Blockly program has stopped running.",
      "requiredArgs": [],
      "optionalArgs": [],
      "repeatedArgs": [
        { "Object": "blocklyNode" }
      ]
    },
    "onBlocklyWindowOpened": {
      "display": "Blockly Window Opened",
      "description": "Checks if a Blockly window has opened.",
      "requiredArgs": [],
      "optionalArgs": [],
      "repeatedArgs": [
        { "Object": "blocklyNode" }
      ]
    },
    "onBlocklyProgramChanged": {
      "display": "Blockly Program Changed",
      "description": "Checks if a Blockly program has been modified.",
      "requiredArgs": [
        { "Objects": "blocklyNodeArray" }
      ],
      "optionalArgs": [
        { "Change": "blockChangeType" },
        { "Blocks": "blockArray" }
      ],
      "repeatedArgs": []
    },
    "onScenarioStart": {
      "display": "Scenario Started",
      "description": "Checks if a scenario has just started.",
      "requiredArgs": [],
      "optionalArgs": [
        { "Scenario": "scenario" }
      ],
      "repeatedArgs": []
    },
    "onScenarioSucceeded": {
      "display": "Scenario Succeeded",
      "description": "Checks if the success criteria of a scenario have been met.",
      "requiredArgs": [],
      "optionalArgs": [
        { "Scenario": "scenario" }
      ],
      "repeatedArgs": []
    },
    "onScenarioFailed": {
      "display": "Scenario Failed",
      "description": "Checks if the failure criteria of a scenario have been met.",
      "requiredArgs": [],
      "optionalArgs": [
        { "Scenario": "scenario" }
      ],
      "repeatedArgs": []
    },
    "onScenarioChanged": {
      "display": "Scenario Changed",
      "description": "Checks if the scenario has changed.",
      "requiredArgs": [],
      "optionalArgs": [],
      "repeatedArgs": []
    },
    "onVideoPlayed": {
      "display": "Video Ended",
      "description": "Checks if the specified video has played.",
      "requiredArgs": [
        { "Video": "video" }
      ],
      "optionalArgs": [],
      "repeatedArgs": []
    },
    "onHelicamToggle": {
      "display": "Helicam View Toggled",
      "description": "Checks if Helicam View has been toggled.",
      "requiredArgs": [],
      "optionalArgs": [],
      "repeatedArgs": []
    },
    "onGraphToggle": {
      "display": "Graph Display Toggled",
      "description": "Checks if the Graph Display has been toggled.",
      "requiredArgs": [],
      "optionalArgs": [],
      "repeatedArgs": []
    },
    "onTilesToggle": {
      "display": "Tile Display Toggled",
      "description": "Checks if the Tile Display has been toggled.",
      "requiredArgs": [],
      "optionalArgs": [],
      "repeatedArgs": []
    },
    "blocklyLineEval": {
      "display": "Blockly Line Intersect",
      "description": "Checks if the graphed line intersects the given point.",
      "requiredArgs": [
        { "Point": "point2D" }
      ],
      "optionalArgs": [],
      "repeatedArgs": []
    },
    "readBlackboard": {
      "display": "Read Blackboard",
      "description": "Checks the Blackboard for a stored value and optionally how many times that value has been written to the Blackboard.",
      "requiredArgs": [
        { "Name": "string" }
      ],
      "optionalArgs": [
        { "Count": "number" }
      ],
      "repeatedArgs": []
    },
    "delay": {
      "display": "Delay",
      "description": "Performs an action after the specified number of seconds.",
      "requiredArgs": [
        { "Seconds": "number" }
      ],
      "optionalArgs": [],
      "repeatedArgs": []
    },
    "onGameStarted": {
      "display": "Game Started",
      "description": "Checks if the game has started.",
      "requiredArgs": [],
      "optionalArgs": [],
      "repeatedArgs": []
    },
    "onHUDMouseOver": {
      "display": "HUD Mouse Over",
      "description": "Checks if the client's mouse is over the specified HUD element.",
      "requiredArgs": [
        { "HUD Element": "HUDElement" }
      ],
      "optionalArgs": [],
      "repeatedArgs": []
    },
    "onGameLoaded": {
      "display": "Game Loaded",
      "description": "Checks if the game has been loaded.",
      "requiredArgs": [],
      "optionalArgs": [],
      "repeatedArgs": []
    }
}