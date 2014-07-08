
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

Blockly.Blocks[ 'math_number_drop' ] = {
  init: function() {
    //this.setHelpUrl('http://www.example.com/');
    this.setColour(225);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["1", "1"], ["2", "2"],
         ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"],
         ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"],
         ["13", "13"], ["14", "14"], ["15","15"]]), "VALUE");
    this.setOutput( true, "Number" );
    this.setTooltip( 'A dropdown selector for number values' );
  }
};

Blockly.JavaScript[ 'math_number_drop' ] = function( block ) {
  
  var dropdown_value = block.getFieldValue('VALUE');

  return [ dropdown_value , Blockly.JavaScript.ORDER_ATOMIC ];
};

Blockly.Blocks[ 'math_number_drop_output' ] = {
  init: function() {
    //this.setHelpUrl('http://www.example.com/');
    this.setColour( 225 );
    this.appendValueInput( "Input" )
        .appendField(new Blockly.FieldDropdown([["1", "1"], ["2", "2"],
         ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"],
         ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"],
         ["13", "13"], ["14", "14"], ["15","15"]]), "VALUE")
        .setCheck(['Operator','Variable']);
    this.setOutput( true, "Number" );
    this.setTooltip( 'A dropdown selector for number values' );
  }
};

Blockly.JavaScript['math_number_drop_output' ] = function(block) {
  
  var dropdown_value = block.getFieldValue('VALUE');
  
  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT',
      Blockly.JavaScript.ORDER_ATOMIC) || '';

  if (argument0[0] === 'x'){
    return [ dropdown_value+'*' , Blockly.JavaScript.ORDER_ATOMIC ];
  } else {
      return [ dropdown_value , Blockly.JavaScript.ORDER_ATOMIC ];
  }


};

Blockly.Blocks[ 'graph_get_x' ] = {
  // x variable getter.
  init: function() {

    //this.setHelpUrl(Blockly.Msg.VARIABLES_GET_HELPURL);

    this.setColour( 330 );
    this.appendValueInput( 'INPUT' )
        .appendField( 'x' )
        .setCheck('Operator');
    this.setOutput( true, 'Variable' );
    this.setTooltip( "Sets this variable to be equal to the input." );
  }
};

Blockly.JavaScript['graph_get_x'] = function(block) {
  // x variable getter.
  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT',
      Blockly.JavaScript.ORDER_ATOMIC) || '';

  return ['x'+argument0, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.Blocks['graph_add'] = {
  /**
   * Block for basic addition arithmetic operator.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(160);
    this.appendValueInput('INPUT')
        .appendField('+')
        .setCheck(['Number','Variable']);
    this.setOutput(true, 'Operator');
    this.setTooltip( "Addition operator" );
  }
};

Blockly.JavaScript['graph_add'] = function(block) {
  /**
   * Code for basic addition arithmetic operator.
   * @this Blockly.Block
   */
  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT',
      Blockly.JavaScript.ORDER_ATOMIC) || '0';
  return ['+' + argument0, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.Blocks['graph_subtract'] = {
  /**
   * Block for basic subtraction arithmetic operator.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(160);
    this.appendValueInput('INPUT')
        .appendField('-')
        .setCheck(['Number','Variable']);
    this.setOutput(true, 'Operator');
    this.setTooltip( "Subtraction operator" );
  }
};

Blockly.JavaScript['graph_subtract'] = function(block) {
  /**
   * Code for basic subtraction arithmetic operator.
   * @this Blockly.Block
   */

  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT',
      Blockly.JavaScript.ORDER_ATOMIC) || '0';
  return ['-' + argument0, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.Blocks['graph_multiply'] = {
  /**
   * Block for basic multiply arithmetic operator.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(160);
    this.appendValueInput('INPUT')
        .appendField('*')
        .setCheck(['Number','Variable']);
    this.setOutput(true, 'Operator');
    this.setTooltip( "Multiplication operator" );
  }
};

Blockly.JavaScript['graph_multiply'] = function(block) {
  /**
   * Code for basic multiply arithmetic operator.
   * @this Blockly.Block
   */

  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT',
      Blockly.JavaScript.ORDER_ATOMIC) || '0';
  return ['*' + argument0, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.Blocks['graph_divide'] = {
  /**
   * Block for basic divide arithmetic operator.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(160);
    this.appendValueInput('INPUT')
        .appendField('/')
        .setCheck(['Number','Variable']);
    this.setOutput(true, 'Operator');
    this.setTooltip( "Division operator" );
  }
};

Blockly.JavaScript['graph_divide'] = function(block) {
  /**
   * Code for basic divide arithmetic operator.
   * @this Blockly.Block
   */

  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT',
      Blockly.JavaScript.ORDER_ATOMIC) || '0';
  return ['/' + argument0, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.Blocks['graph_left_paren'] = {
  /**
   * Block for basic left parenthesis operator.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(110);
    this.appendValueInput('INPUT')
        .appendField('(');
    this.setOutput(true, 'VALUE');
    this.setTooltip( "Left Parenthesis" );
  }
};

Blockly.JavaScript['graph_left_paren'] = function(block) {
  /**
   * Code for basic left parenthesis operator.
   * @this Blockly.Block
   */

  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT',
      Blockly.JavaScript.ORDER_ATOMIC) || '';
  return ['(' + argument0, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.Blocks['graph_right_paren'] = {
  /**
   * Block for basic right parenthesis operator.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(110);
    this.appendValueInput('INPUT')
        .appendField(')');
    this.setOutput(true, 'VALUE');
    this.setTooltip( "Right Parenthesis" );
  }
};

Blockly.JavaScript['graph_right_paren'] = function(block) {
  /**
   * Code for basic right parenthesis operator.
   * @this Blockly.Block
   */

  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT',
      Blockly.JavaScript.ORDER_ATOMIC) || '';
  return [')' + argument0, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.Blocks['graph_set_y'] = {
  // y variable setter.
  init: function() {

    //this.setHelpUrl(Blockly.Msg.VARIABLES_SET_HELPURL);

    this.setColour(330);
    this.appendValueInput('INPUT')
        .appendField('y =');
    this.setTooltip( "Sets this variable to be equal to the input." );
  }
};

Blockly.JavaScript['graph_set_y'] = function(block) {
  // y variable setter.
  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || '';

  if(argument0.split('(').length == argument0.split(')').length) {
    return argument0 + ';';
  } else {
    return ';';
  }

  console.log (argument0);

  
};


//@ sourceURL=blocks.js
