goog.require('Blockly.JavaScript');

'use strict';

var BlocklyApps = {
  getMsg: function( id ) { return ""; }
}; 

var topCode = '';

Blockly.Blocks['new_scenario'] = {
  init: function() {
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Scenario");
    this.appendDummyInput()
        .appendField("Name:")
        .appendField(new Blockly.FieldTextInput(""), "NAME");
    this.appendDummyInput()
        .appendField("Brief:")
        .appendField(new Blockly.FieldTextInput(""), "BRIEF");
    this.appendDummyInput()
        .appendField("Next Scenario:")
        .appendField(new Blockly.FieldDropdown([["mission1task1", "mission1task1"], ["mission1task2", "mission1task2"], ["mission1task3", "mission1task3"]]), "NEXT");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE);
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Start State (Actions)");
    this.appendStatementInput("STARTSTATE");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Triggers");
    this.appendStatementInput("TRIGGERS");
    this.setColour(120);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  },
  onchange: function() {
    if ( !this.workspace || this.data === undefined || this.isInFlyout === true ) {
      // Block has been deleted or is in the flyout.
      return;
    }
    var text_name = this.getFieldValue('NAME');
    var brief_content = this.getFieldValue('BRIEF');
    var dropdown_next = this.getFieldValue('NEXT');
    var startStateArray = Blockly.JavaScript.statementToCode(this, 'STARTSTATE');
    var triggerArray = Blockly.JavaScript.statementToCode(this, 'TRIGGERS');

    var startStateText = ''
    var startStateCode = eval('[' + startStateArray.slice(0,-1) + ']');

    if ( startStateCode[0] !== undefined ) {
      
      for ( var i=0; i<startStateCode.length; i++ ){
         var name = startStateCode[i][ 'name' ];
         var arguments = startStateCode[i][ 'arguments' ];

         var argumentsText = '';
         for ( var j=0; j<arguments.length; j++){
            argumentsText += '    - ' + arguments[j] + '\n';
         }
         startStateText += '  - ' + name + ':\n' + argumentsText + '\n';
      }
      //console.log( startStateCode[0][ 'test' ]);
    }

    var triggerText = ''
    var triggerCode = eval('[' + triggerArray.slice(0,-1) + ']');

    if ( triggerCode[0] !== undefined ) {
      
      //Name, clause, action objects
      for ( var i=0; i<triggerCode.length; i++ ){
         var name = triggerCode[i][ 'name' ];
         var clause = triggerCode[i][ 'clause' ];
         var actions = triggerCode[i][ 'actions' ];

         var actionsText = '';
         var clauseText= '          - ' + clause;

         for ( var j=0; j<actions.length; j++){

            var actionName = actions[j][ 'name' ];
            var arguments = actions[j][ 'arguments' ];

            var actionArgumentsText = '';
            for ( var k=0; k<arguments.length; k++){
                actionArgumentsText += '            - ' + arguments[k] + '\n';
            }
             actionsText += '          - ' + actionName + ':\n' + actionArgumentsText + '';

         }
         triggerText += '        ' + name + ':\n'+'        - triggerCondition:\n' + clauseText + '\n' + '        - actions:\n' + actionsText + '\n';
      }
      //console.log( startStateCode[0][ 'test' ]);
    }
    
    topCode = '# Copyright 2016 Lockheed Martin Corporation\n'+
  '#\n'+
  '# Licensed under the Apache License, Version 2.0 (the "License"); you may\n'+
 '# not use this file except in compliance with the License. You may obtain\n'+
  '# a copy of the License at\n'+
  '#\n'+
  '#     http://www.apache.org/licenses/LICENSE-2.0\n'+
  '#\n'+
  '# Unless required by applicable law or agreed to in writing, software \n'+
  '# distributed under the License is distributed on an "AS IS" BASIS, \n'+
  '# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n'+
  '# See the License for the specific language governing permissions and \n'+
  '# limitations under the License.\n'+
  '\n'+
  '---\n'+
  'extends: ../scenario/scenario.vwf\n'+
  'properties:\n'+
  '  scenarioName: '+ text_name + '\n'+
  '\n'+
  '  scenePath: /\n'+
  '  nextScenarioPath: "'+ dropdown_next + '"\n'+
  '\n'+
  '  startState:\n'+ startStateText +
  '\n'+
  'children:\n'+
  '  triggerManager:\n'+
  '    extends: ../triggers/triggerManager.vwf\n'+
  '    properties: \n'+
  '      triggers$: \n'+ triggerText +
  '\n'+
  '  brief:\n'+
  '    extends: ../missionBrief.vwf\n'+
  '    properties:\n'+
  '      title: "'+ text_name + '"\n'+
  '      content: >\n'+
  '        '+brief_content;

  }
};

Blockly.JavaScript['new_scenario'] = function(block) {
  var text_name = block.getFieldValue('NAME');
  var dropdown_next = block.getFieldValue('NEXT');
  var statements_startstate = Blockly.JavaScript.statementToCode(block, 'STARTSTATE');
  var statements_triggers = Blockly.JavaScript.statementToCode(block, 'TRIGGERS');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  return code;
};

Blockly.Blocks['new_action'] = {
  init: function() {
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Action");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField(new Blockly.FieldDropdown([["playSound", "playSound"], ["stopSound", "stopSound"], ["resetRoverSensors", "resetRoverSensors"], ["setObjective", "setObjective"], ["writeToBlackboard", "writeToBlackboard"], ["setThirdPersonStartPose", "setThirdPersonStartPose"], ["setProperty", "setProperty"], ["addToGrid", "addToGrid"], ["setPickupActive", "setPickupActive"], ["setGridAxes", "setGridAxes"], ["loadToolbox", "loadToolbox"], ["selectRover", "selectRover"]]), "TYPE");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("(???)",'REQUIREMENTS');
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Arguments");
    this.appendStatementInput("PROPERTIES");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  },
  onchange: function() {
    if ( !this.workspace || this.data === undefined || this.isInFlyout === true ) {
      // Block has been deleted or is in the flyout.
      return;
    }
    var dropdown_type = this.getFieldValue('TYPE');
    var statements_properties = Blockly.JavaScript.statementToCode(this, 'PROPERTIES');

    var formattedArguments = eval('[' + statements_properties.slice(0, -1) + ']');
    var argumentCount = 0;

    if ( dropdown_type === 'playSound' ) {
      this.setFieldValue( '(1 Argument)', 'REQUIREMENTS' );
      argumentCount = 1;
    } 
    else if ( dropdown_type === 'setProperty' ) {
      this.setFieldValue( '(3 Arguments)', 'REQUIREMENTS' );
      argumentCount = 3;
    } else {
      this.setFieldValue( '(???)', 'REQUIREMENTS' );
      argumentCount = 0;
    }

    if ( formattedArguments.length !== argumentCount ) {
      this.setWarningText('You need to add arguments');
    } else {
      this.setWarningText(null);
    }

  }
};

Blockly.JavaScript['new_action'] = function(block) {
  var dropdown_type = block.getFieldValue('TYPE');
  var statements_properties = Blockly.JavaScript.statementToCode(block, 'PROPERTIES');

  var formattedArguments = '[' + statements_properties.slice(0, -1) + ']';
  // TODO: Assemble JavaScript into code variable.
  var code = '{"name":"' + dropdown_type + '", "arguments":'+ formattedArguments +'},';
  return code;
};

Blockly.Blocks['new_trigger'] = {
  init: function() {
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Trigger");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Name:")
        .appendField(new Blockly.FieldTextInput(""), "NAME");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Clause:")
        .appendField(new Blockly.FieldTextInput(""), "CLAUSE");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Actions");
    this.appendStatementInput("ACTIONS");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(165);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.JavaScript['new_trigger'] = function(block) {
  var text_name = block.getFieldValue('NAME');
  var text_clause = block.getFieldValue('CLAUSE');
  //var statements_clause = Blockly.JavaScript.statementToCode(block, 'CLAUSE');
  var statements_actions = Blockly.JavaScript.statementToCode(block, 'ACTIONS');

  //var formattedClause = '' + statements_clause.slice(0, -1) + '';

  //var formattedClause = "";

  //if ( statements_clause !== undefined ) {
  //  formattedClause = '' + statements_clause.slice(0, -1) + '';
  //}

  //console.log( formattedClause );

  var formattedActions = '[]';
  if ( statements_actions !== undefined ) {
    formattedActions = '[' + statements_actions.slice(0, -1) + ']';
  }

  //NOTE QUOTES AROUND CLAUSE FOR NOW
  var code = '{"name":"' + text_name + '", "clause":"'+ text_clause +'", "actions":'+ formattedActions +'},';

  return code;
};

Blockly.Blocks['new_clause'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Clause");
    this.appendStatementInput("CLAUSE");
    this.setPreviousStatement(true);
    this.setColour(195);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.JavaScript['new_clause'] = function(block) {
  var statements_clause = Blockly.JavaScript.statementToCode(block, 'CLAUSE');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  return code;
};

Blockly.Blocks['new_clauses'] = {
  init: function() {
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField(new Blockly.FieldDropdown([["doOnce", "doOnce"], ["onScenarioStart", "onScenarioStart"], ["readBlackboard", "readBlackboard"]]), "CLAUSES");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Arguments");
    this.appendStatementInput("ARGUMENTS");
    this.setPreviousStatement(true);
    this.setColour(195);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.JavaScript['new_clauses'] = function(block) {
  var dropdown_clauses = block.getFieldValue('CLAUSES');
  var statements_arguments = Blockly.JavaScript.statementToCode(block, 'ARGUMENTS');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  return code;
};

Blockly.Blocks['new_argument'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput(""), "NAME");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(0);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.JavaScript['new_argument'] = function(block) {
  var text_name = block.getFieldValue('NAME');
  // TODO: Assemble JavaScript into code variable.
  var code = '"'+ text_name + '",';
  return code;
};

Blockly.Blocks['scenario_name'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Scenario Name: ")
        .appendField(new Blockly.FieldTextInput(""), "scenarioName");
    this.setInputsInline(false);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(165);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.JavaScript['scenario_name'] = function(block) {
  var text_scenarioname = block.getFieldValue('scenarioName');
  // TODO: Assemble JavaScript into code variable.
  var code = 'test';
  return code;
};

Blockly.Blocks['scene_path'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Scene Path: ")
        .appendField(new Blockly.FieldTextInput("/"), "scenePath");
    this.setInputsInline(false);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(165);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.JavaScript['scene_path'] = function(block) {
  var text_scenepath = block.getFieldValue('scenePath');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  return code;
};

Blockly.Blocks['next_scenario_name'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Next Scenario:")
        .appendField(new Blockly.FieldDropdown([["IntroCinematic", "IntroCinematic"], ["Mission1Task1", "Mission1Task1"], ["Mission2Task2", "Mission2Task2"]]), "scenarioName");
    this.setInputsInline(false);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(165);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

  Blockly.JavaScript['next_scenario_name'] = function(block) {
  var dropdown_scenarioname = block.getFieldValue('scenarioName');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  return code;
};

Blockly.Blocks['start_state'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Start State (Insert Actions Below)");
    this.appendStatementInput("ACTIONS")
        .setCheck("ACTION");
    this.setInputsInline(false);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(165);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

  Blockly.JavaScript['start_state'] = function(block) {
  var statements_actions = Blockly.JavaScript.statementToCode(block, 'ACTIONS');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  return code;
};


Blockly.Blocks['scenario_properties'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Scenario Properties");
    this.appendStatementInput("ACTIONS");
    this.setInputsInline(false);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(90);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.JavaScript['scenario_properties'] = function(block) {
  var statements_actions = Blockly.JavaScript.statementToCode(block, 'ACTIONS');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  return code;
};

Blockly.Blocks['scenario_extends'] = {
  init: function() {
    this.appendValueInput("NAME")
        .setCheck("NODELIST")
        .appendField("Extends:");
    this.setInputsInline(false);
    this.setNextStatement(true);
    this.setColour(90);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.JavaScript['scenario_extends'] = function(block) {
  var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  return code;
};

Blockly.Blocks['scenario_children'] = {
  init: function() {
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Scenario Children:");
    this.appendStatementInput("PROPERTIES")
        .setCheck("NODE")
        .setAlign(Blockly.ALIGN_CENTRE);
    this.setInputsInline(false);
    this.setPreviousStatement(true, "NODE");
    this.setNextStatement(true, "NODE");
    this.setColour(90);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.JavaScript['scenario_children'] = function(block) {
  var statements_properties = Blockly.JavaScript.statementToCode(block, 'PROPERTIES');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  return code;
};

Blockly.Blocks['property_string'] = {
  init: function() {
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Property");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Key:")
        .appendField(new Blockly.FieldTextInput("name"), "propertyName")
        .appendField("Value:")
        .appendField(new Blockly.FieldTextInput("name"), "propertyName");
    this.setInputsInline(false);
    this.setOutput(true);
    this.setColour(345);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.JavaScript['property_string'] = function(block) {
  var text_propertyname = block.getFieldValue('propertyName');
  var text_propertyname = block.getFieldValue('propertyName');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks['property_inline'] = {
  init: function() {
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Property");
    this.appendValueInput("KEY")
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Key:");
    this.appendValueInput("VALUE")
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Value:");
    this.setInputsInline(true);
    this.setOutput(true);
    this.setColour(345);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.JavaScript['property_inline'] = function(block) {
  var value_key = Blockly.JavaScript.valueToCode(block, 'KEY', Blockly.JavaScript.ORDER_ATOMIC);
  var value_value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};
Blockly.Blocks['node_list'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Node:")
        .appendField(new Blockly.FieldDropdown([["scenario.vwf", "../scenario/scenario.vwf"], ["missionBrief.vwf", "../missionBrief.vwf"], ["triggerManager.vwf", "../triggers/triggerManager.vwf"]]), "nodeName");
    this.setInputsInline(false);
    this.setOutput(true, "NODELIST");
    this.setColour(30);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['property_topdown'] = {
  init: function() {
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Property");
    this.appendValueInput("KEY")
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Key:");
    this.appendValueInput("VALUE")
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Value:");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(345);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.JavaScript['property_topdown'] = function(block) {
  var value_key = Blockly.JavaScript.valueToCode(block, 'KEY', Blockly.JavaScript.ORDER_ATOMIC);
  var value_value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  return code;
};

Blockly.JavaScript['node_list'] = function(block) {
  var dropdown_nodename = block.getFieldValue('nodeName');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks['action'] = {
  init: function() {
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Action");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField(" ")
        .appendField(new Blockly.FieldDropdown([["stopSound", "stopSound"], ["hideBlockly", "hideBlockly"], ["clearBlockly", "clearBlockly"]]), "actionName");
    this.appendValueInput("NAME")
        .setCheck("Array")
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Properties:");
    this.setInputsInline(false);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(30);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.JavaScript['action'] = function(block) {
  var dropdown_actionname = block.getFieldValue('actionName');
  var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  return code;
};

Blockly.Blocks['trigger'] = {
  init: function() {
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Trigger");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Name:")
        .appendField(new Blockly.FieldTextInput("testTrigger"), "triggerName");
    this.appendStatementInput("CONDITIONS")
        .appendField("Conditions:");
    this.appendStatementInput("ACTIONS")
        .appendField("Actions:");
    this.setInputsInline(false);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.JavaScript['trigger'] = function(block) {
  var text_triggername = block.getFieldValue('triggerName');
  var statements_conditions = Blockly.JavaScript.statementToCode(block, 'CONDITIONS');
  var statements_actions = Blockly.JavaScript.statementToCode(block, 'ACTIONS');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  return code;
};

Blockly.Blocks['condition'] = {
  init: function() {
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Condition");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField(" ")
        .appendField(new Blockly.FieldDropdown([["onBlocklyStopped", "onBlocklyStopped"], ["isAtPosition", "isAtPosition"], ["readBlackboard", "readBlackboard"]]), "CONDITIONS");
    this.appendValueInput("PROPERTIES")
        .setCheck("Array")
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Properties:");
    this.setInputsInline(false);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(195);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.JavaScript['condition'] = function(block) {
  var dropdown_conditions = block.getFieldValue('CONDITIONS');
  var value_properties = Blockly.JavaScript.valueToCode(block, 'PROPERTIES', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  return code;
};

Blockly.Blocks['node'] = {
  init: function() {
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Node");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Name:")
        .appendField(new Blockly.FieldTextInput("testNode"), "NAME");
    this.appendValueInput("TYPE")
        .setCheck("NODELIST")
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField(" ")
        .appendField("Extends:");
    this.appendStatementInput("PROPERTIES")
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("         Properties:");
    this.setInputsInline(false);
    this.setPreviousStatement(true, "NODE");
    this.setNextStatement(true, "NODE");
    this.setColour(195);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.JavaScript['node'] = function(block) {
  var text_name = block.getFieldValue('NAME');
  var value_type = Blockly.JavaScript.valueToCode(block, 'TYPE', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_properties = Blockly.JavaScript.statementToCode(block, 'PROPERTIES');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  return code;
};