/**
 * Blockly Apps: Maze Blocks
 *
 * Copyright 2012 Google Inc.
 * https://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Blocks for Blockly's Maze application.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';


var BlocklyApps = {
  getMsg: function( id ) { return ""; }
}; 


// Extensions to Blockly's language and JavaScript generator.

Blockly.Blocks['rover_moveForward'] = {
  // Block for moving forward.
  init: function() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Move');
    this.setColour(290);
    this.appendDummyInput()
        .appendField( 'forward' );
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Moves the rover on the screen representing the player forward one square on the maze board');
  }
};

Blockly.JavaScript['rover_moveForward'] = function(block) {
  var dist = Blockly.JavaScript.valueToCode(block, 'DISTANCE', Blockly.JavaScript.ORDER_NONE) || '0';
  var t = Blockly.JavaScript.valueToCode(block, 'TIME', Blockly.JavaScript.ORDER_NONE) || '1';
  return "vwf.callMethod( '"+Blockly.JavaScript.vwfID+"', 'moveForward' );\n";
};

Blockly.Blocks['rover_turn'] = {
  // Block for turning left or right.
  init: function() {
    var DIRECTIONS =
        [[ 'turnLeft', 'turnLeft' ],
         [ 'turnRight', 'turnRight' ] ];
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Turn');
    this.setColour(290);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Turns the rover on the screen representing the player 90 degrees counter-clockwise (left) or clockwise (right)');
  }
};

Blockly.JavaScript['rover_turn'] = function(block) {
  // Generate JavaScript for turning left or right.
  var turnCommand = block.getFieldValue('DIR');
  var angle = Blockly.JavaScript.valueToCode(block, 'ANGLE', Blockly.JavaScript.ORDER_NONE) || '0';
  var t = Blockly.JavaScript.valueToCode(block, 'TIME', Blockly.JavaScript.ORDER_NONE) || '0';
  return "vwf.callMethod( '"+Blockly.JavaScript.vwfID+"','" + turnCommand + "');\n";
};

//@ sourceURL=blocks.js
