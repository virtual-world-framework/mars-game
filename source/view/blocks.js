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


'use strict';

var BlocklyApps = {
  getMsg: function( id ) { return ""; }
}; 

// Extensions to Blockly's language and JavaScript generator.

Blockly.Blocks['ordered_pair'] = {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(75);
    this.appendValueInput("INPUT")
        .setCheck(['OrderedGet'])
        .appendField("(")
        .appendField(new Blockly.FieldTextInput("0"), "x")
        .appendField(",")
        .appendField(new Blockly.FieldTextInput("0"), "y")
        .appendField(")");
    this.setOutput(true, null);
    this.data = currentBlocklyNodeID;
    var thisBlock = this;
    this.setTooltip('Represents an array of values or grid coordinates');
  },

  /**
   * Fires when the workspace changes or Blockly.mainWorkspace.fireChangeEvent() is called
   */
  onchange: function() {
    if (!this.workspace || this.data === undefined) {
      // Block has been deleted.
      return;
    }
  }
};

Blockly.JavaScript['ordered_pair'] = function( block ) {
  var input = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_ATOMIC) || '';
  var xValue = block.getFieldValue('x');
  var yValue = block.getFieldValue('y');

  if ( isNaN( xValue ) || xValue === "" ){
    xValue = 0;
    block.setFieldValue( '0','x' );
  } else if ( isNaN( yValue ) || yValue === "" ){
    yValue = 0;
    block.setFieldValue( '0','y' );
  } else {

    if ( xValue % 1 !== 0 ){
      block.setFieldValue( '0','x' );
      block.setWarningText( 'Decimals not allowed.' );
    }
    else if ( xValue > 99 || xValue < -99){
      block.setFieldValue( '0' ,'x' );
      block.setWarningText( 'Must be between -99 and 99' );
    } else {
      block.setWarningText( null );
      block.setFieldValue( xValue ,'x' );
    }

    if ( yValue % 1 !== 0 ){
      block.setFieldValue( '0','y' );
      block.setWarningText( 'Decimals not allowed.' );
    }
    else if ( yValue > 99 || yValue < -99){
      block.setFieldValue( '0' ,'y' );
      block.setWarningText( 'Must be between -99 and 99' );
    } else {
      block.setWarningText( null );
      block.setFieldValue( yValue ,'y' );
    }
  }

  var inputCheck = input[0] + input[1];

  if ( inputCheck === '.x') {
    var code =  xValue + input.slice( 2 );
    return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
  } else if ( inputCheck === '.y') {
    var code =  yValue + input.slice( 2 );
    return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
  } else {
    var code = [ xValue , yValue ] + input;
    return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
  }
  
};

Blockly.Blocks['ordered_get'] = {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(75);
    this.appendValueInput("INPUT")
        .setCheck(['OperatorAddSubtract','OperatorMultiplyDivide','LeftParenthesis','RightParenthesis','Conditional','ANDOR' ])
        .appendField(new Blockly.FieldDropdown([[".x", ".x"], [".y", ".y"]]), "OPTION");
    this.setOutput(true, "OrderedGet");
    this.data = currentBlocklyNodeID;
    this.setTooltip('Retrieves X or Y values from ordered pair blocks');
  }
};

Blockly.JavaScript['ordered_get'] = function(block) {
  var input = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_ATOMIC) || '';
  var dropdown = block.getFieldValue('OPTION');

  var code = '';

  if ( dropdown === '.x' ) {
    code = '.x';
  } else {
    code = '.y';
  }

  return [ code + input, Blockly.JavaScript.ORDER_ATOMIC ];
};

Blockly.Blocks[ 'variables_get' ] = {
  /**
   * Block for variable getter.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl( 'http://google.com' );
    this.setColour( 330 );
    this.appendValueInput( 'INPUT' )
        .appendField( Blockly.Msg.VARIABLES_GET_TITLE )
        .appendField( new Blockly.FieldVariable( Blockly.Msg.VARIABLES_GET_ITEM ), 'VAR' )
        .appendField( "?", "VALUE" )
        .appendField( Blockly.Msg.VARIABLES_GET_TAIL )
        .setCheck( [ 'Number','Boolean','Variable','OperatorAddSubtract','OperatorMultiplyDivide','LeftParenthesis','RightParenthesis','Conditional','ANDOR' ] );
    this.setOutput( true );
    this.setTooltip( Blockly.Msg.VARIABLES_GET_TOOLTIP );
    this.contextMenuMsg_ = Blockly.Msg.VARIABLES_GET_CREATE_SET;
    this.contextMenuType_ = 'variables_set';
    this.data = currentBlocklyNodeID;
  },
  /**
   * Return all variables referenced by this block.
   * @return {!Array.<string>} List of variable names.
   * @this Blockly.Block
   */
  getVars: function() {
    return [ this.getFieldValue( 'VAR' ) ];
  },
  /**
   * Notification that a variable is renaming.
   * If the name matches one of this block's variables, rename it.
   * @param {string} oldName Previous name of variable.
   * @param {string} newName Renamed variable.
   * @this Blockly.Block
   */
  renameVar: function( oldName, newName ) {
    if ( Blockly.Names.equals( oldName, this.getFieldValue( 'VAR' ) ) ) {
      this.setFieldValue( newName, 'VAR' );
    }
  },
  /**
   * Add menu option to create getter/setter block for this setter/getter.
   * @param {!Array} options List of menu options to add to.
   * @this Blockly.Block
   */
  customContextMenu: function( options ) {
    var option = { enabled: false };
    var name = this.getFieldValue( 'VAR' );
    option.text = this.contextMenuMsg_.replace( '%1', name );
    var xmlField = goog.dom.createDom( 'field', null, name );
    xmlField.setAttribute( 'name', 'VAR' );
    var xmlBlock = goog.dom.createDom( 'block', null, xmlField );
    xmlBlock.setAttribute( 'type', this.contextMenuType_ );
    option.callback = Blockly.ContextMenu.callbackFactory( this, xmlBlock );
    options.push( option );
  },

  /**
   * Fires when the workspace changes or Blockly.mainWorkspace.fireChangeEvent() is called
   */
  onchange: function() {
    if (!this.workspace || this.data === undefined) {
      // Block has been deleted.
      return;
    }
    //Evaluate and return the code stored in the block.
    var code = Blockly.JavaScript.variableDB_.getName( this.getFieldValue( 'VAR' ),
      Blockly.Variables.NAME_TYPE );
    var val = blocklyVariables[ code ]

    if ( val === undefined ) {
      val = '?';
    }
    this.setFieldValue( '(' + val + ')','VALUE' );
  }

};

Blockly.JavaScript[ 'variables_get' ] = function( block ) {
  // Variable getter.
  var argument0 = Blockly.JavaScript.valueToCode( block, 'INPUT',
      Blockly.JavaScript.ORDER_ATOMIC) || '';


  var code = Blockly.JavaScript.variableDB_.getName( block.getFieldValue( 'VAR' ),
      Blockly.Variables.NAME_TYPE );
  return [ ( code + argument0 ) , Blockly.JavaScript.ORDER_ATOMIC ];
};

Blockly.Blocks['variables_set'] = {
  /**
   * Block for variable setter.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.VARIABLES_SET_HELPURL);
    this.setColour( 330 );
    this.interpolateMsg(
        // TODO: Combine these messages instead of using concatenation.
        Blockly.Msg.VARIABLES_SET_TITLE + ' %1 ' +
        Blockly.Msg.VARIABLES_SET_TAIL + ' %2',
        ['VAR', new Blockly.FieldVariable(Blockly.Msg.VARIABLES_SET_ITEM)],
        ['VALUE', [ 'Boolean','Number','Variable','LeftParenthesis' ], Blockly.ALIGN_RIGHT],
        Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.VARIABLES_SET_TOOLTIP);
    this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
    this.contextMenuType_ = 'variables_get';
    this.data = currentBlocklyNodeID;
  },
  /**
   * Return all variables referenced by this block.
   * @return {!Array.<string>} List of variable names.
   * @this Blockly.Block
   */
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  /**
   * Notification that a variable is renaming.
   * If the name matches one of this block's variables, rename it.
   * @param {string} oldName Previous name of variable.
   * @param {string} newName Renamed variable.
   * @this Blockly.Block
   */
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setFieldValue(newName, 'VAR');
    }
  },
  customContextMenu: Blockly.Blocks['variables_get'].customContextMenu
};

Blockly.JavaScript['variables_set'] = function(block) {
  // Variable setter.
  var argument0 = Blockly.JavaScript.valueToCode(block, 'VALUE',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.JavaScript.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);

  var extraCode = "vwf.fireEvent( '" + vwf_view.kernel.application() + 
                  "', 'updatedBlocklyVariable', " + " [ '" + varName + "', " + argument0 + " ] );\n";

  return varName + ' = ' + argument0 + ';\n' + extraCode;

};

Blockly.Blocks[ 'logic_cond_out' ] = {
  init: function() {
    this.setColour( 60 );
    this.appendValueInput( "INPUT" )
        .appendField(new Blockly.FieldDropdown([["=", "==="],["≠", "!=="],[">", ">"],
          ["<", "<"],[">=", ">="],["<=", "<="]]), "VALUE")
        .setCheck( [ 'Boolean','Variable','Number','OperatorAddSubtract','LeftParenthesis','RightParenthesis' ] );
    this.setOutput( true, "Conditional" );
    var thisBlock = this;
    this.data = currentBlocklyNodeID;
    this.setTooltip( function() {
      var content = {
        text: "A block for selecting and/or operators"
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
  }
};

Blockly.JavaScript['logic_cond_out' ] = function( block ) {
  
  var dropdown_value = block.getFieldValue('VALUE');

  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT',
      Blockly.JavaScript.ORDER_ATOMIC) || '';

  return [ dropdown_value + argument0 , Blockly.JavaScript.ORDER_ATOMIC ];

};

Blockly.Blocks[ 'logic_andor_out' ] = {
  init: function() {
    this.setColour( 60 );
    this.appendValueInput( "INPUT" )
        .appendField(new Blockly.FieldDropdown([["AND", "&&"],["OR", "||"]]), "VALUE")
        .setCheck( [ 'Boolean','Variable','LeftParenthesis','RightParenthesis' ] );
    this.setOutput( true, "ANDOR" );
    var thisBlock = this;
    this.data = currentBlocklyNodeID;
    this.setTooltip( function() {
      var content = {
        text: "A block for selecting and/or operators"
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
  }
};

Blockly.JavaScript['logic_andor_out' ] = function( block ) {
  
  var dropdown_value = block.getFieldValue('VALUE');

  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT',
      Blockly.JavaScript.ORDER_ATOMIC) || '';

  return [ dropdown_value + argument0 , Blockly.JavaScript.ORDER_ATOMIC ];

};

Blockly.Blocks[ 'logic_boolean' ] = {
  init: function() {
    this.setColour( 60 );
    this.appendValueInput( "INPUT" )
        .appendField( new Blockly.FieldDropdown([["false", "false"],["true", "true"]] ), "BOOL" )
        .setCheck( [ 'ANDOR','Variable','LeftParenthesis','RightParenthesis' ] );
    this.setOutput( true, "Boolean" );
    var thisBlock = this;
    this.data = currentBlocklyNodeID;
    this.setTooltip( function() {
      var content = {
        text: "A block for selecting boolean values"
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
  }
};

Blockly.JavaScript['logic_boolean' ] = function( block ) {
  
  var dropdown_value = block.getFieldValue('BOOL');

  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT',
      Blockly.JavaScript.ORDER_ATOMIC) || '';

  return [ dropdown_value + argument0 , Blockly.JavaScript.ORDER_ATOMIC ];

};

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
        .setCheck(['Boolean','Number','LeftParenthesis','Variable'])
        .appendField(new Blockly.FieldDropdown(OPERATORS), 'MODE');
    this.appendStatementInput('DO')
        .appendField(Blockly.Msg.CONTROLS_WHILEUNTIL_INPUT_DO);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.data = currentBlocklyNodeID;
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

  var until = block.getFieldValue( 'MODE' ) == 'UNTIL';

  var argument0 = Blockly.JavaScript.valueToCode( block, 'BOOL',
      until ? Blockly.JavaScript.ORDER_LOGICAL_NOT :
      Blockly.JavaScript.ORDER_NONE ) || 'false';

  var branch = Blockly.JavaScript.statementToCode( block, 'DO' );
  // if (Blockly.JavaScript.INFINITE_LOOP_TRAP) {
  //   branch = Blockly.JavaScript.INFINITE_LOOP_TRAP.replace(/%1/g,
  //       '\'block_id_' + block.id + '\'') + branch;
  // }

  if ( until ) {
     argument0 = '! (' + argument0 + ')';
  }

  
  if( argument0.split('(').length == argument0.split(')').length ) {
    var code = 'while ('+ argument0 +') {\n' + branch + '}\n';
  } else {
    var code = 'while ('+ false +') {\n' + branch + '}\n';
  }

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

Blockly.Blocks['controls_if_nomut'] = {
  // If/elseif/else condition.
  init: function() {
    this.setHelpUrl(Blockly.Msg.CONTROLS_IF_HELPURL);
    this.setColour(20);
    this.appendValueInput('IF0')
        .setCheck(['Boolean','LeftParenthesis','Variable'])
        .appendField(Blockly.Msg.CONTROLS_IF_MSG_IF);
    this.appendStatementInput('DO0')
        .appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.data = currentBlocklyNodeID;
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
          .setCheck(['Boolean','LeftParenthesis','Variable'])
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
              .setCheck(['Boolean','LeftParenthesis','Variable'])
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

Blockly.Blocks['controls_if_else_nomut'] = {
  // If/elseif/else condition.
  init: function() {
    this.setHelpUrl(Blockly.Msg.CONTROLS_IF_HELPURL);
    this.setColour(20);
    this.appendValueInput('IF0')
        .setCheck(['Boolean','LeftParenthesis','Variable'])
        .appendField(Blockly.Msg.CONTROLS_IF_MSG_IF);
    this.appendStatementInput('DO0')
        .appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendStatementInput('ELSE')
          .appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSE);
    this.data = currentBlocklyNodeID;
    //this.setMutator(new Blockly.Mutator(['controls_if_elseif',
       //                                  'controls_if_else']));
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
    this.elseCount_ = 1;
  },
  mutationToDom: function() {
    if (!this.elseifCount_ && !this.elseCount_) {
      return null;
    }
    var container = document.createElement('mutation');

    container.setAttribute('else', 1);
    
    return container;
  },
  domToMutation: function(xmlElement) {
    //this.elseifCount_ = parseInt(xmlElement.getAttribute('elseif'), 10);
    this.elseCount_ = 1
    for (var x = 1; x <= this.elseifCount_; x++) {
      this.appendValueInput('IF' + x)
          .setCheck(['Boolean','LeftParenthesis','Variable'])
          .appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSEIF);
      this.appendStatementInput('DO' + x)
          .appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
    }
    if (this.elseCount_) {
      
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
              .setCheck(['Boolean','LeftParenthesis','Variable'])
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

Blockly.JavaScript['controls_if_nomut'] = function(block) {
  // If/elseif/else condition.
  var n = 0;
  var argument = Blockly.JavaScript.valueToCode(block, 'IF' + n,
      Blockly.JavaScript.ORDER_NONE) || 'false';
  var branch = Blockly.JavaScript.statementToCode(block, 'DO' + n);
  var code = 'if (' + argument + ') {\n' + branch + '}';
  return code + '\n';
};

Blockly.JavaScript['controls_if_else_nomut'] = function(block) {
  // If/elseif/else condition.
  var n = 0;
  var argument = Blockly.JavaScript.valueToCode(block, 'IF' + n,
      Blockly.JavaScript.ORDER_NONE) || 'false';
  var branch = Blockly.JavaScript.statementToCode(block, 'DO' + n);
  var code = 'if (' + argument + ') {\n' + branch + '}';
  if (block.elseCount_) {
    branch = Blockly.JavaScript.statementToCode(block, 'ELSE');
    code += ' else {\n' + branch + '}';
  }
  return code + '\n';
};


Blockly.JavaScript[ 'controls_sensor_anomaly' ] = function( block ) {
  
  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_ATOMIC) || '';

  return [ "vwf.getProperty( '" + block.data + "', 'anomalySensorValue' )" + argument0, Blockly.JavaScript.ORDER_ATOMIC ];

};

Blockly.Blocks[ 'controls_sensor_anomaly' ] = {
  init: function() {
    this.setColour( 30 );
    this.appendValueInput('INPUT')
        .appendField('Anomaly Adjacent: ')
        .appendField("?", "VALUE");
    this.setOutput( true, "Boolean" );
    this.data = currentBlocklyNodeID;
    //this.setEditable(false);
    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "Checks our scanner for anomalies (items/rovers/other) in all 8 squares around the rover."
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
  },
  onchange: function() {
    if (!this.workspace || this.data === undefined) {
      // Block has been deleted.
      return;
    }
    var anomalyValue = vwf.getProperty( this.data, "anomalySensorValue" );
    this.setEditable(true);
    if ( anomalyValue === true ) {
      this.setFieldValue( "(TRUE)",'VALUE' );
    } else {
      this.setFieldValue( "(FALSE)",'VALUE' );
    }
    this.setEditable(false);
  }
};

Blockly.JavaScript[ 'controls_sensor_collision' ] = function( block ) {
  
  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_ATOMIC) || '';

  return [ "vwf.getProperty( '" + block.data + "', 'collisionSensorValue' )" + argument0, Blockly.JavaScript.ORDER_ATOMIC ];

  
};

Blockly.Blocks[ 'controls_sensor_collision' ] = {
  init: function() {
    this.setColour( 30 );
    this.appendValueInput('INPUT')
        .appendField('Collision: ')
        .appendField("?", "VALUE");
    this.setOutput( true, "Boolean" );
    this.data = currentBlocklyNodeID;
    //this.setEditable(false);
    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "Checks our scanner to see if there is a collision immediately (one square) ahead."
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
  },
  onchange: function() {
    if (!this.workspace || this.data === undefined) {
      // Block has been deleted.
      return;
    }
    var collisionValue = vwf.getProperty( this.data, "collisionSensorValue" );

    this.setEditable(true);
    if ( collisionValue === true ) {
      this.setFieldValue( "(TRUE)",'VALUE' );
    } else {
      this.setFieldValue( "(FALSE)",'VALUE' );
    }
    this.setEditable(false);
  }
};

Blockly.JavaScript[ 'controls_sensor_signal' ] = function( block ) {

  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_ATOMIC) || '';

  return [ "vwf.getProperty( '" + block.data + "', 'signalSensorValue' )" + argument0, Blockly.JavaScript.ORDER_ATOMIC ];

};

Blockly.Blocks[ 'controls_sensor_signal' ] = {
  init: function() {
    this.setColour( 30 );
    this.appendValueInput('INPUT')
        .appendField('Signal: ')
        .appendField("?", "VALUE")
        .setCheck(['OperatorAddSubtract','OperatorMultiplyDivide','LeftParenthesis','RightParenthesis','Conditional']);
    this.setOutput(true, null);
    this.data = currentBlocklyNodeID;
    
    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "Checks our scanner for base location in a 360° arc that starts on the X-axis. Returns a value between 0 and 360. Returns -1 if you are at the signal location."
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
  },
  onchange: function() {
    if (!this.workspace || this.data === undefined) {
      // Block has been deleted.
      return;
    }
    this.setEditable(true);
    var signalValue = vwf.getProperty( this.data, "signalSensorValue" );
    this.setFieldValue( '(' + signalValue + '°)','VALUE' );
    this.setEditable(false);
  }
};


Blockly.JavaScript[ 'controls_sensor_heading' ] = function( block ) {

  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_ATOMIC) || '';

  return [ "vwf.getProperty( '" + block.data + "', 'headingSensorValue' )" + argument0, Blockly.JavaScript.ORDER_ATOMIC ];
 
};

Blockly.Blocks[ 'controls_sensor_heading' ] = {
  init: function() {
    this.setColour( 30 );
    this.appendValueInput('INPUT')
        .appendField('Heading: ')
        .appendField("?", "VALUE")
        .setCheck(['OperatorAddSubtract','OperatorMultiplyDivide','LeftParenthesis','RightParenthesis','Conditional']);
    this.setOutput(true, null);
    this.data = currentBlocklyNodeID;
    //this.setEditable(false);
    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "Checks our rover for its heading in a 360° arc that starts on the X-axis. Returns a value between 0 and 360"
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
  },
  onchange: function() {
    if (!this.workspace || this.data === undefined) {
      // Block has been deleted.
      return;
    }
    this.setEditable(true);
    var headingValue = vwf.getProperty( this.data, "headingSensorValue" );
    this.setFieldValue( '(' + headingValue + '°)','VALUE' );
    this.setEditable(false);
  }
};

Blockly.Blocks['rover_moveForward'] = {
  // Block for moving forward.
  init: function() {
    // we need a url to set this to
    //this.setHelpUrl('http://code.google.com/p/blockly/wiki/Move');
    
    this.setColour(290);
    this.appendDummyInput()
        .appendField( 'Forward' );
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.data = currentBlocklyNodeID;
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

Blockly.Blocks['rover_moveRadial'] = {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(20);
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Move:");
     this.appendDummyInput()
         .setAlign(Blockly.ALIGN_CENTRE)
         .appendField("Δx");
    this.appendValueInput("x");
     this.appendDummyInput()
         .setAlign(Blockly.ALIGN_CENTRE)
         .appendField("Δy");
    this.appendValueInput("y");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "null");
    this.setNextStatement(true, "null");
    this.data = currentBlocklyNodeID;
    var thisBlock = this;
    this.setTooltip("Moves the specified number of spaces along the X and Y axes");
  }
};

Blockly.JavaScript['rover_moveRadial'] = function(block) {
  var value_x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC) || 0;
  var value_y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC) || 0;

  // How long should we take to execute this block?
  var exeTime = Math.round( Math.sqrt(value_x*value_x + value_y*value_y) );

  var action = {
    nodeID: Blockly.JavaScript.vwfID,
    methodName: 'moveRadial',
    exeTime: exeTime,
    args: [ value_x, value_y ]
  };
  return constructBlockExeFuncCall( block, action );
};

Blockly.Blocks['rover_turn'] = {
  // Block for turning left or right.
  init: function() {
    var DIRECTIONS =
        [[ 'Turn: Left', 'Turn: Left' ],
         [ 'Turn: Right', 'Turn: Right' ] ];
    
    // we need a url to set this to
    //this.setHelpUrl('http://code.google.com/p/blockly/wiki/Turn');
    
    this.setColour(290);
    this.appendDummyInput("Turn: ")
        .appendField(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.data = currentBlocklyNodeID;
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
  var turnCommand;
  var value = block.getFieldValue('DIR');
  switch ( value ) {
    case "Left":
    case "Turn: Left":
        turnCommand = "turnLeft";
        break;
    case "Right":
    case "Turn: Right":
        turnCommand = "turnRight";
        break;
    default:
        console.log( "Error in Turn block!", value );
  }
  var angle = Blockly.JavaScript.valueToCode(block, 'ANGLE', Blockly.JavaScript.ORDER_NONE) || '0';
  var t = Blockly.JavaScript.valueToCode(block, 'TIME', Blockly.JavaScript.ORDER_NONE) || '0';
  var action = {
    nodeID: Blockly.JavaScript.vwfID,
    methodName: turnCommand,
    args: []
  };
  return constructBlockExeFuncCall( block, action );
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
                        ['TIMES', ['Number', 'Variable', 'LeftParenthesis'], Blockly.ALIGN_RIGHT ],
                        Blockly.ALIGN_RIGHT );
    this.appendStatementInput( 'DO' )
        .appendField( Blockly.Msg.CONTROLS_REPEAT_INPUT_DO );
    this.setPreviousStatement( true );
    this.setNextStatement( true );
    this.setInputsInline( true );
    this.data = currentBlocklyNodeID;
    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "Repeats the contained blocks a certain number of times.",
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
  if( endVar.split('(').length == endVar.split(')').length ) {
      
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
  }
  else {
    code += 'for (var xrepeat = 0; xrepeat < 0; xrepeat++) {\n' +
      branch + '}\n';
      return constructBlockExeEventCall( block ) + code;
  }
  
};

Blockly.Blocks[ 'math_number_out' ] = {
  init: function() {
    this.setColour( 60 );
    this.appendValueInput( "INPUT" )
        .appendField(new Blockly.FieldDropdown([["270", "270"],["180", "180"],["90", "90"],["45", "45"],["10", "10"],["9", "9"],["8", "8"],
         ["7", "7"],["6", "6"],["5", "5"],["4", "4"],["3", "3"],["2", "2"],
         ["1", "1"],["0", "0"],["-1", "-1"], ["-2", "-2"], ["-3", "-3"], 
         ["-4", "-4"], ["-5", "-5"], ["-6", "-6"], ["-7", "-7"], ["-8", "-8"], 
         ["-9", "-9"], ["-10", "-10"]]), "VALUE")
        .setCheck( [ 'OperatorAddSubtract','OperatorMultiplyDivide','Variable','LeftParenthesis','RightParenthesis','Conditional' ] );
    this.setOutput( true, 'Number' );
    this.data = currentBlocklyNodeID;
    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "A block for selecting number values 10 through -10."
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
    
  }
};

Blockly.JavaScript['math_number_out' ] = function( block ) {
  
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

Blockly.Blocks['math_number_field'] = {
  init: function() {
    this.setColour( 60 );
    this.setHelpUrl('http://www.example.com/');
    this.appendValueInput("INPUT")
        .setCheck( [ 'OperatorAddSubtract','OperatorMultiplyDivide','Variable','LeftParenthesis','RightParenthesis','Conditional' ] )
        .appendField(new Blockly.FieldTextInput("1"), "VALUE");
    this.setOutput( true, 'Number' );
    this.data = currentBlocklyNodeID;
    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "A block for entering number values -999 through 999."
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
  }
};

Blockly.JavaScript['math_number_field'] = function( block ) {
  var value_input = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_ATOMIC);
  var text_value = block.getFieldValue('VALUE');

  if ( isNaN( text_value ) || text_value === "" ){
    text_value = 0;
    block.setFieldValue( '0','VALUE' );
  } else {
    if ( text_value % 1 !== 0 ){
      block.setFieldValue( '0','VALUE' );
      block.setWarningText( 'Decimals not allowed.' );
    }
    else if ( text_value > 999 || text_value < -999){
      block.setFieldValue( '0' ,'VALUE' );
      block.setWarningText( 'Must be between -999 and 999' );
    } else {
      block.setWarningText( null );
      block.setFieldValue( text_value ,'VALUE' );
    }
  }

  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT',
      Blockly.JavaScript.ORDER_ATOMIC) || '';

  if ( argument0[0] === 'x' || argument0[0] === '(' ){
    return [ text_value + '*' + argument0 , Blockly.JavaScript.ORDER_ATOMIC ];
  } else {
    return [ text_value + argument0 , Blockly.JavaScript.ORDER_ATOMIC ];
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
    this.data = currentBlocklyNodeID;
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
        .appendField('+')

        .setCheck(['Number','Variable','LeftParenthesis']);

    this.setOutput(true, 'OperatorAddSubtract');
    this.data = currentBlocklyNodeID;
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

  return [ '+' + argument0 , Blockly.JavaScript.ORDER_ATOMIC ];

};

Blockly.Blocks['graph_subtract'] = {
  /**
   * Block for basic subtraction arithmetic operator.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(120);
    this.appendValueInput('INPUT')
        .appendField('-')
        .setCheck(['Number','Variable','LeftParenthesis']);
    this.setOutput(true, 'OperatorAddSubtract');
    this.data = currentBlocklyNodeID;
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

  if ( argument0[0] === '-' ){
    return [ "+" + argument0.slice( 1 ), Blockly.JavaScript.ORDER_ATOMIC ];
  } else {
    return [ '-' + argument0 , Blockly.JavaScript.ORDER_ATOMIC ];
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
        .appendField('×')
        .setCheck(['Number','Variable','LeftParenthesis','OperatorAddSubtract']);
    this.setOutput(true, 'OperatorMultiplyDivide');
    this.data = currentBlocklyNodeID;
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
  if ( argument0[0] === '+' ){
    return ['*' + argument0.substring(1), Blockly.JavaScript.ORDER_ATOMIC];
  } else {
    return ['*' + argument0, Blockly.JavaScript.ORDER_ATOMIC];
  }
};


Blockly.Blocks[ 'graph_divide' ] = {
  /**
   * Block for basic divide arithmetic operator.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(120);
    this.appendValueInput('INPUT')
        .appendField('÷')
        .setCheck(['Number','Variable','LeftParenthesis','OperatorAddSubtract']);
    this.setOutput(true, 'OperatorMultiplyDivide');
    this.data = currentBlocklyNodeID;
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
  if ( argument0[0] === '+' ){
    return ['/' + argument0.substring(1), Blockly.JavaScript.ORDER_ATOMIC];
  } else {
    return ['/' + argument0, Blockly.JavaScript.ORDER_ATOMIC];
  }
};

Blockly.Blocks['graph_left_paren'] = {
  /**
   * Block for basic left parenthesis operator.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(280);
    this.appendValueInput('INPUT')
        .appendField('(')
        .setCheck(['Number','Boolean','Variable','OperatorAddSubtract','RightParenthesis']);
    this.setOutput(true, null);
    this.data = currentBlocklyNodeID;
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
    this.data = currentBlocklyNodeID;
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
        this.data = currentBlocklyNodeID;
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

  var blockCode = " { 'blockName': '" + block + "', 'id': " + block.id + ", ";
  blockCode += ( action.exeTime ) ? "'exeTime': " + action.exeTime + "}" : "'exeTime': 1 }";
  var actionCode = "{ 'nodeID': '" + action.nodeID + "', 'methodName': '" + action.methodName + "', ";
  actionCode += ( action.args.length > 0 ) ? "'args': [" + action.args + "]}" : "'args': [] }";
  var returnCode = "vwf.callMethod( '" + vwf_view.kernel.application() + "', 'executeBlock', [ " + blockCode + "," +
                    actionCode + "] );\n"; 

  return returnCode; 
}


//@ sourceURL=blocks.js
