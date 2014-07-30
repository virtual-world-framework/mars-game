
'use strict';

var self;

this.initialize = function() {
    self = this;
}

var BlocklyApps = {
  getMsg: function( id ) { return ""; }
}; 



this.getBlackboardValue = function( name ) {
  var scene = vwf_view.kernel.application();
  var retVal = scene.sceneBlackboard[ name ];
  return retVal;
}
// Extensions to Blockly's language and JavaScript generator.


Blockly.Blocks['controls_whileUntil'] = {
  /**
   * Block for 'do while/until' loop.
   * @this Blockly.Block
   */
  init: function() {
    var OPERATORS =
        [[Blockly.Msg.CONTROLS_WHILEUNTIL_OPERATOR_WHILE, 'WHILE'],
         [Blockly.Msg.CONTROLS_WHILEUNTIL_OPERATOR_UNTIL, 'UNTIL']];
    this.setHelpUrl(Blockly.Msg.CONTROLS_WHILEUNTIL_HELPURL);
    this.setColour(120);
    this.appendValueInput('BOOL')
        .setCheck('Boolean')
        .appendField(new Blockly.FieldDropdown(OPERATORS), 'MODE');
    this.appendStatementInput('DO')
        .appendField(Blockly.Msg.CONTROLS_WHILEUNTIL_INPUT_DO);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      var op = thisBlock.getFieldValue('MODE');
      var TOOLTIPS = {
        'WHILE': Blockly.Msg.CONTROLS_WHILEUNTIL_TOOLTIP_WHILE,
        'UNTIL': Blockly.Msg.CONTROLS_WHILEUNTIL_TOOLTIP_UNTIL
      };
      return TOOLTIPS[op];
    });
  }
};

Blockly.JavaScript['controls_whileUntil'] = function(block) {

  var until = block.getFieldValue('MODE') == 'UNTIL';

  var argument0 = Blockly.JavaScript.valueToCode(block, 'BOOL',
      until ? Blockly.JavaScript.ORDER_LOGICAL_NOT :
      Blockly.JavaScript.ORDER_NONE) || 'false';

  var branch = Blockly.JavaScript.statementToCode(block, 'DO');
  if (Blockly.JavaScript.INFINITE_LOOP_TRAP) {
    branch = Blockly.JavaScript.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'block_id_' + block.id + '\'') + branch;
  }

  if (until) {
     argument0 = '!' + argument0;
  }

  var code = 'while ('+ argument0 +') {\n' + branch + '}\n';
  return constructBlockExeEventCall( block ) + code;

  // Do while/until loop.
  // var until = block.getFieldValue('MODE') == 'UNTIL';
  // var argument0 = Blockly.JavaScript.valueToCode(block, 'BOOL',
  //     until ? Blockly.JavaScript.ORDER_LOGICAL_NOT :
  //     Blockly.JavaScript.ORDER_NONE) || 'false';
  // var branch = Blockly.JavaScript.statementToCode(block, 'DO');
  // branch = Blockly.JavaScript.addLoopTrap(branch, block.id);
  // if (until) {
  //   argument0 = '!' + argument0;
  // }
  // return 'while (' + argument0 + ') {\n' + branch + '}\n';
};

Blockly.Blocks['controls_if'] = {
  // If/elseif/else condition.
  init: function() {
    this.setHelpUrl(Blockly.Msg.CONTROLS_IF_HELPURL);
    this.setColour(20);
    this.appendValueInput('IF0')
        .setCheck('Boolean')
        .appendField(Blockly.Msg.CONTROLS_IF_MSG_IF);
    this.appendStatementInput('DO0')
        .appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setMutator(new Blockly.Mutator(['controls_if_elseif',
                                         'controls_if_else']));
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      if (!thisBlock.elseifCount_ && !thisBlock.elseCount_) {
        return Blockly.Msg.CONTROLS_IF_TOOLTIP_1;
      } else if (!thisBlock.elseifCount_ && thisBlock.elseCount_) {
        return Blockly.Msg.CONTROLS_IF_TOOLTIP_2;
      } else if (thisBlock.elseifCount_ && !thisBlock.elseCount_) {
        return Blockly.Msg.CONTROLS_IF_TOOLTIP_3;
      } else if (thisBlock.elseifCount_ && thisBlock.elseCount_) {
        return Blockly.Msg.CONTROLS_IF_TOOLTIP_4;
      }
      return '';
    });
    this.elseifCount_ = 0;
    this.elseCount_ = 0;
  },
  mutationToDom: function() {
    if (!this.elseifCount_ && !this.elseCount_) {
      return null;
    }
    var container = document.createElement('mutation');
    if (this.elseifCount_) {
      container.setAttribute('elseif', this.elseifCount_);
    }
    if (this.elseCount_) {
      container.setAttribute('else', 1);
    }
    return container;
  },
  domToMutation: function(xmlElement) {
    this.elseifCount_ = parseInt(xmlElement.getAttribute('elseif'), 10);
    this.elseCount_ = parseInt(xmlElement.getAttribute('else'), 10);
    for (var x = 1; x <= this.elseifCount_; x++) {
      this.appendValueInput('IF' + x)
          .setCheck('Boolean')
          .appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSEIF);
      this.appendStatementInput('DO' + x)
          .appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
    }
    if (this.elseCount_) {
      this.appendStatementInput('ELSE')
          .appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSE);
    }
  },
  decompose: function(workspace) {
    var containerBlock = Blockly.Block.obtain(workspace, 'controls_if_if');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var x = 1; x <= this.elseifCount_; x++) {
      var elseifBlock = Blockly.Block.obtain(workspace, 'controls_if_elseif');
      elseifBlock.initSvg();
      connection.connect(elseifBlock.previousConnection);
      connection = elseifBlock.nextConnection;
    }
    if (this.elseCount_) {
      var elseBlock = Blockly.Block.obtain(workspace, 'controls_if_else');
      elseBlock.initSvg();
      connection.connect(elseBlock.previousConnection);
    }
    return containerBlock;
  },
  compose: function(containerBlock) {
    // Disconnect the else input blocks and remove the inputs.
    if (this.elseCount_) {
      this.removeInput('ELSE');
    }
    this.elseCount_ = 0;
    // Disconnect all the elseif input blocks and remove the inputs.
    for (var x = this.elseifCount_; x > 0; x--) {
      this.removeInput('IF' + x);
      this.removeInput('DO' + x);
    }
    this.elseifCount_ = 0;
    // Rebuild the block's optional inputs.
    var clauseBlock = containerBlock.getInputTargetBlock('STACK');
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'controls_if_elseif':
          this.elseifCount_++;
          var ifInput = this.appendValueInput('IF' + this.elseifCount_)
              .setCheck('Boolean')
              .appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSEIF);
          var doInput = this.appendStatementInput('DO' + this.elseifCount_);
          doInput.appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
          // Reconnect any child blocks.
          if (clauseBlock.valueConnection_) {
            ifInput.connection.connect(clauseBlock.valueConnection_);
          }
          if (clauseBlock.statementConnection_) {
            doInput.connection.connect(clauseBlock.statementConnection_);
          }
          break;
        case 'controls_if_else':
          this.elseCount_++;
          var elseInput = this.appendStatementInput('ELSE');
          elseInput.appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSE);
          // Reconnect any child blocks.
          if (clauseBlock.statementConnection_) {
            elseInput.connection.connect(clauseBlock.statementConnection_);
          }
          break;
        default:
          throw 'Unknown block type.';
      }
      clauseBlock = clauseBlock.nextConnection &&
          clauseBlock.nextConnection.targetBlock();
    }
  },
  saveConnections: function(containerBlock) {
    // Store a pointer to any connected child blocks.
    var clauseBlock = containerBlock.getInputTargetBlock('STACK');
    var x = 1;
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'controls_if_elseif':
          var inputIf = this.getInput('IF' + x);
          var inputDo = this.getInput('DO' + x);
          clauseBlock.valueConnection_ =
              inputIf && inputIf.connection.targetConnection;
          clauseBlock.statementConnection_ =
              inputDo && inputDo.connection.targetConnection;
          x++;
          break;
        case 'controls_if_else':
          var inputDo = this.getInput('ELSE');
          clauseBlock.statementConnection_ =
              inputDo && inputDo.connection.targetConnection;
          break;
        default:
          throw 'Unknown block type.';
      }
      clauseBlock = clauseBlock.nextConnection &&
          clauseBlock.nextConnection.targetBlock();
    }
  }
};

Blockly.Blocks['controls_if_if'] = {
  // If condition.
  init: function() {
    this.setColour(20);
    this.appendDummyInput()
        .appendField(Blockly.Msg.CONTROLS_IF_IF_TITLE_IF);
    this.appendStatementInput('STACK');
    this.setTooltip(Blockly.Msg.CONTROLS_IF_IF_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks['controls_if_elseif'] = {
  // Else-If condition.
  init: function() {
    this.setColour(20);
    this.appendDummyInput()
        .appendField(Blockly.Msg.CONTROLS_IF_ELSEIF_TITLE_ELSEIF);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.CONTROLS_IF_ELSEIF_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks['controls_if_else'] = {
  // Else condition.
  init: function() {
    this.setColour(20);
    this.appendDummyInput()
        .appendField(Blockly.Msg.CONTROLS_IF_ELSE_TITLE_ELSE);
    this.setPreviousStatement(true);
    this.setTooltip(Blockly.Msg.CONTROLS_IF_ELSE_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.JavaScript['controls_if'] = function(block) {
  // If/elseif/else condition.
  var n = 0;
  var argument = Blockly.JavaScript.valueToCode(block, 'IF' + n,
      Blockly.JavaScript.ORDER_NONE) || 'false';
  var branch = Blockly.JavaScript.statementToCode(block, 'DO' + n);
  var code = 'if (' + argument + ') {\n' + branch + '}';
  for (n = 1; n <= block.elseifCount_; n++) {
    argument = Blockly.JavaScript.valueToCode(block, 'IF' + n,
        Blockly.JavaScript.ORDER_NONE) || 'false';
    branch = Blockly.JavaScript.statementToCode(block, 'DO' + n);
    code += ' else if (' + argument + ') {\n' + branch + '}';
  }
  if (block.elseCount_) {
    branch = Blockly.JavaScript.statementToCode(block, 'ELSE');
    code += ' else {\n' + branch + '}';
  }
  return code + '\n';
};

Blockly.JavaScript[ 'controls_sensor' ] = function( block ) {
  
  var dropdown_value = block.getFieldValue('VALUE');
  var retVal = false;
  var rover = vwf_view.kernel.find( "", "//rover" )[ 0 ];

  if ( dropdown_value === 'objectAhead' ){

    vwf.callMethod( rover, 'activateSensor', [ 'forward' ] );
    var properties = vwf.getProperties( rover );
    var retVal = properties[ 'sensorValue' ];

    vwf.callMethod( rover, 'deactivateSensor', [ 'forward' ] );

  }
  if ( dropdown_value === 'noObjectAhead' ){

    vwf.callMethod( rover, 'activateSensor', [ 'forward' ] );
    var properties = vwf.getProperties( rover );
    var retVal = properties[ 'sensorValue' ];

    vwf.callMethod( rover, 'deactivateSensor', [ 'forward' ] );

  }

  return [ !retVal , Blockly.JavaScript.ORDER_ATOMIC ];
  
};

Blockly.Blocks[ 'controls_sensor' ] = {
  init: function() {
    this.setColour( 30 );
    this.appendDummyInput("INPUT")
        .appendField(new Blockly.FieldDropdown([["noObjectAhead", "noObjectAhead"],["objectAhead", "objectAhead"]]), "VALUE");
    this.setOutput( true, "Boolean" );
    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "A dropdown selector for sensing objects in the environment."
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
  }
};

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

Blockly.JavaScript['rover_moveForward'] = function( block ) {
  var dist = Blockly.JavaScript.valueToCode(block, 'DISTANCE', Blockly.JavaScript.ORDER_NONE) || '0';
  var t = Blockly.JavaScript.valueToCode(block, 'TIME', Blockly.JavaScript.ORDER_NONE) || '1';
  var action = {
    nodeID: Blockly.JavaScript.vwfID,
    methodName: 'moveForward',
    args: []
  };
  return constructBlockExeFuncCall( block, action );
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

Blockly.JavaScript['rover_forward_ext'] = function( block ) {
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

Blockly.JavaScript['rover_turn'] = function( block ) {
  // Generate JavaScript for turning left or right.
  var turnCommand = block.getFieldValue('DIR');
  var angle = Blockly.JavaScript.valueToCode(block, 'ANGLE', Blockly.JavaScript.ORDER_NONE) || '0';
  var t = Blockly.JavaScript.valueToCode(block, 'TIME', Blockly.JavaScript.ORDER_NONE) || '0';
  var action = {
    nodeID: Blockly.JavaScript.vwfID,
    methodName: turnCommand,
    args: []
  };
  return constructBlockExeFuncCall( block, action );
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

Blockly.JavaScript['rover_forever'] = function( block ) {
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
  return constructBlockExeEventCall( block ) + code;
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

Blockly.JavaScript['math_number_drop_output' ] = function( block ) {
  
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

Blockly.JavaScript['math_number_output' ] = function( block ) {
  
  var dropdown_value = block.getFieldValue('VALUE');
  
  if ( isNaN( dropdown_value ) || dropdown_value === "" ){
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


Blockly.JavaScript[ 'graph_get_x' ] = function( block ) {
  // x variable getter.
  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT',
      Blockly.JavaScript.ORDER_ATOMIC) || '';

  if ( argument0[0] === '(' ){
    return [ 'x' + '*' + argument0 , Blockly.JavaScript.ORDER_ATOMIC ];
  } else if ( !isNaN( argument0[0] ) ) {
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

Blockly.JavaScript[ 'graph_add' ] = function( block ) {
  /**
   * Code for basic addition arithmetic operator.
   * @this Blockly.Block
   */
  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT',
      Blockly.JavaScript.ORDER_ATOMIC) || '0';

  if ( block.getFieldValue('VALUE') === '-' && argument0[0] === '-' ){
    return [ "+" + argument0.slice( 1 ), Blockly.JavaScript.ORDER_ATOMIC ];
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

Blockly.JavaScript['graph_subtract'] = function( block ) {
  /**
   * Code for basic subtraction arithmetic operator.
   * @this Blockly.Block
   */
  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT',
      Blockly.JavaScript.ORDER_ATOMIC) || '0';

  if ( block.getFieldValue('VALUE') === '-' && argument0[0] === '-' ){
    return [ "+" + argument0.slice( 1 ), Blockly.JavaScript.ORDER_ATOMIC ];
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


Blockly.JavaScript[ 'graph_multiply' ] = function( block ) {
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

Blockly.JavaScript['graph_divide'] = function( block ) {
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
    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "This is a left parenthesis."
      }
      return showTooltipInBlockly( thisBlock, content );
    } ); 
  }
};

Blockly.JavaScript['graph_left_paren'] = function( block ) {
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
    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "This is a right parenthesis."
      }
      return showTooltipInBlockly( thisBlock, content );
    } ); 
  }
};

Blockly.JavaScript['graph_right_paren'] = function( block ) {
  /**
   * Code for basic right parenthesis operator.
   * @this Blockly.Block
   */

  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT',
      Blockly.JavaScript.ORDER_ATOMIC) || '';

  if ( argument0[0] === '(' || argument0[0] === 'x' || !isNaN(argument0[0]) ) {
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
        .setCheck(['Number','Variable','OperatorAddSubtract','LeftParenthesis']);
    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "This is the Y variable, also known as the dependent variable. Try setting it to a function! (e.g. y = x + 3)"
      }
      return showTooltipInBlockly( thisBlock, content );
    } ); 
  }
};

Blockly.JavaScript[ 'graph_set_y' ] = function( block ) {
  // y variable setter.
  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || '';

  if(argument0.split('(').length == argument0.split(')').length) {
    return argument0 + ';';
  } else {
    return ';';
  }
};

function constructBlockExeEventCall( block ) {
  var eventCall = "vwf.fireEvent( '" + vwf_view.kernel.application() + 
                  "', 'blockExecuted', " + " [ '" + block + "', " + block.id + " ] );\n";
  return eventCall;  
}

function constructBlockExeFuncCall( block, action ) {
  var blockCode = " { 'blockName': '" + block + "', 'id': " + block.id + "}";
  var actionCode = "{ 'nodeID': '" + action.nodeID + "', 'methodName': '" + action.methodName + "', ";
  actionCode += ( action.args.length > 0 ) ? "'args': " + action.args + " } ] );\n" : "'args': [] }";
  var returnCode = "vwf.callMethod( '" + vwf_view.kernel.application() + "', 'executeBlock', [ " + blockCode + "," +
                    actionCode + "] );\n";  
  return returnCode; 
}


//@ sourceURL=blocks.js
