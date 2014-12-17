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

this.initialize = function() {
    // We have to create these here because VWF doesn't give our children
    //   to objects that extend us.
    this.children.create( "triggerCondition", 
                          "http://vwf.example.com/node.vwf" );
}

this.postInit = function() {
    
}

this.initTrigger = function( clauseGen, actionGen, context, definition ) {
    if ( !definition.triggerCondition || 
         ( definition.triggerCondition.length !== 1 ) ) {
        this.assert( false, "There must be exactly one trigger condition. " +
                            "Try using 'and' or 'or'." );
        return false;
    } 

    if ( !definition.actions || ( definition.actions.length < 1 ) ) {
        this.assert( false, "There must be at least one action." );
        return false;
    }

    var payload = { trigger: this };
    clauseGen.generateObject( definition.triggerCondition[0],
                              this.triggerCondition, payload );

    this.actions = [];
    for ( var i = 0; i < definition.actions.length; ++i ) {
        var action = actionGen.executeFunction( definition.actions[ i ], 
                                                    context );
        action && this.actions.push( action );
    }

    return true;
}

this.checkFire = function() {
    this.assert( this.triggerCondition.children.length === 1, 
                 "How do we not have exactly 1 trigger condition?!")

    if ( this.isEnabled && 
         ( this.triggerCondition.children.length > 0 ) && 
         this.triggerCondition.children[ 0 ].evaluateClause() ) {

        this.triggered();

        this.spew( "checkFire", "Firing actions for trigger '" + this.name + 
                   "'." );

        for ( var i = 0; i < this.actions.length; ++i ) {
            this.spew( "checkFire", "    Action " + i + " starting." );
            this.actions[ i ] && this.actions[ i ]();
            this.spew( "checkFire", "    Action " + i + " complete." );
        }

        this.spew( "checkFire", "All actions complete for trigger '" + 
                   this.name + "'.");
    }
}

this.spew = function( str1, str2 ) {
    if (this.spewToLog) {
        this.logger.logx( str1, str2 );
    }
}

this.setIsEnabled$ = function( value ) {
    this.assert( this.isEnabled !== value, "Redundant set of isEnabled." );
    if ( value && !this.isEnabled ) {
        this.isEnabled = true;
        this.enabled();
    } else if ( this.isEnabled ) {
        this.isEnabled = false;
        this.disabled();
    }
}

//@ sourceURL=source/triggers/trigger.js
