
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

    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "Moves the rover one space forward.",
        imagePath: "assets/images/tooltips/move_forward.png"
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
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
    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "Turns the rover 90 degrees counter-clockwise (left) or clockwise (right).",
        imagePath: "assets/images/tooltips/turn.png"
      }
      return showTooltipInBlockly( thisBlock, content );
    } ); 
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
    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "Moves the rover until the next goal is reached."
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
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

Blockly.Blocks[ 'controls_repeat_extended' ] = {
  /**
   * Block for repeat n times (external number).
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl( Blockly.Msg.CONTROLS_REPEAT_HELPURL );
    this.setColour( 120 );
    this.interpolateMsg( Blockly.Msg.CONTROLS_REPEAT_TITLE,
                        ['TIMES', 'Number', Blockly.ALIGN_RIGHT ],
                        Blockly.ALIGN_RIGHT );
    this.appendStatementInput( 'DO' )
        .appendField( Blockly.Msg.CONTROLS_REPEAT_INPUT_DO );
    this.setPreviousStatement( true );
    this.setNextStatement( true );
    this.setInputsInline( true );
    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "Performs a routine a certain number of " + 
        "times. Put any combination of blocks inside this block!" + 
        " (e.g. Make the rover turn left and then move forward 5 times.)",
        imagePath: "assets/images/tooltips/while.png"
      }
      return showTooltipInBlockly( thisBlock, content );
    } );    
  }
};

Blockly.JavaScript[ 'controls_repeat_extended' ] = function( block ) {
  // Repeat n times (external number).
  var repeats = Blockly.JavaScript.valueToCode( block, 'TIMES',
      Blockly.JavaScript.ORDER_ASSIGNMENT ) || '0';
  var branch = Blockly.JavaScript.statementToCode( block, 'DO' );
  var code = '';
  var loopVar = Blockly.JavaScript.variableDB_.getDistinctName(
      'count', Blockly.Variables.NAME_TYPE);
  var endVar = repeats;
  if ( !repeats.match(/^\w+$/) && !Blockly.isNumber( repeats ) ) {
    var endVar = Blockly.JavaScript.variableDB_.getDistinctName(
        'repeat_end', Blockly.Variables.NAME_TYPE );
    code += 'var ' + endVar + ' = ' + repeats + ';\n';
  }
  code += 'for (var ' + loopVar + ' = 0; ' +
      loopVar + ' < ' + endVar + '; ' +
      loopVar + '++) {\n' +
      branch + '}\n';
  return code;
};


Blockly.Blocks[ 'math_number_drop' ] = {
  init: function() {
    //this.setHelpUrl('http://www.example.com/');
    this.setColour(225);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["0", "0"],["1", "1"], ["2", "2"],
         ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"],
         ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"],
         ["13", "13"], ["14", "14"], ["15","15"]]), "VALUE");
    this.setOutput( true, "Number" );

    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "A dropdown selector for number values."
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
  }
};

Blockly.JavaScript[ 'math_number_drop' ] = function( block ) {
  
  var dropdown_value = block.getFieldValue('VALUE');

  return [ dropdown_value , Blockly.JavaScript.ORDER_ATOMIC ];
};

Blockly.Blocks[ 'math_number_drop_output' ] = {
  init: function() {
    this.setHelpUrl('http://www.google.com/');
    this.setColour( 225 );
    this.appendValueInput( "INPUT" )
        .appendField(new Blockly.FieldDropdown([["0", "0"],["1", "1"], ["2", "2"],
         ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"],
         ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"],
         ["13", "13"], ["14", "14"], ["15","15"]]), "VALUE")
        .setCheck(['OperatorAddSubtract','OperatorMultiplyDivide','Variable']);
    this.setOutput( true, "Number" );
    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "A dropdown selector for number values."
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
  }
};

Blockly.JavaScript['math_number_drop_output' ] = function(block) {
  
  var dropdown_value = block.getFieldValue('VALUE');
  
  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT',
      Blockly.JavaScript.ORDER_ATOMIC) || '';

  if (argument0[0] === 'x'){
    return [ dropdown_value + '*' + argument0, Blockly.JavaScript.ORDER_ATOMIC ];
  } else {
    return [ dropdown_value + argument0, Blockly.JavaScript.ORDER_ATOMIC ];
  }


};

Blockly.Blocks[ 'math_number_output' ] = {
  init: function() {
    this.setColour( 60 );
    this.appendValueInput( "INPUT" )
        .appendField( new Blockly.FieldTextInput( "0" ), "VALUE" )
        .setCheck( [ 'OperatorAddSubtract','OperatorMultiplyDivide','Variable','LeftParenthesis','RightParenthesis' ] );
    this.setOutput( true, "Number" );
    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "A text field for selecting number values. Try typing any number! (e.g. 1, -3, 0.2)"
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
  }
};

Blockly.JavaScript['math_number_output' ] = function(block) {
  
  var dropdown_value = block.getFieldValue('VALUE');
  
  if ( isNaN( dropdown_value ) ){
    dropdown_value = 0;
    block.setFieldValue('0','VALUE');
  }

  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT',
      Blockly.JavaScript.ORDER_ATOMIC) || '';

  if ( argument0[0] === 'x' || argument0[0] === '(' ){
    return [ dropdown_value + '*' + argument0 , Blockly.JavaScript.ORDER_ATOMIC ];
  } else {
    return [ dropdown_value + argument0 , Blockly.JavaScript.ORDER_ATOMIC ];
  }


};

Blockly.Blocks[ 'graph_get_x' ] = {
  // x variable getter.
  init: function() {

    //this.setHelpUrl(Blockly.Msg.VARIABLES_GET_HELPURL);

    this.setColour( 350 );
    this.appendValueInput( 'INPUT' )
        .appendField( 'x' )
        .setCheck( ['OperatorAddSubtract','OperatorMultiplyDivide','LeftParenthesis','RightParenthesis'] );
    this.setOutput( true, 'Variable' );
    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "This is the X variable, also known as the independent variable."
      }
      return showTooltipInBlockly( thisBlock, content );
    } ); 
  }
};


Blockly.JavaScript[ 'graph_get_x' ] = function(block) {
  // x variable getter.
  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT',
      Blockly.JavaScript.ORDER_ATOMIC) || '';

  if ( argument0[0] === '(' ){
    return [ 'x' + '*' + argument0 , Blockly.JavaScript.ORDER_ATOMIC ];
  } else {
    return [ 'x' + argument0 , Blockly.JavaScript.ORDER_ATOMIC ];
  }

};


Blockly.Blocks[ 'graph_add' ] = {
  /**
   * Block for basic addition arithmetic operator.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(120);
    this.appendValueInput('INPUT')
        .appendField(new Blockly.FieldDropdown([["+", "+"], ["-", "-"]]), "VALUE")

        .setCheck(['Number','Variable','LeftParenthesis']);

    this.setOutput(true, 'OperatorAddSubtract');

    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "This is the arithmetic operator for adding two values."
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
  }
};

Blockly.JavaScript[ 'graph_add' ] = function(block) {
  /**
   * Code for basic addition arithmetic operator.
   * @this Blockly.Block
   */
  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT',
      Blockly.JavaScript.ORDER_ATOMIC) || '0';

  if ( block.getFieldValue('VALUE') === '-' && argument0[0] === '-' ){
    return [ argument0 * (-1) , Blockly.JavaScript.ORDER_ATOMIC ];
  } else {
    return [ block.getFieldValue('VALUE') + argument0 , Blockly.JavaScript.ORDER_ATOMIC ];
  }

};

Blockly.Blocks['graph_subtract'] = {
  /**
   * Block for basic subtraction arithmetic operator.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(120);
    this.appendValueInput('INPUT')
        .appendField(new Blockly.FieldDropdown([["-", "-"], ["+", "+"]]), "VALUE")
        .setCheck(['Number','Variable','LeftParenthesis']);
    this.setOutput(true, 'OperatorAddSubtract');
    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "This is the arithmetic operator for subtracting two values."
      }
      return showTooltipInBlockly( thisBlock, content );
    } ); 
  }
};

Blockly.JavaScript['graph_subtract'] = function(block) {
  /**
   * Code for basic subtraction arithmetic operator.
   * @this Blockly.Block
   */
  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT',
      Blockly.JavaScript.ORDER_ATOMIC) || '0';

  if ( block.getFieldValue('VALUE') === '-' && argument0[0] === '-' ){
    return [ argument0 * (-1), Blockly.JavaScript.ORDER_ATOMIC ];
  } else {
    return [ block.getFieldValue('VALUE') + argument0 , Blockly.JavaScript.ORDER_ATOMIC ];
  }

};


Blockly.Blocks[ 'graph_multiply' ] = {
  /**
   * Block for basic multiply arithmetic operator.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(120);
    this.appendValueInput('INPUT')
        .appendField(new Blockly.FieldDropdown([["×", "*"],["/", "/"]]), "VALUE")
        .setCheck(['Number','Variable','LeftParenthesis']);
    this.setOutput(true, 'OperatorMultiplyDivide');
    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "This is the arithmetic operator for multiplying two values."
      }
      return showTooltipInBlockly( thisBlock, content );
    } ); 
  }
};


Blockly.JavaScript[ 'graph_multiply' ] = function(block) {
  /**
   * Code for basic multiply arithmetic operator.
   * @this Blockly.Block
   */

  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT',
      Blockly.JavaScript.ORDER_ATOMIC) || '0';


  return [block.getFieldValue('VALUE') + argument0, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.Blocks[ 'graph_divide' ] = {
  /**
   * Block for basic divide arithmetic operator.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(120);
    this.appendValueInput('INPUT')
        .appendField(new Blockly.FieldDropdown([["/", "/"],["×", "*"]]), "VALUE")
        .setCheck(['Number','Variable','LeftParenthesis']);
    this.setOutput(true, 'OperatorMultiplyDivide');
    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "This is the arithmetic operator for dividing two values."
      }
      return showTooltipInBlockly( thisBlock, content );
    } ); 
  }
};

Blockly.JavaScript['graph_divide'] = function(block) {
  /**
   * Code for basic divide arithmetic operator.
   * @this Blockly.Block
   */

  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT',
      Blockly.JavaScript.ORDER_ATOMIC) || '0';
  return [block.getFieldValue('VALUE') + argument0, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.Blocks['graph_left_paren'] = {
  /**
   * Block for basic left parenthesis operator.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(280);
    this.appendValueInput('INPUT')
        .appendField('(');
    this.setOutput(true, 'LeftParenthesis');
    this.setTooltip( "Left Parenthesis" );
    this.setOutput(true, 'VALUE');
    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "This is a left parenthesis."
      }
      return showTooltipInBlockly( thisBlock, content );
    } ); 
  }
};

Blockly.JavaScript['graph_left_paren'] = function(block) {
  /**
   * Code for basic left parenthesis operator.
   * @this Blockly.Block
   */

  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT',
      Blockly.JavaScript.ORDER_ATOMIC) || '';

  if ( argument0[0] === ')' ){
    return [ '(' + '0' + argument0 , Blockly.JavaScript.ORDER_ATOMIC ];
  } else {
    return [ '(' + argument0 , Blockly.JavaScript.ORDER_ATOMIC ];
  }
};

Blockly.Blocks['graph_right_paren'] = {
  /**
   * Block for basic right parenthesis operator.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(280);
    this.appendValueInput('INPUT')
        .appendField(')');
    this.setOutput(true, 'RightParenthesis');
    this.setOutput(true, 'VALUE');
    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "This is a right parenthesis."
      }
      return showTooltipInBlockly( thisBlock, content );
    } ); 
  }
};

Blockly.JavaScript['graph_right_paren'] = function(block) {
  /**
   * Code for basic right parenthesis operator.
   * @this Blockly.Block
   */

  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT',
      Blockly.JavaScript.ORDER_ATOMIC) || '';

  if ( argument0[0] === '(' ){
    return [ ')' + '*' + argument0 , Blockly.JavaScript.ORDER_ATOMIC ];
  } else {
    return [ ')' + argument0 , Blockly.JavaScript.ORDER_ATOMIC ];
  }

};

Blockly.Blocks['graph_set_y'] = {
  // y variable setter.
  init: function() {

    //this.setHelpUrl(Blockly.Msg.VARIABLES_SET_HELPURL);

    this.setColour(240);
    this.appendValueInput('INPUT')
        .appendField('y=')
        .setCheck(['Number','Variable','OperatorAddSubtract']);
    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "This is the Y variable, also known as the dependent variable. Try setting it to a function! (e.g. y = x + 3)"
      }
      return showTooltipInBlockly( thisBlock, content );
    } ); 
  }
};

Blockly.JavaScript[ 'graph_set_y' ] = function(block) {
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
