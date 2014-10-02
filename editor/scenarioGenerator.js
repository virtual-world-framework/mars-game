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

this.createScenario = function( scenarioName, lastScenarioName ) {
    var lastScenario = this.scenarios[ lastScenarioName ];
    if ( lastScenario ) {
        lastScenario.nextScenarioPath = scenarioName;
    }

    this.scenarios[ scenarioName ] = {
        "properties": {
            "scenarioName": scenarioName,
            "nextScenarioPath": undefined,
            "startState": []
        },
        "children": {
            "triggerManager": {
                "extends": "source/triggers/triggerManager.vwf",
                "properties": {
                    "triggers": {}
                }
            },
            "grid": {
                "extends": "source/grid.vwf",
                "properties": {
                    "minX": 0,
                    "maxX": 1,
                    "minY": 0,
                    "maxY": 1,
                    "gridOriginInSpace": [ 0, 0 ],
                    "gridSquareLength": 3,
                    "boundaryValues": [ 0 ]
                }
            }
        }
    }
}

this.addTrigger = function( scenarioName, triggerName, trigger ) {
    var scenario = this.scenarios[ scenarioName ];
    var triggers;
    if ( scenario ) {
        triggers = scenario.triggerManager.properties.triggers;
    } else {
        return;
    }
    triggers[ triggerName ] = trigger;
}

//@ sourceURL=editor/scenarioGenerator.js