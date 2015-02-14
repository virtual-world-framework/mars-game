function getConditions() {
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
            "display": "Object is at Position",
            "description": "Checks if an object is at grid position ( x, y ).",
            "requiredArgs": [
                { "Object": "node" },
                { "Position": "point2D" }
            ],
            "optionalArgs": [],
            "repeatedArgs": []
        },
        "hasHeading": {
            "display": "Rover has Heading",
            "description": "Checks if an object is facing the specified heading.",
            "requiredArgs": [
                { "Object": "rover" },
                { "Heading": "number" }
            ],
            "optionalArgs": [],
            "repeatedArgs": []
        },
        "hasObject": {
            "display": "Rover has Item",
            "description": "Checks if an object is holding the specified object.",
            "requiredArgs": [
                { "Object": "rover" },
                { "Item": "pickup" }
            ],
            "optionalArgs": [],
            "repeatedArgs": []
        },
        "onMoved": {
            "display": "Rover has Moved",
            "description": "Checks if an object has started moving.",
            "requiredArgs": [
                { "Object": "rover" }
            ],
            "optionalArgs": [],
            "repeatedArgs": []
        },
        "moveFailed": {
            "display": "Rover Movement has Failed",
            "description": "Checks if an object's movement has failed and optionally what caused it to fail.",
            "requiredArgs": [
                { "Object": "rover" }
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
                { "Objects": "array:blocklyNode" }
            ],
            "optionalArgs": [
                { "Change": "blockChangeType" },
                { "Blocks": "array:block" }
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
    return conditions;
}

function getActions() {
    var actions = {
        "scenarioSuccess": {
            "display": "Scenario Success",
            "description": "Completes the current scenario.",
            "requiredArgs": [],
            "optionalArgs": [
                { "Success Type": "successType" }
            ],
            "repeatedArgs": []
        },
        "scenarioFailure": {
            "display": "Scenario Failure",
            "description": "Causes scenario failure.",
            "requiredArgs": [],
            "optionalArgs": [
                { "Failure Type": "failureType" },
                { "Failure Message": "string" }
            ],
            "repeatedArgs": []
        },
        "playSound": {
            "display": "Play Sound",
            "description": "Play the specified sound.",
            "requiredArgs": [
                { "Sound": "sound" }
            ],
            "optionalArgs": [],
            "repeatedArgs": []
        },
        "stopSound": {
            "display": "Stop Sound",
            "description": "Stop playing the specified sound.",
            "requiredArgs": [
                { "Sound": "sound" }
            ],
            "optionalArgs": [],
            "repeatedArgs": []
        },
        "stopSoundGroup": {
            "display": "Stop Sound Group",
            "description": "Stop playing the specified sound group.",
            "requiredArgs": [
                { "Sound Group": "soundGroup" }
            ],
            "optionalArgs": [],
            "repeatedArgs": []
        },
        "stopAllSounds": {
            "display": "Stop All Sounds",
            "description": "Stops all playing sounds.",
            "requiredArgs": [],
            "optionalArgs": [],
            "repeatedArgs": []
        },
        "delay": {
            "display": "Delay",
            "description": "Performs an action or set of actions after a specified number of seconds.",
            "requiredArgs": [
                { "Seconds": "number" },
                { "Action": "action" }
            ],
            "optionalArgs": [],
            "repeatedArgs": [
                { "Action": "action" }
            ],
        },
        "writeToBlackboard": {
            "display": "Write to Blackboard",
            "description": "Writes a value to the Blackboard that can be used later.",
            "requiredArgs": [
                { "Name": "string" }
            ],
            "optionalArgs": [
                { "Value": "primitive" }
            ],
            "repeatedArgs": []
        },
        "clearBlackboardEntry": {
            "display": "Clear Blackboard Entry",
            "description": "Removes specified entry from the Blackboard.",
            "requiredArgs": [
                { "Name": "string" }
            ],
            "optionalArgs": [],
            "repeatedArgs": []
        },
        "blinkHUDElement": {
            "display": "Blink HUD Element",
            "description": "Causes the specified HUD element to flash.",
            "requiredArgs": [
                { "HUD Element": "HUDElement" }
            ],
            "optionalArgs": [],
            "repeatedArgs": []
        },
        "stopBlinkHUDElement": {
            "display": "Stop HUD Element Blinking",
            "description": "Causes a flashing element to stop flashing.",
            "requiredArgs": [
                { "HUD Element": "HUDElement" }
            ],
            "optionalArgs": [],
            "repeatedArgs": []
        },
        "blinkBlocklyTab": {
            "display": "Blink Blockly Tab",
            "description": "Causes a Blockly tab to flash.",
            "requiredArgs": [
                { "Object": "blocklyNode" }
            ],
            "optionalArgs": [],
            "repeatedArgs": []
        },
        "stopBlinkBlocklyTab": {
            "display": "Stop Blockly Tab Blinking",
            "description": "Causes a flashing Blockly tab to stop flashing.",
            "requiredArgs": [
                { "Object": "blocklyNode" }
            ],
            "optionalArgs": [],
            "repeatedArgs": []
        },
        "hideBlockly": {
            "display": "Hide Blockly Interface",
            "description": "Closes the Blockly window.",
            "requiredArgs": [],
            "optionalArgs": [],
            "repeatedArgs": []
        },
        "clearBlockly": {
            "display": "Clear Blockly Interface",
            "description": "Clears out the Blockly workspace and toolboxes.",
            "requiredArgs": [],
            "optionalArgs": [],
            "repeatedArgs": []
        },
        "setHUDProperty": {
            "display": "Set HUD Property",
            "description": "Sets a property on a HUD element.",
            "requiredArgs": [
                { "HUD Element": "HUDElement" },
                { "Property": "string" },
                { "Value": "primitive" }
            ],
            "optionalArgs": [],
            "repeatedArgs": []
        },
        "panCamera": {
            "display": "Pan Camera",
            "description": "Pans the camera to the target object.",
            "requiredArgs": [
                { "Object": "node" }
            ],
            "optionalArgs": [
                { "Seconds": "number" }
            ],
            "repeatedArgs": []
        },
        "showAlert": {
            "display": "Alert Player",
            "description": "Displays a message to the player in the HUD.",
            "requiredArgs": [
                { "Message": "string" }
            ],
            "optionalArgs": [],
            "repeatedArgs": []
        },
        // "resetRoverSensors": {
        //     "display": "",
        //     "description": "",
        //     "requiredArgs": [],
        //     "optionalArgs": [],
        //     "repeatedArgs": []
        // },
        "playVideo": {
            "display": "Play Video",
            "description": "Play the specified video.",
            "requiredArgs": [
                { "Video": "video" }
            ],
            "optionalArgs": [],
            "repeatedArgs": []
        },
        "setCinematicCameraView": {
            "display": "Set Camera View",
            "description": "Sets the camera position and rotation.",
            "requiredArgs": [
                { "Pose": "pose" }
            ],
            "optionalArgs": [],
            "repeatedArgs": []
        },
        "setThirdPersonStartPose": {
            "display": "Set Third-Person View",
            "description": "Sets the default third-person camera view.",
            "requiredArgs": [
                { "Pose": "pose" }
            ],
            "optionalArgs": [],
            "repeatedArgs": []
        },
        "resetCameraView": {
            "display": "Reset Camera View",
            "description": "Resets the camera to the default position.",
            "requiredArgs": [],
            "optionalArgs": [],
            "repeatedArgs": []
        },
        "callOutObjective": {
            "display": "Call Out Objective Tile",
            "description": "Causes the objective tile to flash.",
            "requiredArgs": [
                { "Coordinates": "point2D" }
            ],
            "optionalArgs": [],
            "repeatedArgs": []
        },
        "cancelCallOut": {
            "display": "Disable Call Out Tile",
            "description": "Hides the flashing objective tile.",
            "requiredArgs": [],
            "optionalArgs": [],
            "repeatedArgs": []
        },
        "setObjective": {
            "display": "Set Objective Text",
            "description": "Sets the objective text that is displayed to the user.",
            "requiredArgs": [
                { "Text": "string" }
            ],
            "optionalArgs": [],
            "repeatedArgs": []
        }
    }
    return actions;
}

//@ sourceURL=editor/triggerObjects.js