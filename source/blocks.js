
'use strict';


var BlocklyApps = {
  getMsg: function( id ) { return ""; }
}; 


// Extensions to Blockly's language and JavaScript generator.

Blockly.Blocks['rover_moveForward'] = {
  // Block for moving forward.
  init: function() {
    // we need a url to set this to
    //this.setHelpUrl('http://code.google.com/p/blockly/wiki/Move');
    
    this.setColour(290);
    this.appendDummyInput()
        .appendField( 'forward' );
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Moves the rover on the screen representing the player forward one square on mars');
  }
};

Blockly.JavaScript['rover_moveForward'] = function(block) {
  var dist = Blockly.JavaScript.valueToCode(block, 'DISTANCE', Blockly.JavaScript.ORDER_NONE) || '0';
  var t = Blockly.JavaScript.valueToCode(block, 'TIME', Blockly.JavaScript.ORDER_NONE) || '1';
  return "vwf.callMethod( '"+Blockly.JavaScript.vwfID+"', 'moveForward' );\n";
};

Blockly.Blocks['rover_forward_ext'] = {
  init: function() {
    
    //this.setHelpUrl('http://www.example.com/');
    
    this.setColour(290);
    this.appendDummyInput()
        .appendField("forward");
    this.appendValueInput("UNITS")
        .setCheck("Number")
        .appendField("units");
    this.appendValueInput("TIME")
        .setCheck("Number")
        .appendField("time");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
  }
};

Blockly.JavaScript['rover_forward_ext'] = function(block) {
  var value_units = Blockly.JavaScript.valueToCode(block, 'UNITS', Blockly.JavaScript.ORDER_ATOMIC) || '1';
  var value_time = Blockly.JavaScript.valueToCode(block, 'TIME', Blockly.JavaScript.ORDER_ATOMIC) || '1';
  return "vwf.callMethod( '"+Blockly.JavaScript.vwfID+"', 'moveForward', [ "+value_units+", "+value_time+" ] );\n";
};

Blockly.Blocks['rover_turn'] = {
  // Block for turning left or right.
  init: function() {
    var DIRECTIONS =
        [[ 'turnLeft', 'turnLeft' ],
         [ 'turnRight', 'turnRight' ] ];
    
    // we need a url to set this to
    //this.setHelpUrl('http://code.google.com/p/blockly/wiki/Turn');
    
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

Blockly.Blocks['rover_forever'] = {
  // Block for forever loop.
  init: function() {
    
    //this.setHelpUrl('http://code.google.com/p/blockly/wiki/Repeat');
    
    this.setColour(120);
    this.appendDummyInput()
        .appendField( 'repeat until' )
        .appendField( new Blockly.FieldImage('source/blockly/media/marker.png', 12, 16) );
    this.appendStatementInput('DO')
        .appendField( 'do' );
    this.setPreviousStatement(true);
    this.setTooltip( 'Moves the rover until the next goal is reached' );
  }
};

Blockly.JavaScript['rover_forever'] = function(block) {
  // Generate JavaScript for forever loop.
  var branch = Blockly.JavaScript.statementToCode(block, 'DO');
  if (Blockly.JavaScript.INFINITE_LOOP_TRAP) {
    branch = Blockly.JavaScript.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'block_id_' + block.id + '\'') + branch;
  }
  return 'while (true) {\n' + branch + '}\n';
};


//@ sourceURL=blocks.js
