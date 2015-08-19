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

Blockly.Blocks['ordered_pair_config'] = {
  init: function() {
    this.setColour(105);
    this.appendDummyInput()
        .appendField("(");
    this.appendValueInput("XFIELD")
        .setCheck(['LeftParenthesis','Number']);
    this.appendDummyInput()
        .appendField(",");
    this.appendValueInput("YFIELD")
        .setCheck(['LeftParenthesis','Number'])
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setOutput(true);
    this.setTooltip('');
  }
};

Blockly.JavaScript['ordered_pair_config'] = function(block) {
  var value_x = Blockly.JavaScript.valueToCode(block, 'XFIELD', Blockly.JavaScript.ORDER_ATOMIC);
  var value_y = Blockly.JavaScript.valueToCode(block, 'YFIELD', Blockly.JavaScript.ORDER_ATOMIC);

  var code = [ value_x, value_y ];

  return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
};

Blockly.Blocks['start_triangle'] = {
  init: function() {
    this.setColour(90);
    this.appendDummyInput()
        .appendField("startTriangle");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.data = currentBlocklyNodeID;
  }
};

Blockly.JavaScript['start_triangle'] = function(block) {
  return constructBlockExeEventCall( block );
};

Blockly.Blocks['end_triangle'] = {
  init: function() {
    this.setColour(0);
    this.appendDummyInput()
        .appendField("endTriangle");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.data = currentBlocklyNodeID;
  }
};

Blockly.JavaScript['end_triangle'] = function( block ) {
  return constructBlockExeEventCall( block );
};

Blockly.Blocks['mark_point'] = {
  init: function() {
    this.setColour(180);
    this.appendDummyInput()
        .appendField("markPoint")
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip( function() {
      var content = {
        text: 'Adds a point to our triangle drawing nanomatrix generator.'
      }
      return showTooltipInBlockly( thisBlock, content );
    } );

    this.data = currentBlocklyNodeID;
  },
  onchange: function() {
    if (!this.workspace || this.data === undefined) {
      // Block has been deleted.
      return;
    }
    // this.setEditable(true);
    // var blocklyNode = blocklyNodes[ this.data ];
    // var position = blocklyNode[ 'positionSensorValue' ];
    // if ( position !== undefined ) {
    //   this.setFieldValue( '[' + position[ 0 ]+ ','+ position[ 1 ] + ']','VALUE' );
    // }
    // this.setEditable(false);
  }
};

Blockly.JavaScript['mark_point'] = function(block) {
  return constructBlockExeEventCall( block );
};

Blockly.Blocks['ordered_pair'] = {
  init: function() {
    this.setColour(75);
    this.appendValueInput("INPUT")
        .setCheck(['OperatorAddSubtract','OrderedGet'])
        .appendField("(")
        .appendField(new Blockly.FieldTextInput("0"), "x")
        .appendField(",")
        .appendField(new Blockly.FieldTextInput("0"), "y")
        .appendField(")");
    this.setOutput(true, null);
    this.data = currentBlocklyNodeID;
    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "An ordered pair block."
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
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
  var input = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_MEMBER) || '';
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


  if ( input[0] === '-' ){
    var otherOP = input.slice( 1 );
    otherOP = otherOP.split(',');
    if ( otherOP.constructor === Array ) {
      var code = [ Number(xValue) - Number(otherOP[0]), Number(yValue) - Number(otherOP[1]) ];
      return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
    }
  } else if ( input[0] === '+' ){
    var otherOP = input.slice( 1 );
    otherOP = otherOP.split(',');
    if ( otherOP.constructor === Array ) {
      var code = [ Number(xValue) + Number(otherOP[0]), Number(yValue) + Number(otherOP[1]) ];
      return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
    }
  } else if ( inputCheck === '.x') {
    var code =  xValue + input.slice( 2 );
    return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
  } else if ( inputCheck === '.y') {
    var code =  yValue + input.slice( 2 );
    return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
  } else {
    var code = [ xValue , yValue ] + input;
    return [ code, Blockly.JavaScript.ORDER_MEMBER ];
  }
  
};

Blockly.Blocks['ordered_get'] = {
  init: function() {
    this.setColour(105);
    this.appendValueInput("INPUT")
        .setCheck(['OperatorAddSubtract','OperatorMultiplyDivide','LeftParenthesis','RightParenthesis','Conditional','ANDOR' ])
        .appendField(new Blockly.FieldDropdown([[".x", ".x"], [".y", ".y"]]), "OPTION");
    this.setOutput(true, "OrderedGet");
    this.data = currentBlocklyNodeID;
    this.setTooltip( function() {
      var content = {
        text: "Retrieves X or Y values from ordered pair blocks."
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
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

Blockly.Blocks['ordered_get_noin'] = {
  init: function() {
    this.setColour(75);
    this.appendDummyInput("")
        .appendField(new Blockly.FieldDropdown([[".x", ".x"], [".y", ".y"]]), "OPTION");
    this.setOutput(true, "OrderedGet");
    this.data = currentBlocklyNodeID;
    this.setTooltip( function() {
      var content = {
        text: 'Retrieves X or Y values from ordered pair blocks.'
      }
      return showTooltipInBlockly( thisBlock, content );
    } );

  }
};

Blockly.JavaScript['ordered_get_noin'] = function(block) {

  var dropdown = block.getFieldValue('OPTION');

  var code = '';

  if ( dropdown === '.x' ) {
    code = '.x';
  } else {
    code = '.y';
  }

  return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
};

Blockly.Blocks[ 'variables_get' ] = {
  /**
   * Block for variable getter.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour( 330 );
    this.appendValueInput( 'INPUT' )
        .appendField( Blockly.Msg.VARIABLES_GET_TITLE )
        .appendField( new Blockly.FieldVariable( Blockly.Msg.VARIABLES_GET_ITEM ), 'VAR' )
        // .appendField( "?", "VALUE" )
        .appendField( Blockly.Msg.VARIABLES_GET_TAIL )
        .setCheck( [ 'Number','Boolean','Variable','OrderedGet','OperatorAddSubtract','OperatorMultiplyDivide','LeftParenthesis','RightParenthesis','Conditional','ANDOR' ] );
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
    // var code = Blockly.JavaScript.variableDB_.getName( this.getFieldValue( 'VAR' ),
    //   Blockly.Variables.NAME_TYPE );
    // var val = blocklyVariables[ code ];

    // if ( val === undefined ) {
    //   val = '?';
    // }
    
    // this.setFieldValue( '(' + val + ')','VALUE' );
    
  }

};

Blockly.JavaScript[ 'variables_get' ] = function( block ) {
  // Variable getter.
  var input = Blockly.JavaScript.valueToCode( block, 'INPUT',
      Blockly.JavaScript.ORDER_ATOMIC) || '';

  var inputCheck = input[0] + input[1];

  var code = Blockly.JavaScript.variableDB_.getName( block.getFieldValue( 'VAR' ),
      Blockly.Variables.NAME_TYPE );

  // var val = blocklyVariables[ code ];
  // if ( input[0] === '-' && input.indexOf( ',' ) !== -1 ){
  //   var otherOP = input.slice( 1 );

  //   if ( otherOP.constructor === Array ) {
  //     code = [ code + '[0] -=' + otherOP[0], code + '[1] -=' + otherOP[1] ];
  //     return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
  //   }
  // } else if ( input[0] === '+' && input.indexOf( ',' ) !== -1 ){
  //   var otherOP =  input.slice( 1 );

  //   if ( otherOP.constructor === Array ) {
  //     code = [ code + '[0] +=' + otherOP[0], code + '[1] +=' + otherOP[1] ];
  //     return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
  //   }
  // } else if ( inputCheck === '.x') {
  //    code =  code + '[0]' + input.slice( 2 );
  //   return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
  // } else if ( inputCheck === '.y') {
  //    code =  code + '[1]' + input.slice( 2 );
  //   return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
  // } else {
  //    code = code + input;
  //   return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
  // }
    var val = blocklyVariables[ code ];
   
    if ( inputCheck === '.x') {
       code =  code + '[0]' + input.slice( 2 );
      return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
    } else if ( inputCheck === '.y') {
       code =  code + '[1]' + input.slice( 2 );
      return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
    } else {
       code = code + input;
      return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
    }

};

Blockly.Blocks[ 'variables_get_noin' ] = {
  /**
   * Block for variable getter.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour( 330 );
    this.appendDummyInput('')
        .appendField( Blockly.Msg.VARIABLES_GET_TITLE )
        .appendField( new Blockly.FieldVariable( Blockly.Msg.VARIABLES_GET_ITEM ), 'VAR' )
        .appendField( "?", "VALUE" )
        .appendField( Blockly.Msg.VARIABLES_GET_TAIL )
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
    var val = blocklyVariables[ code ];

    if ( val === undefined ) {
      val = '?';
    }
    
    this.setFieldValue( '(' + val + ')','VALUE' );
    
  }

};

Blockly.JavaScript[ 'variables_get_noin' ] = function( block ) {
  // Variable getter.
  var code = Blockly.JavaScript.variableDB_.getName( block.getFieldValue( 'VAR' ),
      Blockly.Variables.NAME_TYPE );

    return [ code, Blockly.JavaScript.ORDER_ATOMIC ];

};

Blockly.JavaScript['variables_set'] = function( block ) {
  // Variable setter.
  var argument0 = Blockly.JavaScript.valueToCode(block, 'VALUE',
      Blockly.JavaScript.ORDER_NONE) || '0';
  var varName = Blockly.JavaScript.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);

  // var extraCode = "vwf.fireEvent( '" + vwf_view.kernel.application() + 
  //                 "', 'updatedBlocklyVariable', " + " [ '" + varName + "', " + varName + " ] );\n";
  // var toReturn = varName + ' = ' + argument0 + ';\n' + extraCode;
  // return toReturn;

  if ( argument0.indexOf(',') !== -1 ) {
    var extraCode = "vwf.fireEvent( '" + vwf_view.kernel.application() + 
                  "', 'updatedBlocklyVariable', " + " [ '" + varName + "', [" + argument0 + "] ] );\n";
    var toReturn = varName + ' = [' +  argument0  + '];\n' + extraCode;
    return toReturn;
  } else if ( argument0.indexOf( '[0]' ) !== -1 && argument0.indexOf( varName ) !== -1 && blocklyStopped === false ) {
      
      var varOP = blocklyVariables[ varName ];

      if ( varOP !== undefined ) {
        console.log('updating [0]');
        var val = varOP[ 0 ];
        vwf.fireEvent( vwf_view.kernel.application(), 'updatedBlocklyVariable',  [ varName, val ] );
      }
      return '';

  } else if ( argument0.indexOf( '[1]' ) !== -1 && argument0.indexOf( varName ) !== -1 && blocklyStopped === false ) {
      
      var varOP = blocklyVariables[ varName ];

      if ( varOP !== undefined ) {
        console.log('updating [1]');
        var val = varOP[ 1 ];
        vwf.fireEvent( vwf_view.kernel.application(), 'updatedBlocklyVariable',  [ varName, val ] );
      }
      return '';

  } else {
    var extraCode = "vwf.fireEvent( '" + vwf_view.kernel.application() + 
                  "', 'updatedBlocklyVariable', " + " [ '" + varName + "', " + argument0 + " ] );\n";
    var toReturn = varName + ' = ' + argument0 + ';\n' + extraCode;
    return toReturn;
  }


};


Blockly.Blocks[ 'logic_cond_out' ] = {
  init: function() {
    this.setColour( 60 );
    this.appendValueInput( "INPUT" )
        .appendField(new Blockly.FieldDropdown([["=", "==="],["≠", "!=="],[">", ">"],
          ["<", "<"],["≥", ">="],["≤", "<="]]), "VALUE")
        .setCheck( [ 'Boolean','Variable','Number','OperatorAddSubtract','LeftParenthesis','RightParenthesis' ] );
    this.setOutput( true, "Conditional" );
    var thisBlock = this;
    this.data = currentBlocklyNodeID;
    this.setTooltip( function() {
      var content = {
        text: "A block for selecting conditional operators."
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
  }
};

Blockly.JavaScript['logic_cond_out' ] = function( block ) {
  
  var dropdown_value = block.getFieldValue('VALUE');

  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT',
      Blockly.JavaScript.ORDER_ATOMIC) || '';
  if ( argument0[0] === '[' ) {
    return [ dropdown_value + '.equals(' + argument0 + ')' , Blockly.JavaScript.ORDER_ATOMIC ];
  } else {
    return [ dropdown_value + argument0, Blockly.JavaScript.ORDER_ATOMIC ];
  }
};

Blockly.Blocks[ 'logic_cond_eq_out' ] = {
  init: function() {
    this.setColour( 60 );
    this.appendValueInput( "INPUT" )
        .appendField("=", "VALUE")
        .setCheck( [ 'Boolean','Variable','Number','OperatorAddSubtract','LeftParenthesis','RightParenthesis' ] );
    this.setOutput( true, "Conditional" );
    var thisBlock = this;
    this.data = currentBlocklyNodeID;
    this.setTooltip( function() {
      var content = {
        text: "An equal-to conditional operator block."
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
  }
};

Blockly.JavaScript['logic_cond_eq_out' ] = function( block ) {
  
  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT',
      Blockly.JavaScript.ORDER_ATOMIC) || '';

    return [ '===' + argument0, Blockly.JavaScript.ORDER_ATOMIC ];

};

Blockly.Blocks[ 'logic_cond_neq_out' ] = {
  init: function() {
    this.setColour( 60 );
    this.appendValueInput( "INPUT" )
        .appendField("≠", "VALUE")
        .setCheck( [ 'Boolean','Variable','Number','OperatorAddSubtract','LeftParenthesis','RightParenthesis' ] );
    this.setOutput( true, "Conditional" );
    var thisBlock = this;
    this.data = currentBlocklyNodeID;
    this.setTooltip( function() {
      var content = {
        text: "A not-equal-to conditional operator block."
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
  }
};

Blockly.JavaScript['logic_cond_neq_out' ] = function( block ) {
  
  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT',
      Blockly.JavaScript.ORDER_ATOMIC) || '';

    return [ '!==' + argument0, Blockly.JavaScript.ORDER_ATOMIC ];

};

Blockly.Blocks[ 'logic_cond_gt_out' ] = {
  init: function() {
    this.setColour( 60 );
    this.appendValueInput( "INPUT" )
        .appendField(">", "VALUE")
        .setCheck( [ 'Boolean','Variable','Number','OperatorAddSubtract','LeftParenthesis','RightParenthesis' ] );
    this.setOutput( true, "Conditional" );
    var thisBlock = this;
    this.data = currentBlocklyNodeID;
    this.setTooltip( function() {
      var content = {
        text: "A greater-than conditional operator block."
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
  }
};

Blockly.JavaScript['logic_cond_gt_out' ] = function( block ) {
  
  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT',
      Blockly.JavaScript.ORDER_ATOMIC) || '';

    return [ '>' + argument0, Blockly.JavaScript.ORDER_ATOMIC ];

};

Blockly.Blocks[ 'logic_cond_lt_out' ] = {
  init: function() {
    this.setColour( 60 );
    this.appendValueInput( "INPUT" )
        .appendField("<", "VALUE")
        .setCheck( [ 'Boolean','Variable','Number','OperatorAddSubtract','LeftParenthesis','RightParenthesis' ] );
    this.setOutput( true, "Conditional" );
    var thisBlock = this;
    this.data = currentBlocklyNodeID;
    this.setTooltip( function() {
      var content = {
        text: "A less-than conditional operator block."
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
  }
};

Blockly.JavaScript['logic_cond_lt_out' ] = function( block ) {
  
  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT',
      Blockly.JavaScript.ORDER_ATOMIC) || '';

    return [ '<' + argument0, Blockly.JavaScript.ORDER_ATOMIC ];

};

Blockly.Blocks[ 'logic_andor_out' ] = {
  init: function() {
    this.setColour( 60 );
    this.appendValueInput( "INPUT" )
        .appendField(new Blockly.FieldDropdown([["AND", "&&"],["OR", "||"],["NOT", "!"]]), "VALUE")
        .setCheck( [ 'Boolean','Variable','LeftParenthesis','RightParenthesis' ] );
    this.setOutput( true, "ANDOR" );
    var thisBlock = this;
    this.data = currentBlocklyNodeID;
    this.setTooltip( function() {
      var content = {
        text: "A block for selecting and/or operators."
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

Blockly.Blocks[ 'logic_and' ] = {
  init: function() {
    this.setColour( 60 );
    this.appendValueInput( "INPUT" )
        .appendField("AND", "VALUE")
        .setCheck( [ 'Boolean','Variable','LeftParenthesis','RightParenthesis' ] );
    this.setOutput( true, "ANDOR" );
    var thisBlock = this;
    this.data = currentBlocklyNodeID;
    this.setTooltip( function() {
      var content = {
        text: "A binary, logical AND block."
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
  }
};

Blockly.JavaScript['logic_and' ] = function( block ) {
  
  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT',
      Blockly.JavaScript.ORDER_ATOMIC) || '';

  return [ '&&' + argument0 , Blockly.JavaScript.ORDER_ATOMIC ];

};

Blockly.Blocks[ 'logic_or' ] = {
  init: function() {
    this.setColour( 60 );
    this.appendValueInput( "INPUT" )
        .appendField("OR", "VALUE")
        .setCheck( [ 'Boolean','Variable','LeftParenthesis','RightParenthesis' ] );
    this.setOutput( true, "ANDOR" );
    var thisBlock = this;
    this.data = currentBlocklyNodeID;
    this.setTooltip( function() {
      var content = {
        text: "A binary, logical OR block."
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
  }
};

Blockly.JavaScript['logic_or' ] = function( block ) {
  
  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT',
      Blockly.JavaScript.ORDER_ATOMIC) || '';

  return [ '||' + argument0 , Blockly.JavaScript.ORDER_ATOMIC ];

};

Blockly.Blocks[ 'logic_not' ] = {
  init: function() {
    this.setColour( 60 );
    this.appendValueInput( "INPUT" )
        .appendField("NOT", "VALUE")
        .setCheck( [ 'Boolean','Variable','LeftParenthesis','RightParenthesis' ] );
    this.setOutput( true, "ANDOR" );
    var thisBlock = this;
    this.data = currentBlocklyNodeID;
    this.setTooltip( function() {
      var content = {
        text: "A unary, logical NOT block."
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
  }
};

Blockly.JavaScript['logic_not' ] = function( block ) {
  
  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT',
      Blockly.JavaScript.ORDER_ATOMIC) || '';

  return [ '!' + argument0 , Blockly.JavaScript.ORDER_ATOMIC ];

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
        text: "A block for selecting boolean values."
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


Blockly.JavaScript[ 'controls_sensor_metal' ] = function( block ) {
  
  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_ATOMIC) || '';

  return [ "vwf.getProperty( '" + block.data + "', 'metalSensorValue' )" + argument0, Blockly.JavaScript.ORDER_ATOMIC ];

};

Blockly.Blocks[ 'controls_sensor_metal' ] = {
  init: function() {
    this.setColour( 30 );
    this.appendValueInput('INPUT')
        .appendField('Metal Detected', "VALUE")
        //.appendField("?", "VALUE");
    this.setOutput( true, "Boolean" );
    this.data = currentBlocklyNodeID;
    //this.setEditable(false);
    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "Checks our scanner for metal (items/rovers/other) in all 8 squares around the rover and provides a boolean value."
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
  },
  onchange: function() {
    if (!this.workspace || this.data === undefined) {
      // Block has been deleted.
      return;
    }
    // var metalValue = vwf.getProperty( this.data, "metalSensorValue" );
    // this.setEditable(true);
    // if ( metalValue === true ) {
    //   this.setFieldValue( "Metal Detected",'VALUE' );
    // } else {
    //   this.setFieldValue( "Metal Not Detected",'VALUE' );
    // }
    // this.setEditable(false);
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
        .appendField('Collision')
        //.appendField("?", "VALUE");
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
    // var collisionValue = vwf.getProperty( this.data, "collisionSensorValue" );

    // this.setEditable(true);
    // if ( collisionValue === true ) {
    //   this.setFieldValue( "(TRUE)",'VALUE' );
    // } else {
    //   this.setFieldValue( "(FALSE)",'VALUE' );
    // }
    // this.setEditable(false);
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
        .appendField('Signal')
        //.appendField("?", "VALUE")
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
    // this.setEditable(true);
    // var signalValue = vwf.getProperty( this.data, "signalSensorValue" );
    // this.setFieldValue( '(' + signalValue + '°)','VALUE' );
    // this.setEditable(false);
  }
};

Blockly.JavaScript[ 'controls_sensor_position' ] = function( block ) {

  var input = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_ATOMIC) || '';

  var inputCheck = input[0] + input[1];

  if ( inputCheck === '.x') {
    var code =  "vwf.getProperty( '" + block.data + "', 'positionSensorValueX' );" + input.slice( 2 );
    return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
  } else if ( inputCheck === '.y') {
    var code =  "vwf.getProperty( '" + block.data + "', 'positionSensorValueY' );" + input.slice( 2 );
    return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
  } else {
    var code = "vwf.getProperty( '" + block.data + "', 'positionSensorValue' )" + input;
    return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
  }

 // return [ "vwf.getProperty( '" + block.data + "', 'positionSensorValue' )", Blockly.JavaScript.ORDER_ATOMIC ];

};

Blockly.Blocks[ 'controls_sensor_position' ] = {
  init: function() {
    this.setColour( 30 );
    this.appendValueInput('INPUT')
        .appendField('Position')
        //.appendField("(?,?)", "VALUE")
        .setCheck(['OrderedGet']);
        //.setCheck(['OperatorAddSubtract','OperatorMultiplyDivide','LeftParenthesis','RightParenthesis','Conditional']);
    this.setOutput(true, null);
    this.data = currentBlocklyNodeID;
    
    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "Checks our scanner for our current location in the coordinate plane."
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
  },
  onchange: function() {
    if (!this.workspace || this.data === undefined) {
      // Block has been deleted.
      return;
    }
    // this.setEditable(true);
    // var blocklyNode = blocklyNodes[ this.data ];
    // var position = blocklyNode[ 'positionSensorValue' ];
    // if ( position !== undefined ) {
    //   this.setFieldValue( '(' + position[ 0 ]+ ','+ position[ 1 ] + ')','VALUE' );
    // }
    // this.setEditable(false);
  }
};

Blockly.JavaScript[ 'controls_sensor_position_x' ] = function( block ) {

  var input = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_ATOMIC) || '';
  
  var code = "vwf.getProperty( '" + block.data + "', 'positionSensorValueX' )" + input;
  
  return [ code, Blockly.JavaScript.ORDER_ATOMIC ];

 // return [ "vwf.getProperty( '" + block.data + "', 'positionSensorValue' )", Blockly.JavaScript.ORDER_ATOMIC ];

};

Blockly.Blocks[ 'controls_sensor_position_x' ] = {
  init: function() {
    this.setColour( 30 );
    this.appendValueInput('INPUT')
        .appendField('Position X')
        //.appendField("(?)", "VALUE")
        .setCheck(['OperatorAddSubtract','OperatorMultiplyDivide','Conditional']);
        //.setCheck(['OperatorAddSubtract','OperatorMultiplyDivide','LeftParenthesis','RightParenthesis','Conditional']);
    this.setOutput(true, null);
    this.data = currentBlocklyNodeID;
    
    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "Checks our scanner for our current location in the coordinate plane."
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
  },
  onchange: function() {
    if (!this.workspace || this.data === undefined) {
      // Block has been deleted.
      return;
    }
    // this.setEditable(true);
    // var blocklyNode = blocklyNodes[ this.data ];
    // var position = blocklyNode[ 'positionSensorValueX' ];
    // if ( position !== undefined ) {
    //   this.setFieldValue( '(' + position + ')','VALUE' );
    // }
    // this.setEditable(false);
  }
};

Blockly.JavaScript[ 'controls_sensor_position_y' ] = function( block ) {

  var input = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_ATOMIC) || '';

  var code = "vwf.getProperty( '" + block.data + "', 'positionSensorValueY' )" + input;

  return [ code, Blockly.JavaScript.ORDER_ATOMIC ];

 // return [ "vwf.getProperty( '" + block.data + "', 'positionSensorValue' )", Blockly.JavaScript.ORDER_ATOMIC ];

};

Blockly.Blocks[ 'controls_sensor_position_y' ] = {
  init: function() {
    this.setColour( 30 );
    this.appendValueInput('INPUT')
        .appendField('Position Y')
        //.appendField("(?)", "VALUE")
        .setCheck(['OperatorAddSubtract','OperatorMultiplyDivide','Conditional']);
        //.setCheck(['OperatorAddSubtract','OperatorMultiplyDivide','LeftParenthesis','RightParenthesis','Conditional']);
    this.setOutput(true, null);
    this.data = currentBlocklyNodeID;
    
    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "Checks our scanner for our current location in the coordinate plane."
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
  },
  onchange: function() {
    if (!this.workspace || this.data === undefined) {
      // Block has been deleted.
      return;
    }
    // this.setEditable(true);
    // var blocklyNode = blocklyNodes[ this.data ];
    // var position = blocklyNode[ 'positionSensorValueY' ];
    // if ( position !== undefined ) {
    //   this.setFieldValue( '(' + position + ')','VALUE' );
    // }
    // this.setEditable(false);
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
        .appendField('Direction of Travel: ')
        //.appendField("?", "VALUE")
        .setCheck(['OperatorAddSubtract','OperatorMultiplyDivide','LeftParenthesis','RightParenthesis','Conditional']);
    this.setOutput(true, null);
    this.data = currentBlocklyNodeID;
    //this.setEditable(false);
    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "Checks our rover for its direction of travel (heading) in a 360° arc that starts on the X-axis. Returns a value between 0 and 360."
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
  },
  onchange: function() {
    if (!this.workspace || this.data === undefined) {
      // Block has been deleted.
      return;
    }
    // this.setEditable(true);
    // var headingValue = vwf.getProperty( this.data, "headingSensorValue" );
    // this.setFieldValue( '(' + headingValue + '°)','VALUE' );
    // this.setEditable(false);
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
        imagePath: "assets/images/tooltips/move_forward_smaller.png"
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

Blockly.Blocks['rover_moveRadial_ordered'] = {
  init: function() {
    this.setColour(20);
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("moveTo:");
    this.appendValueInput("THEOP");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "null");
    this.setNextStatement(true, "null");
    this.data = currentBlocklyNodeID;
    var thisBlock = this;
    this.setTooltip( function(){
      var content = {
        text: "Moves to the coordinate specified by a connected ordered pair block."
      }
      return showTooltipInBlockly(thisBlock, content);
    });
  }
};

Blockly.JavaScript['rover_moveRadial_ordered'] = function(block) {
  var value = Blockly.JavaScript.valueToCode(block, 'THEOP', Blockly.JavaScript.ORDER_ATOMIC) || 0;

  console.log(value );
  if ( !Array.isArray(value)) {
   value = [ value ]; 
  }
  
  console.log(value);
  var value_x = value[ 0 ];
  var value_y = value[ 1 ];

  if ( isNaN( value_x ) || isNaN( value_y )) {
    console.log('detecting nan');
    if ( Array.isArray(value)) {
      value = value[ 0 ];
    }
    var extractedVal = blocklyVariables[ value ];
    console.log('extracted:'+extractedVal);
    if ( extractedVal !== undefined ) {
      if ( Array.isArray(extractedVal[ 0 ])) {
        console.log('isArray');
        value_x = extractedVal[ 0 ][0];
        value_y = extractedVal[ 0 ][1];
      } else {
        value_x = extractedVal[0];
        value_y = extractedVal[1];
      }
      
    }
  }

  // How long should we take to execute this block?
  // var exeTime = Math.round( Math.sqrt(value_x*value_x + value_y*value_y) );

  var action = {
    nodeID: block.data,
    methodName: 'moveRadialAbsolute',
    exeTime: 1,
    args: [ value_x, value_y ]
  };

  return constructBlockExeFuncCall( block, action );

};

Blockly.Blocks['rover_moveRadial'] = {
  init: function() {
    this.setColour(20);
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("move:");
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
    this.setTooltip( function(){
      var content = {
        text: "Moves the specified number of spaces along the X and Y axes."
      }
      return showTooltipInBlockly( thisBlock, content);
    });
  }
};

Blockly.JavaScript['rover_moveRadial'] = function(block) {
  var value_x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC) || 0;
  var value_y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC) || 0;

  // How long should we take to execute this block?
  var exeTime = Math.round( Math.sqrt(value_x*value_x + value_y*value_y) );

  var action = {
    nodeID: block.data,
    methodName: 'moveRadial',
    exeTime: exeTime,
    args: [ value_x, value_y, true ]
  };
  return constructBlockExeFuncCall( block, action, 'moveRadial' );
};

Blockly.Blocks['rover_moveRadial_absolute'] = {
  init: function() {
    this.setColour(20);
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("moveTo:");
     this.appendDummyInput()
         .setAlign(Blockly.ALIGN_CENTRE)
         .appendField("");
    this.appendValueInput("x");
     this.appendDummyInput()
         .setAlign(Blockly.ALIGN_CENTRE)
         .appendField("");
    this.appendValueInput("y");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "null");
    this.setNextStatement(true, "null");
    this.data = currentBlocklyNodeID;
    var thisBlock = this;
    this.setTooltip( function(){
      var content = {
        text: "Moves to the specified coordinate."
      }
      return showTooltipInBlockly( thisBlock, content);
    });
  }
};

Blockly.JavaScript['rover_moveRadial_absolute'] = function(block) {
  var value_x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC) || 0;
  var value_y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC) || 0;

  // How long should we take to execute this block?

  // if ( isNaN( value_x ) ) {
  //   var extractedVal = blocklyVariables[ value_x ];
  //   if ( extractedVal !== undefined ) {
  //     console.log('extracting');
  //     value_x = extractedVal;
  //   } else {
  //     value_x = 0;
  //   }
  // }

  // if ( isNaN( value_y ) ) {
  //   var extractedVal = blocklyVariables[ value_y ];

  //   if ( extractedVal !== undefined ) {
  //     console.log('extracting');
  //     value_y = extractedVal;
  //   } else {
  //     value_y = 0;
  //   }
  // }

  // var exeTime = Math.round( Math.sqrt(value_x*value_x + value_y*value_y) );

  var action = {
    nodeID: block.data,
    methodName: 'moveRadialAbsolute',
    exeTime: 1,
    args: [ value_x, value_y ]
  };

  return constructBlockExeFuncCall( block, action, 'moveRadial' );
};

Blockly.Blocks['draw_triangle'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Draw Triangle");
    this.appendValueInput("pointA")
        .setCheck(null)
        .appendField("Vertex #1");
    this.appendValueInput("pointB")
        .setCheck(null)
        .appendField("Vertex #2");
    this.appendValueInput("pointC")
        .setCheck(null)
        .appendField("Vertex #3");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(315);
    this.data = currentBlocklyNodeID;
    this.setTooltip('');
  }
};

Blockly.JavaScript['draw_triangle'] = function(block) {
  var op_a_str = Blockly.JavaScript.valueToCode(block, 'pointA', Blockly.JavaScript.ORDER_ATOMIC);
  var op_b_str = Blockly.JavaScript.valueToCode(block, 'pointB', Blockly.JavaScript.ORDER_ATOMIC);
  var op_c_str = Blockly.JavaScript.valueToCode(block, 'pointC', Blockly.JavaScript.ORDER_ATOMIC);
  
  var op_a = op_a_str.split(",");
  var op_b = op_b_str.split(",");
  var op_c = op_c_str.split(",");

  if ( op_a.length < 2 || op_b.length < 2 || op_c.length < 2 ) {
    return '';
  }

  var actionA = {
    nodeID: block.data,
    methodName: 'moveRadialAbsolute',
    exeTime: 1,
    args: [ op_a[ 0 ], op_a[ 1 ] ]
  };

  var moveA = constructBlockExeFuncCall( block, actionA, 'moveRadial' );

  var actionB = {
    nodeID: block.data,
    methodName: 'moveRadialAbsolute',
    exeTime: 1,
    args: [ op_b[ 0 ], op_b[ 1 ] ]
  };

  var moveB = constructBlockExeFuncCall( block, actionB, 'moveRadial' );

  var actionC = {
    nodeID: block.data,
    methodName: 'moveRadialAbsolute',
    exeTime: 1,
    args: [ op_c[ 0 ], op_c[ 1 ] ]
  };

  var moveC = constructBlockExeFuncCall( block, actionC, 'moveRadial' );

  var start = "vwf.callMethod( '" + vwf_view.kernel.application() + 
                  "', 'handleDrawingBlocks', " + " [ 'startTriangle', '" + block.id + "', '" + block.data + "', " + 1 + " ] );\n";
  var end = "vwf.callMethod( '" + vwf_view.kernel.application() + 
                  "', 'handleDrawingBlocks', " + " [ 'endTriangle', '" + block.id + "', '" + block.data + "', " + 1 + " ] );\n";
  var mark = "vwf.callMethod( '" + vwf_view.kernel.application() + 
                  "', 'handleDrawingBlocks', " + " [ 'markPoint', '" + block.id + "', '" + block.data + "', " + 1 + " ] );\n";

  //moveA
  //start
  //moveB
  //mark
  //moveC
  //mark
  //moveA
  //end

  var overallCode = moveA + start + mark + moveB + mark + moveC + mark + moveA + mark + end;
  
  return overallCode;
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
        imagePath: "assets/images/tooltips/turn_smaller.png"
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

// Blockly.Blocks[ 'controls_repeat_extended' ] = {
//   /**
//    * Block for repeat n times (external number).
//    * @this Blockly.Block
//    */
//   init: function() {
//     this.setColour(120);
//     this.appendValueInput("Repeat ")
//         .setCheck(null)
//         .appendField("TIMES");
//     this.appendDummyInput("Times")
//         .appendField(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
//     this.jsonInit({
//       "message": Blockly.Msg.CONTROLS_REPEAT_TITLE + " %2 " +
//           Blockly.Msg.CONTROLS_REPEAT_INPUT_DO + " %3",
//       "args": [
//         {
//           "type": "value_input",
//           "name": "TIMES",
//           "check": "Number"
//         },
//         {
//           "type": "input_dummy"
//         },
//         {
//           "type": "input_statement",
//           "name": "DO"
//         }
//       ],
//       "inputsInline": true,
//       "previousStatement": null,
//       "nextStatement": null,
//       "colour": 120,
//       "tooltip": Blockly.Msg.CONTROLS_REPEAT_TOOLTIP,
//       "helpUrl": Blockly.Msg.CONTROLS_REPEAT_HELPURL
//     });
//     this.data = currentBlocklyNodeID;
//     var thisBlock = this;
//     this.setTooltip( function() {
//       var content = {
//         text: "Repeats the contained blocks a certain number of times.",
//         imagePath: "assets/images/tooltips/while_smaller.png"
//       }
//       return showTooltipInBlockly( thisBlock, content );
//     } );    
//   }
// };

// Blockly.JavaScript[ 'controls_repeat_extended' ] = function( block ) {
//   // Repeat n times (external number).
//   var repeats = Blockly.JavaScript.valueToCode( block, 'TIMES',
//       Blockly.JavaScript.ORDER_ASSIGNMENT ) || '0';
//   var branch = Blockly.JavaScript.statementToCode( block, 'DO' );
//   var code = '';

//   var loopVar = Blockly.JavaScript.variableDB_.getDistinctName(
//       'count', Blockly.Variables.NAME_TYPE);
//   var endVar = repeats;
//   if( endVar.split('(').length == endVar.split(')').length ) {
      
//       if ( !repeats.match(/^\w+$/) && !Blockly.isNumber( repeats ) ) {
//           var endVar = Blockly.JavaScript.variableDB_.getDistinctName(
//         'repeat_end', Blockly.Variables.NAME_TYPE );
//          code += 'var ' + endVar + ' = ' + repeats + ';\n';
//        }
  
//       code += 'for (var ' + loopVar + ' = 0; ' +
//       loopVar + ' < ' + endVar + '; ' +
//       loopVar + '++) {\n' +
//       branch + '}\n';
//       return constructBlockExeEventCall( block ) + code;
//   }
//   else {
//     code += 'for (var xrepeat = 0; xrepeat < 0; xrepeat++) {\n' +
//       branch + '}\n';
//       return constructBlockExeEventCall( block ) + code;
//   }
  
// };

Blockly.Blocks[ 'math_number_out' ] = {
  init: function() {
    this.setColour( 60 );
    this.appendValueInput( "INPUT" )
        .appendField(new Blockly.FieldDropdown([["15", "15"],["14", "14"],["13", "13"],["12", "12"],["11", "11"],["10", "10"],["9", "9"],["8", "8"],
         ["7", "7"],["6", "6"],["5", "5"],["4", "4"],["3", "3"],["2", "2"],
         ["1", "1"],["0", "0"],["-1", "-1"], ["-2", "-2"], ["-3", "-3"], 
         ["-4", "-4"], ["-5", "-5"], ["-6", "-6"], ["-7", "-7"], ["-8", "-8"], 
         ["-9", "-9"], ["-10", "-10"], ["-11", "-11"], ["-12", "-12"], ["-13", "-13"], ["-14", "-14"], ["-15", "-15"]]), "VALUE")
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

Blockly.Blocks[ 'math_number_out_m4t5' ] = {
  init: function() {
    this.setColour( 60 );
    this.appendValueInput( "INPUT" )
        .appendField(new Blockly.FieldDropdown([["-2", "-2"],["2", "2"],["-1", "-1"],["1", "1"]]), "VALUE")
        .setCheck( [ 'OperatorAddSubtract','OperatorMultiplyDivide','Variable','LeftParenthesis','RightParenthesis','Conditional' ] );
    this.setOutput( true, 'Number' );
    this.data = currentBlocklyNodeID;
    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "A block representing an integer."
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
    
  }
};

Blockly.JavaScript['math_number_out_m4t5' ] = function( block ) {
  
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

Blockly.Blocks[ 'math_number_out_m4t7' ] = {
  init: function() {
    this.setColour( 60 );
    this.appendValueInput( "INPUT" )
        .appendField(new Blockly.FieldDropdown([["-8", "-8"]]), "VALUE")
        .setCheck( [ 'OperatorAddSubtract','OperatorMultiplyDivide','Variable','LeftParenthesis','RightParenthesis','Conditional' ] );
    this.setOutput( true, 'Number' );
    this.data = currentBlocklyNodeID;
    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "A block representing the integer -8."
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
    
  }
};

Blockly.JavaScript['math_number_out_m4t7' ] = function( block ) {
  
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

Blockly.Blocks[ 'math_number_out_m4t8' ] = {
  init: function() {
    this.setColour( 60 );
    this.appendValueInput( "INPUT" )
        .appendField(new Blockly.FieldDropdown([["-8", "-8"],["-7","-7"],["-1","-1"]]), "VALUE")
        .setCheck( [ 'OperatorAddSubtract','OperatorMultiplyDivide','Variable','LeftParenthesis','RightParenthesis','Conditional' ] );
    this.setOutput( true, 'Number' );
    this.data = currentBlocklyNodeID;
    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "A block representing an integer."
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
    
  }
};

Blockly.JavaScript['math_number_out_m4t8' ] = function( block ) {
  
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

Blockly.Blocks[ 'math_number_out_m4t9' ] = {
  init: function() {
    this.setColour( 60 );
    this.appendValueInput( "INPUT" )
        .appendField(new Blockly.FieldDropdown([["-8", "-8"],["-9","-9"],["-1","-1"]]), "VALUE")
        .setCheck( [ 'OperatorAddSubtract','OperatorMultiplyDivide','Variable','LeftParenthesis','RightParenthesis','Conditional' ] );
    this.setOutput( true, 'Number' );
    this.data = currentBlocklyNodeID;
    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "A block representing an integer."
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
    
  }
};

Blockly.JavaScript['math_number_out_m4t9' ] = function( block ) {
  
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

Blockly.Blocks[ 'math_number_out_m4t10' ] = {
  init: function() {
    this.setColour( 60 );
    this.appendValueInput( "INPUT" )
        .appendField(new Blockly.FieldDropdown([["-7", "-7"],["-9","-9"],["-1","-1"]]), "VALUE")
        .setCheck( [ 'OperatorAddSubtract','OperatorMultiplyDivide','Variable','LeftParenthesis','RightParenthesis','Conditional' ] );
    this.setOutput( true, 'Number' );
    this.data = currentBlocklyNodeID;
    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "A block representing an integer."
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
    
  }
};

Blockly.JavaScript['math_number_out_m4t10' ] = function( block ) {
  
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


Blockly.Blocks[ 'math_number_out_seven_limited' ] = {
  init: function() {
    this.setColour( 60 );
    this.appendValueInput( "INPUT" )
        .appendField(new Blockly.FieldDropdown([["7", "7"]]), "VALUE")
        .setCheck( [ 'OperatorAddSubtract','OperatorMultiplyDivide','Variable','LeftParenthesis','RightParenthesis','Conditional' ] );
    this.setOutput( true, 'Number' );
    this.data = currentBlocklyNodeID;
    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "A block representing the integer 7."
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
    
  }
};

Blockly.JavaScript['math_number_out_seven_limited' ] = function( block ) {
  
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

Blockly.Blocks[ 'math_number_out_two_limited' ] = {
  init: function() {
    this.setColour( 60 );
    this.appendValueInput( "INPUT" )
        .appendField(new Blockly.FieldDropdown([["2", "2"]]), "VALUE")
        .setCheck( [ 'OperatorAddSubtract','OperatorMultiplyDivide','Variable','LeftParenthesis','RightParenthesis','Conditional' ] );
    this.setOutput( true, 'Number' );
    this.data = currentBlocklyNodeID;
    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "A block representing the integer 2."
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
    
  }
};

Blockly.JavaScript['math_number_out_two_limited' ] = function( block ) {
  
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

Blockly.Blocks[ 'math_number_out_minus_one_limited' ] = {
  init: function() {
    this.setColour( 60 );
    this.appendValueInput( "INPUT" )
        .appendField(new Blockly.FieldDropdown([["-1", "-1"]]), "VALUE")
        .setCheck( [ 'OperatorAddSubtract','OperatorMultiplyDivide','Variable','LeftParenthesis','RightParenthesis','Conditional' ] );
    this.setOutput( true, 'Number' );
    this.data = currentBlocklyNodeID;
    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "A block representing the integer -1."
      }
      return showTooltipInBlockly( thisBlock, content );
    } );
    
  }
};

Blockly.JavaScript['math_number_out_minus_one_limited' ] = function( block ) {
  
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
    this.setColour( 105 );
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
  },

  /**
   * Fires when the workspace changes or Blockly.mainWorkspace.fireChangeEvent() is called
   */
  onchange: function() {
    if (!this.workspace || this.data === undefined) {
      // Block has been deleted.
      return;
    }

  var text_value = this.getFieldValue('VALUE');

  if ( isNaN( text_value ) || text_value === "" ){
    text_value = 0;
    this.setFieldValue( '0','VALUE' );
  } else {
      if ( text_value % 1 !== 0 ){
        this.setFieldValue( '0','VALUE' );
        this.setWarningText( 'Decimals not allowed.' );
      }
      else if ( text_value > 999 || text_value < -999){
        this.setFieldValue( '0' ,'VALUE' );
        this.setWarningText( 'Must be between -999 and 999.' );
      } else {
        this.setWarningText( null );
        this.setFieldValue( text_value ,'VALUE' );
      }
   }
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
      block.setWarningText( 'Must be between -999 and 999.' );
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

Blockly.Blocks['math_number_angle_select'] = {
  init: function() {
    this.setColour(120);
    this.appendValueInput("NAME")
        .setCheck(['Number','Variable','LeftParenthesis','OperatorAddSubtract','OperatorMultiplyDivide'])
        .appendField("")
        .appendField(new Blockly.FieldAngle("90"), "VALUE");
    this.setOutput(true, "Number");
    this.setTooltip('This is a number block that lets you select a number and preview angle directions.');
    //this.setTooltip( function() {
    //  var content = {
    //    text: "This is a number block that lets you select a number and preview angle directions."
    //  }
    //  return showTooltipInBlockly( thisBlock, content );
    //});  
  }
};


Blockly.JavaScript['math_number_angle_select'] = function(block) {
  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_ATOMIC);
  var angle_value = block.getFieldValue('VALUE');
  // TODO: Assemble JavaScript into code variable.

  if ( argument0[0] === 'x' || argument0[0] === '(' ){
    return [ angle_value + '*' + argument0 , Blockly.JavaScript.ORDER_ATOMIC ];
  } else {
    return [ angle_value + argument0 , Blockly.JavaScript.ORDER_ATOMIC ];
  }
};


Blockly.Blocks[ 'math_number_frozen' ] = {
  /**
   * Code for basic frozen number block.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(0);
    this.appendValueInput('INPUT')
        .appendField('0', "VALUE")
        .setCheck(['Number','Variable','LeftParenthesis','OperatorAddSubtract','OperatorMultiplyDivide']);
    this.setOutput(true, 'Number');
    this.data = currentBlocklyNodeID;
    var thisBlock = this;
    this.setTooltip( function() {
      var content = {
        text: "This is an unchangeable number block."
      }
      return showTooltipInBlockly( thisBlock, content );
    } ); 
  }
};


Blockly.JavaScript[ 'math_number_frozen' ] = function( block ) {
  /**
   * Code for basic frozen number block.
   * @this Blockly.Block
   */

  var num = block.getFieldValue('VALUE');

  var argument0 = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_ATOMIC) || '';

  if ( argument0[0] === 'x' || argument0[0] === '(' ){
    return [ num + '*' + argument0 , Blockly.JavaScript.ORDER_ATOMIC ];
  } else {
    return [ num + argument0 , Blockly.JavaScript.ORDER_ATOMIC ];
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
        .appendField('·')
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
        .appendField('/')
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
        .setCheck(['Number','Boolean','Variable','ANDOR','OperatorAddSubtract','RightParenthesis']);
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
                  "', 'blockExecuted', " + " [ '" + block + "', '" + block.id + "', '" + block.data + "', " + 1 + " ] );\n";
  return eventCall;  
}

function constructBlockExeFuncCall( block, action, name ) {

  if ( name !== undefined ) {
    var blockCode = " { 'blockName': 'moveRadial', 'id': '" + block.id + "', 'node': '" + block.data + "', ";
  } else {
    var blockCode = " { 'blockName': '" + block + "', 'id': '" + block.id + "', 'node': '" + block.data + "', ";
  }
  blockCode += ( action.exeTime ) ? "'exeTime': " + action.exeTime + "}" : "'exeTime': 1 }";
  var actionCode = "{ 'nodeID': '" + action.nodeID + "', 'methodName': '" + action.methodName + "', ";
  actionCode += ( action.args.length > 0 ) ? "'args': [" + action.args + "]}" : "'args': [] }";
  var returnCode = "vwf.callMethod( '" + vwf_view.kernel.application() + "', 'executeBlock', [ " + blockCode + "," +
                    actionCode + "] );\n"; 

  return returnCode;
}

// Blockly.JavaScript['procedures_defreturn'] = function(block) {
//   // Define a procedure with a return value.
//   var funcName = Blockly.JavaScript.variableDB_.getName(
//       block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
//   var branch = Blockly.JavaScript.statementToCode(block, 'STACK');
//   if (Blockly.JavaScript.STATEMENT_PREFIX) {
//     branch = Blockly.JavaScript.prefixLines(
//         Blockly.JavaScript.STATEMENT_PREFIX.replace(/%1/g,
//         '\'' + block.id + '\''), Blockly.JavaScript.INDENT) + branch;
//   }
//   if (Blockly.JavaScript.INFINITE_LOOP_TRAP) {
//     branch = Blockly.JavaScript.INFINITE_LOOP_TRAP.replace(/%1/g,
//         '\'' + block.id + '\'') + branch;
//   }
//   var returnValue = Blockly.JavaScript.valueToCode(block, 'RETURN',
//       Blockly.JavaScript.ORDER_NONE) || '';
//   if (returnValue) {
//     returnValue = '  return ' + returnValue + ';\n';
//   }
//   var args = [];
//   for (var x = 0; x < block.arguments_.length; x++) {
//     args[x] = Blockly.JavaScript.variableDB_.getName(block.arguments_[x],
//         Blockly.Variables.NAME_TYPE);
//   }
//   var code = 'function ' + funcName + '(' + args.join(', ') + ') {\n' +
//       branch + returnValue + '}';
//   code = Blockly.JavaScript.scrub_(block, code);
//   Blockly.JavaScript.definitions_[funcName] = code;
//   return null;
// };

// // Defining a procedure without a return value uses the same generator as
// // a procedure with a return value.
// Blockly.JavaScript['procedures_defnoreturn'] =
//     Blockly.JavaScript['procedures_defreturn'];

// Blockly.JavaScript['procedures_callreturn'] = function(block) {
//   // Call a procedure with a return value.
//   var funcName = Blockly.JavaScript.variableDB_.getName(
//       block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
//   var args = [];
//   for (var x = 0; x < block.arguments_.length; x++) {
//     args[x] = Blockly.JavaScript.valueToCode(block, 'ARG' + x,
//         Blockly.JavaScript.ORDER_COMMA) || 'null';
//     // var val = Blockly.JavaScript.valueToCode(block, 'ARG' + x,
//     //     Blockly.JavaScript.ORDER_COMMA) || 'null';
//     // console.log( args[x] +'='+ val);
//     // blocklyVariables[ args[x] ] = val;
//   }
//   var code = funcName + '(' + args.join(', ') + ')';
//   return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
// };

// Blockly.JavaScript['procedures_callnoreturn'] = function(block) {
//   // Call a procedure with no return value.
//   var funcName = Blockly.JavaScript.variableDB_.getName(
//       block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
//   var args = [];
//   for (var x = 0; x < block.arguments_.length; x++) {
//     args[x] = Blockly.JavaScript.valueToCode(block, 'ARG' + x,
//         Blockly.JavaScript.ORDER_COMMA) || 'null';
//   }
//   if ( funcName === 'drawTriangle' ) {
//       var val1 = Blockly.JavaScript.valueToCode(block, 'ARG' + 0,
//         Blockly.JavaScript.ORDER_COMMA) || 'null';
//       var val2 = Blockly.JavaScript.valueToCode(block, 'ARG' + 1,
//         Blockly.JavaScript.ORDER_COMMA) || 'null';
//       var val3 = Blockly.JavaScript.valueToCode(block, 'ARG' + 2,
//         Blockly.JavaScript.ORDER_COMMA) || 'null';

//       console.log( 'vertex1' +'='+ val1);
//       console.log( 'vertex2' +'='+ val2);
//       console.log( 'vertex3' +'='+ val3);

//       blocklyVariables[ 'vertex1' ] = val1;
//       blocklyVariables[ 'vertex2' ] = val2;
//       blocklyVariables[ 'vertex3' ] = val3;
//     }

//   var code = funcName + '(' + args.join(', ') + ');\n';
//   return code;
// };

// Blockly.JavaScript['procedures_ifreturn'] = function(block) {
//   // Conditionally return value from a procedure.
//   var condition = Blockly.JavaScript.valueToCode(block, 'CONDITION',
//       Blockly.JavaScript.ORDER_NONE) || 'false';
//   var code = 'if (' + condition + ') {\n';
//   if (block.hasReturnValue_) {
//     var value = Blockly.JavaScript.valueToCode(block, 'VALUE',
//         Blockly.JavaScript.ORDER_NONE) || 'null';
//     code += '  return ' + value + ';\n';
//   } else {
//     code += '  return;\n';
//   }
//   code += '}\n';
//   return code;
// };

// Blockly.Blocks['procedures_defnoreturn'] = {
//   /**
//    * Block for defining a procedure with no return value.
//    * @this Blockly.Block
//    */
//   init: function() {
//     this.setHelpUrl(Blockly.Msg.PROCEDURES_DEFNORETURN_HELPURL);
//     this.setColour(290);
//     var name = Blockly.Procedures.findLegalName(
//         Blockly.Msg.PROCEDURES_DEFNORETURN_PROCEDURE, this);
//     var nameField = new Blockly.FieldTextInput(name,
//         Blockly.Procedures.rename);
//     this.appendDummyInput()
//         .appendField(Blockly.Msg.PROCEDURES_DEFNORETURN_TITLE)
//         .appendField(nameField, 'NAME')
//         .appendField('', 'PARAMS');
//     this.setMutator(new Blockly.Mutator(['procedures_mutatorarg']));
//     this.setTooltip(Blockly.Msg.PROCEDURES_DEFNORETURN_TOOLTIP);
//     this.arguments_ = [];
//     this.setStatements_(true);
//     this.statementConnection_ = null;
//   },
//   /**
//    * Add or remove the statement block from this function definition.
//    * @param {boolean} hasStatements True if a statement block is needed.
//    * @this Blockly.Block
//    */
//   setStatements_: function(hasStatements) {
//     if (this.hasStatements_ === hasStatements) {
//       return;
//     }
//     if (hasStatements) {
//       this.appendStatementInput('STACK')
//           .appendField(Blockly.Msg.PROCEDURES_DEFNORETURN_DO);
//       if (this.getInput('RETURN')) {
//         this.moveInputBefore('STACK', 'RETURN');
//       }
//     } else {
//       this.removeInput('STACK', true);
//     }
//     this.hasStatements_ = hasStatements;
//   },
//   /**
//    * Update the display of parameters for this procedure definition block.
//    * Display a warning if there are duplicately named parameters.
//    * @private
//    * @this Blockly.Block
//    */
//   updateParams_: function() {
//     // Check for duplicated arguments.
//     var badArg = false;
//     var hash = {};
//     for (var i = 0; i < this.arguments_.length; i++) {
//       if (hash['arg_' + this.arguments_[i].toLowerCase()]) {
//         badArg = true;
//         break;
//       }
//       hash['arg_' + this.arguments_[i].toLowerCase()] = true;
//     }
//     if (badArg) {
//       this.setWarningText(Blockly.Msg.PROCEDURES_DEF_DUPLICATE_WARNING);
//     } else {
//       this.setWarningText(null);
//     }
//     // Merge the arguments into a human-readable list.
//     var paramString = '';
//     if (this.arguments_.length) {
//       paramString = Blockly.Msg.PROCEDURES_BEFORE_PARAMS +
//           ' ' + this.arguments_.join(', ');
//     }
//     this.setFieldValue(paramString, 'PARAMS');
//   },
//   /**
//    * Create XML to represent the argument inputs.
//    * @return {Element} XML storage element.
//    * @this Blockly.Block
//    */
//   mutationToDom: function() {
//     var container = document.createElement('mutation');
//     for (var i = 0; i < this.arguments_.length; i++) {
//       var parameter = document.createElement('arg');
//       parameter.setAttribute('name', this.arguments_[i]);
//       container.appendChild(parameter);
//     }

//     // Save whether the statement input is visible.
//     if (!this.hasStatements_) {
//       container.setAttribute('statements', 'false');
//     }
//     return container;
//   },
//   /**
//    * Parse XML to restore the argument inputs.
//    * @param {!Element} xmlElement XML storage element.
//    * @this Blockly.Block
//    */
//   domToMutation: function(xmlElement) {
//     this.arguments_ = [];
//     for (var i = 0, childNode; childNode = xmlElement.childNodes[i]; i++) {
//       if (childNode.nodeName.toLowerCase() == 'arg') {
//         this.arguments_.push(childNode.getAttribute('name'));
//       }
//     }
//     this.updateParams_();

//     // Show or hide the statement input.
//     this.setStatements_(xmlElement.getAttribute('statements') !== 'false');
//   },
//   /**
//    * Populate the mutator's dialog with this block's components.
//    * @param {!Blockly.Workspace} workspace Mutator's workspace.
//    * @return {!Blockly.Block} Root block in mutator.
//    * @this Blockly.Block
//    */
//   decompose: function(workspace) {
//     var containerBlock = Blockly.Block.obtain(workspace,
//                                               'procedures_mutatorcontainer');
//     containerBlock.initSvg();

//     // Check/uncheck the allow statement box.
//     if (this.getInput('RETURN')) {
//       containerBlock.setFieldValue(this.hasStatements_ ? 'TRUE' : 'FALSE',
//                                    'STATEMENTS');
//     } else {
//       containerBlock.getInput('STATEMENT_INPUT').setVisible(false);
//     }

//     // Parameter list.
//     var connection = containerBlock.getInput('STACK').connection;
//     for (var i = 0; i < this.arguments_.length; i++) {
//       var paramBlock = Blockly.Block.obtain(workspace, 'procedures_mutatorarg');
//       paramBlock.initSvg();
//       paramBlock.setFieldValue(this.arguments_[i], 'NAME');
//       // Store the old location.
//       paramBlock.oldLocation = i;
//       connection.connect(paramBlock.previousConnection);
//       connection = paramBlock.nextConnection;
//     }
//     // Initialize procedure's callers with blank IDs.
//     Blockly.Procedures.mutateCallers(this.getFieldValue('NAME'),
//                                      this.workspace, this.arguments_, null);
//     return containerBlock;
//   },
//   /**
//    * Reconfigure this block based on the mutator dialog's components.
//    * @param {!Blockly.Block} containerBlock Root block in mutator.
//    * @this Blockly.Block
//    */
//   compose: function(containerBlock) {
//     // Parameter list.
//     this.arguments_ = [];
//     this.paramIds_ = [];
//     var paramBlock = containerBlock.getInputTargetBlock('STACK');
//     while (paramBlock) {
//       this.arguments_.push(paramBlock.getFieldValue('NAME'));
//       this.paramIds_.push(paramBlock.id);
//       paramBlock = paramBlock.nextConnection &&
//           paramBlock.nextConnection.targetBlock();
//     }
//     this.updateParams_();
//     Blockly.Procedures.mutateCallers(this.getFieldValue('NAME'),
//         this.workspace, this.arguments_, this.paramIds_);

//     // Show/hide the statement input.
//     var hasStatements = containerBlock.getFieldValue('STATEMENTS');
//     if (hasStatements !== null) {
//       hasStatements = hasStatements == 'TRUE';
//       if (this.hasStatements_ != hasStatements) {
//         if (hasStatements) {
//           this.setStatements_(true);
//           // Restore the stack, if one was saved.
//           var stackConnection = this.getInput('STACK').connection;
//           if (stackConnection.targetConnection ||
//               !this.statementConnection_ ||
//               this.statementConnection_.targetConnection ||
//               this.statementConnection_.sourceBlock_.workspace !=
//               this.workspace) {
//             // Block no longer exists or has been attached elsewhere.
//             this.statementConnection_ = null;
//           } else {
//             stackConnection.connect(this.statementConnection_);
//           }
//         } else {
//           // Save the stack, then disconnect it.
//           var stackConnection = this.getInput('STACK').connection;
//           this.statementConnection_ = stackConnection.targetConnection;
//           if (this.statementConnection_) {
//             var stackBlock = stackConnection.targetBlock();
//             stackBlock.setParent(null);
//             stackBlock.bumpNeighbours_();
//           }
//           this.setStatements_(false);
//         }
//       }
//     }
//   },
//   /**
//    * Dispose of any callers.
//    * @this Blockly.Block
//    */
//   dispose: function() {
//     var name = this.getFieldValue('NAME');
//     Blockly.Procedures.disposeCallers(name, this.workspace);
//     // Call parent's destructor.
//     this.constructor.prototype.dispose.apply(this, arguments);
//   },
//   /**
//    * Return the signature of this procedure definition.
//    * @return {!Array} Tuple containing three elements:
//    *     - the name of the defined procedure,
//    *     - a list of all its arguments,
//    *     - that it DOES NOT have a return value.
//    * @this Blockly.Block
//    */
//   getProcedureDef: function() {
//     return [this.getFieldValue('NAME'), this.arguments_, false];
//   },
//   /**
//    * Return all variables referenced by this block.
//    * @return {!Array.<string>} List of variable names.
//    * @this Blockly.Block
//    */
//   getVars: function() {
//     return this.arguments_;
//   },
//   /**
//    * Notification that a variable is renaming.
//    * If the name matches one of this block's variables, rename it.
//    * @param {string} oldName Previous name of variable.
//    * @param {string} newName Renamed variable.
//    * @this Blockly.Block
//    */
//   renameVar: function(oldName, newName) {
//     var change = false;
//     for (var i = 0; i < this.arguments_.length; i++) {
//       if (Blockly.Names.equals(oldName, this.arguments_[i])) {
//         this.arguments_[i] = newName;
//         change = true;
//       }
//     }
//     if (change) {
//       this.updateParams_();
//       // Update the mutator's variables if the mutator is open.
//       if (this.mutator.isVisible()) {
//         var blocks = this.mutator.workspace_.getAllBlocks();
//         for (var i = 0, block; block = blocks[i]; i++) {
//           if (block.type == 'procedures_mutatorarg' &&
//               Blockly.Names.equals(oldName, block.getFieldValue('NAME'))) {
//             block.setFieldValue(newName, 'NAME');
//           }
//         }
//       }
//     }
//   },
//   /**
//    * Add custom menu options to this block's context menu.
//    * @param {!Array} options List of menu options to add to.
//    * @this Blockly.Block
//    */
//   customContextMenu: function(options) {
//     // Add option to create caller.
//     var option = {enabled: true};
//     var name = this.getFieldValue('NAME');
//     option.text = Blockly.Msg.PROCEDURES_CREATE_DO.replace('%1', name);
//     var xmlMutation = goog.dom.createDom('mutation');
//     xmlMutation.setAttribute('name', name);
//     for (var i = 0; i < this.arguments_.length; i++) {
//       var xmlArg = goog.dom.createDom('arg');
//       xmlArg.setAttribute('name', this.arguments_[i]);
//       xmlMutation.appendChild(xmlArg);
//     }
//     var xmlBlock = goog.dom.createDom('block', null, xmlMutation);
//     xmlBlock.setAttribute('type', this.callType_);
//     option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
//     options.push(option);

//     // Add options to create getters for each parameter.
//     if (!this.isCollapsed()) {
//       for (var i = 0; i < this.arguments_.length; i++) {
//         var option = {enabled: true};
//         var name = this.arguments_[i];
//         option.text = Blockly.Msg.VARIABLES_SET_CREATE_GET.replace('%1', name);
//         var xmlField = goog.dom.createDom('field', null, name);
//         xmlField.setAttribute('name', 'VAR');
//         var xmlBlock = goog.dom.createDom('block', null, xmlField);
//         xmlBlock.setAttribute('type', 'variables_get');
//         option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
//         options.push(option);
//       }
//     }
//   },
//   callType_: 'procedures_callnoreturn'
// };

// Blockly.Blocks['procedures_defreturn'] = {
//   /**
//    * Block for defining a procedure with a return value.
//    * @this Blockly.Block
//    */
//   init: function() {
//     this.setHelpUrl(Blockly.Msg.PROCEDURES_DEFRETURN_HELPURL);
//     this.setColour(290);
//     var name = Blockly.Procedures.findLegalName(
//         Blockly.Msg.PROCEDURES_DEFRETURN_PROCEDURE, this);
//     var nameField = new Blockly.FieldTextInput(name,
//         Blockly.Procedures.rename);
//     this.appendDummyInput()
//         .appendField(Blockly.Msg.PROCEDURES_DEFRETURN_TITLE)
//         .appendField(nameField, 'NAME')
//         .appendField('', 'PARAMS');
//     this.appendValueInput('RETURN')
//         .setAlign(Blockly.ALIGN_RIGHT)
//         .appendField(Blockly.Msg.PROCEDURES_DEFRETURN_RETURN);
//     this.setMutator(new Blockly.Mutator(['procedures_mutatorarg']));
//     this.setTooltip(Blockly.Msg.PROCEDURES_DEFRETURN_TOOLTIP);
//     this.arguments_ = [];
//     this.setStatements_(true);
//     this.statementConnection_ = null;
//   },
//   setStatements_: Blockly.Blocks['procedures_defnoreturn'].setStatements_,
//   updateParams_: Blockly.Blocks['procedures_defnoreturn'].updateParams_,
//   mutationToDom: Blockly.Blocks['procedures_defnoreturn'].mutationToDom,
//   domToMutation: Blockly.Blocks['procedures_defnoreturn'].domToMutation,
//   decompose: Blockly.Blocks['procedures_defnoreturn'].decompose,
//   compose: Blockly.Blocks['procedures_defnoreturn'].compose,
//   dispose: Blockly.Blocks['procedures_defnoreturn'].dispose,
//   /**
//    * Return the signature of this procedure definition.
//    * @return {!Array} Tuple containing three elements:
//    *     - the name of the defined procedure,
//    *     - a list of all its arguments,
//    *     - that it DOES have a return value.
//    * @this Blockly.Block
//    */
//   getProcedureDef: function() {
//     return [this.getFieldValue('NAME'), this.arguments_, true];
//   },
//   getVars: Blockly.Blocks['procedures_defnoreturn'].getVars,
//   renameVar: Blockly.Blocks['procedures_defnoreturn'].renameVar,
//   customContextMenu: Blockly.Blocks['procedures_defnoreturn'].customContextMenu,
//   callType_: 'procedures_callreturn'
// };

// Blockly.Blocks['procedures_mutatorcontainer'] = {
//   /**
//    * Mutator block for procedure container.
//    * @this Blockly.Block
//    */
//   init: function() {
//     this.setColour(290);
//     this.appendDummyInput()
//         .appendField(Blockly.Msg.PROCEDURES_MUTATORCONTAINER_TITLE);
//     this.appendStatementInput('STACK');
//     this.appendDummyInput('STATEMENT_INPUT')
//         .appendField(Blockly.Msg.PROCEDURES_ALLOW_STATEMENTS)
//         .appendField(new Blockly.FieldCheckbox('TRUE'), 'STATEMENTS');
//     this.setTooltip(Blockly.Msg.PROCEDURES_MUTATORCONTAINER_TOOLTIP);
//     this.contextMenu = false;
//   }
// };

// Blockly.Blocks['procedures_mutatorarg'] = {
//   /**
//    * Mutator block for procedure argument.
//    * @this Blockly.Block
//    */
//   init: function() {
//     this.setColour(290);
//     this.appendDummyInput()
//         .appendField(Blockly.Msg.PROCEDURES_MUTATORARG_TITLE)
//         .appendField(new Blockly.FieldTextInput('x', this.validator_), 'NAME');
//     this.setPreviousStatement(true);
//     this.setNextStatement(true);
//     this.setTooltip(Blockly.Msg.PROCEDURES_MUTATORARG_TOOLTIP);
//     this.contextMenu = false;
//   },
//   /**
//    * Obtain a valid name for the procedure.
//    * Merge runs of whitespace.  Strip leading and trailing whitespace.
//    * Beyond this, all names are legal.
//    * @param {string} newVar User-supplied name.
//    * @return {?string} Valid name, or null if a name was not specified.
//    * @private
//    * @this Blockly.Block
//    */
//   validator_: function(newVar) {
//     newVar = newVar.replace(/[\s\xa0]+/g, ' ').replace(/^ | $/g, '');
//     return newVar || null;
//   }
// };

// Blockly.Blocks['procedures_callnoreturn'] = {
//   /**
//    * Block for calling a procedure with no return value.
//    * @this Blockly.Block
//    */
//   init: function() {
//     this.setHelpUrl(Blockly.Msg.PROCEDURES_CALLNORETURN_HELPURL);
//     this.setColour(290);
//     this.appendDummyInput('TOPROW')
//         .appendField(Blockly.Msg.PROCEDURES_CALLNORETURN_CALL)
//         .appendField('', 'NAME');
//     this.setPreviousStatement(true);
//     this.setNextStatement(true);
//     // Tooltip is set in domToMutation.
//     this.arguments_ = [];
//     this.quarkConnections_ = null;
//     this.quarkArguments_ = null;
//   },
//   /**
//    * Returns the name of the procedure this block calls.
//    * @return {string} Procedure name.
//    * @this Blockly.Block
//    */
//   getProcedureCall: function() {
//     // The NAME field is guaranteed to exist, null will never be returned.
//     return /** @type {string} */ (this.getFieldValue('NAME'));
//   },
//   /**
//    * Notification that a procedure is renaming.
//    * If the name matches this block's procedure, rename it.
//    * @param {string} oldName Previous name of procedure.
//    * @param {string} newName Renamed procedure.
//    * @this Blockly.Block
//    */
//   renameProcedure: function(oldName, newName) {
//     if (Blockly.Names.equals(oldName, this.getProcedureCall())) {
//       this.setFieldValue(newName, 'NAME');
//       this.setTooltip(
//           (this.outputConnection ? Blockly.Msg.PROCEDURES_CALLRETURN_TOOLTIP :
//            Blockly.Msg.PROCEDURES_CALLNORETURN_TOOLTIP)
//           .replace('%1', newName));
//     }
//   },
//   /**
//    * Notification that the procedure's parameters have changed.
//    * @param {!Array.<string>} paramNames New param names, e.g. ['x', 'y', 'z'].
//    * @param {!Array.<string>} paramIds IDs of params (consistent for each
//    *     parameter through the life of a mutator, regardless of param renaming),
//    *     e.g. ['piua', 'f8b_', 'oi.o'].
//    * @this Blockly.Block
//    */
//   setProcedureParameters: function(paramNames, paramIds) {
//     // Data structures:
//     // this.arguments = ['x', 'y']
//     //     Existing param names.
//     // this.quarkConnections_ {piua: null, f8b_: Blockly.Connection}
//     //     Look-up of paramIds to connections plugged into the call block.
//     // this.quarkArguments_ = ['piua', 'f8b_']
//     //     Existing param IDs.
//     // Note that quarkConnections_ may include IDs that no longer exist, but
//     // which might reappear if a param is reattached in the mutator.
//     if (!paramIds) {
//       // Reset the quarks (a mutator is about to open).
//       this.quarkConnections_ = {};
//       this.quarkArguments_ = null;
//       return;
//     }
//     if (goog.array.equals(this.arguments_, paramNames)) {
//       // No change.
//       this.quarkArguments_ = paramIds;
//       return;
//     }
//     this.setCollapsed(false);
//     if (paramIds.length != paramNames.length) {
//       throw 'Error: paramNames and paramIds must be the same length.';
//     }
//     if (!this.quarkArguments_) {
//       // Initialize tracking for this block.
//       this.quarkConnections_ = {};
//       if (paramNames.join('\n') == this.arguments_.join('\n')) {
//         // No change to the parameters, allow quarkConnections_ to be
//         // populated with the existing connections.
//         this.quarkArguments_ = paramIds;
//       } else {
//         this.quarkArguments_ = [];
//       }
//     }
//     // Switch off rendering while the block is rebuilt.
//     var savedRendered = this.rendered;
//     this.rendered = false;
//     // Update the quarkConnections_ with existing connections.
//     for (var i = this.arguments_.length - 1; i >= 0; i--) {
//       var input = this.getInput('ARG' + i);
//       if (input) {
//         var connection = input.connection.targetConnection;
//         this.quarkConnections_[this.quarkArguments_[i]] = connection;
//         // Disconnect all argument blocks and remove all inputs.
//         this.removeInput('ARG' + i);
//       }
//     }
//     // Rebuild the block's arguments.
//     this.arguments_ = [].concat(paramNames);
//     this.quarkArguments_ = paramIds;
//     for (var i = 0; i < this.arguments_.length; i++) {
//       var input = this.appendValueInput('ARG' + i)
//           .setAlign(Blockly.ALIGN_RIGHT)
//           .appendField(this.arguments_[i]);
//       if (this.quarkArguments_) {
//         // Reconnect any child blocks.
//         var quarkName = this.quarkArguments_[i];
//         if (quarkName in this.quarkConnections_) {
//           var connection = this.quarkConnections_[quarkName];
//           if (!connection || connection.targetConnection ||
//               connection.sourceBlock_.workspace != this.workspace) {
//             // Block no longer exists or has been attached elsewhere.
//             delete this.quarkConnections_[quarkName];
//           } else {
//             input.connection.connect(connection);
//           }
//         }
//       }
//       input.init();
//     }
//     // Add 'with:' if there are parameters.
//     var input = this.getInput('TOPROW');
//     if (input) {
//       if (this.arguments_.length) {
//         if (!this.getField_('WITH')) {
//           input.appendField(Blockly.Msg.PROCEDURES_CALL_BEFORE_PARAMS, 'WITH');
//           input.init();
//         }
//       } else {
//         if (this.getField_('WITH')) {
//           input.removeField('WITH');
//         }
//       }
//     }
//     // Restore rendering and show the changes.
//     this.rendered = savedRendered;
//     if (this.rendered) {
//       this.render();
//     }
//   },
//   /**
//    * Create XML to represent the (non-editable) name and arguments.
//    * @return {Element} XML storage element.
//    * @this Blockly.Block
//    */
//   mutationToDom: function() {
//     var container = document.createElement('mutation');
//     container.setAttribute('name', this.getProcedureCall());
//     for (var i = 0; i < this.arguments_.length; i++) {
//       var parameter = document.createElement('arg');
//       parameter.setAttribute('name', this.arguments_[i]);
//       container.appendChild(parameter);
//     }
//     return container;
//   },
//   /**
//    * Parse XML to restore the (non-editable) name and parameters.
//    * @param {!Element} xmlElement XML storage element.
//    * @this Blockly.Block
//    */
//   domToMutation: function(xmlElement) {
//     var name = xmlElement.getAttribute('name');
//     this.setFieldValue(name, 'NAME');
//     this.setTooltip(
//         (this.outputConnection ? Blockly.Msg.PROCEDURES_CALLRETURN_TOOLTIP :
//          Blockly.Msg.PROCEDURES_CALLNORETURN_TOOLTIP).replace('%1', name));
//     var def = Blockly.Procedures.getDefinition(name, this.workspace);
//     if (def && def.mutator && def.mutator.isVisible()) {
//       // Initialize caller with the mutator's IDs.
//       this.setProcedureParameters(def.arguments_, def.paramIds_);
//     } else {
//       var args = [];
//       for (var i = 0, childNode; childNode = xmlElement.childNodes[i]; i++) {
//         if (childNode.nodeName.toLowerCase() == 'arg') {
//           args.push(childNode.getAttribute('name'));
//         }
//       }
//       // For the second argument (paramIds) use the arguments list as a dummy
//       // list.
//       this.setProcedureParameters(args, args);
//     }
//   },
//   /**
//    * Notification that a variable is renaming.
//    * If the name matches one of this block's variables, rename it.
//    * @param {string} oldName Previous name of variable.
//    * @param {string} newName Renamed variable.
//    * @this Blockly.Block
//    */
//   renameVar: function(oldName, newName) {
//     for (var i = 0; i < this.arguments_.length; i++) {
//       if (Blockly.Names.equals(oldName, this.arguments_[i])) {
//         this.arguments_[i] = newName;
//         this.getInput('ARG' + i).fieldRow[0].setText(newName);
//       }
//     }
//   },
//   /**
//    * Add menu option to find the definition block for this call.
//    * @param {!Array} options List of menu options to add to.
//    * @this Blockly.Block
//    */
//   customContextMenu: function(options) {
//     var option = {enabled: true};
//     option.text = Blockly.Msg.PROCEDURES_HIGHLIGHT_DEF;
//     var name = this.getProcedureCall();
//     var workspace = this.workspace;
//     option.callback = function() {
//       var def = Blockly.Procedures.getDefinition(name, workspace);
//       def && def.select();
//     };
//     options.push(option);
//   }
// };

// Blockly.Blocks['procedures_callreturn'] = {
//   /**
//    * Block for calling a procedure with a return value.
//    * @this Blockly.Block
//    */
//   init: function() {
//     this.setHelpUrl(Blockly.Msg.PROCEDURES_CALLRETURN_HELPURL);
//     this.setColour(290);
//     this.appendDummyInput('TOPROW')
//         .appendField(Blockly.Msg.PROCEDURES_CALLRETURN_CALL)
//         .appendField('', 'NAME');
//     this.setOutput(true);
//     // Tooltip is set in domToMutation.
//     this.arguments_ = [];
//     this.quarkConnections_ = null;
//     this.quarkArguments_ = null;
//   },
//   getProcedureCall: Blockly.Blocks['procedures_callnoreturn'].getProcedureCall,
//   renameProcedure: Blockly.Blocks['procedures_callnoreturn'].renameProcedure,
//   setProcedureParameters:
//       Blockly.Blocks['procedures_callnoreturn'].setProcedureParameters,
//   mutationToDom: Blockly.Blocks['procedures_callnoreturn'].mutationToDom,
//   domToMutation: Blockly.Blocks['procedures_callnoreturn'].domToMutation,
//   renameVar: Blockly.Blocks['procedures_callnoreturn'].renameVar,
//   customContextMenu: Blockly.Blocks['procedures_callnoreturn'].customContextMenu
// };

// Blockly.Blocks['procedures_ifreturn'] = {
//   /**
//    * Block for conditionally returning a value from a procedure.
//    * @this Blockly.Block
//    */
//   init: function() {
//     this.setHelpUrl('http://c2.com/cgi/wiki?GuardClause');
//     this.setColour(290);
//     this.appendValueInput('CONDITION')
//         .setCheck('Boolean')
//         .appendField(Blockly.Msg.CONTROLS_IF_MSG_IF);
//     this.appendValueInput('VALUE')
//         .appendField(Blockly.Msg.PROCEDURES_DEFRETURN_RETURN);
//     this.setInputsInline(true);
//     this.setPreviousStatement(true);
//     this.setNextStatement(true);
//     this.setTooltip(Blockly.Msg.PROCEDURES_IFRETURN_TOOLTIP);
//     this.hasReturnValue_ = true;
//   },
//   /**
//    * Create XML to represent whether this block has a return value.
//    * @return {Element} XML storage element.
//    * @this Blockly.Block
//    */
//   mutationToDom: function() {
//     var container = document.createElement('mutation');
//     container.setAttribute('value', Number(this.hasReturnValue_));
//     return container;
//   },
//   /**
//    * Parse XML to restore whether this block has a return value.
//    * @param {!Element} xmlElement XML storage element.
//    * @this Blockly.Block
//    */
//   domToMutation: function(xmlElement) {
//     var value = xmlElement.getAttribute('value');
//     this.hasReturnValue_ = (value == 1);
//     if (!this.hasReturnValue_) {
//       this.removeInput('VALUE');
//       this.appendDummyInput('VALUE')
//         .appendField(Blockly.Msg.PROCEDURES_DEFRETURN_RETURN);
//     }
//   },
//   /**
//    * Called whenever anything on the workspace changes.
//    * Add warning if this flow block is not nested inside a loop.
//    * @this Blockly.Block
//    */
//   onchange: function() {
//     if (!this.workspace) {
//       // Block has been deleted.
//       return;
//     }
//     var legal = false;
//     // Is the block nested in a procedure?
//     var block = this;
//     do {
//       if (block.type == 'procedures_defnoreturn' ||
//           block.type == 'procedures_defreturn') {
//         legal = true;
//         break;
//       }
//       block = block.getSurroundParent();
//     } while (block);
//     if (legal) {
//       // If needed, toggle whether this block has a return value.
//       if (block.type == 'procedures_defnoreturn' && this.hasReturnValue_) {
//         this.removeInput('VALUE');
//         this.appendDummyInput('VALUE')
//           .appendField(Blockly.Msg.PROCEDURES_DEFRETURN_RETURN);
//         this.hasReturnValue_ = false;
//       } else if (block.type == 'procedures_defreturn' &&
//                  !this.hasReturnValue_) {
//         this.removeInput('VALUE');
//         this.appendValueInput('VALUE')
//           .appendField(Blockly.Msg.PROCEDURES_DEFRETURN_RETURN);
//         this.hasReturnValue_ = true;
//       }
//       this.setWarningText(null);
//     } else {
//       this.setWarningText(Blockly.Msg.PROCEDURES_IFRETURN_WARNING);
//     }
//   }
// };

//@ sourceURL=blocks.js
