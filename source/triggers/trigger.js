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
    this.children.create( "actions", 
                          "http://vwf.example.com/node.vwf" );
}

this.initTrigger = function( clauseGen, actionGen, definition, scenario ) {
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

    this.spewToLog = this.spewToLog || definition.spewToLog;

    if ( definition.group ) {
        this.assert( definition.priority !== undefined,
                     "Triggers in groups must have a priority defined!",
                     true );

        this.groupName = definition.group;
        this.priority = definition.priority;

        this.scene.triggerGroupManager.addTrigger( this );
    }

    var payload = { trigger: this, scenario: scenario };

    clauseGen.generateObject( definition.triggerCondition[ 0 ],
                              this.triggerCondition, payload );

    for ( var i = 0; i < definition.actions.length; ++i ) {
        actionGen.generateObject( definition.actions[ i ], this.actions, 
                                  payload );
    }

    return true;
}

this.checkFire = function() {
    if ( this.check() ) {
        this.fire();
    }
}

this.check = function() {
    // If we're nto enable, bail
    if ( !this.isEnabled ) {
        return false;
    }

    // If we have a group, and that group isn't the one asking for the check 
    //  then bail (only the group is allowed to fire group triggers - that's 
    //  the whole point of having a group).  
    this.assert( !this.groupName || this.group, 
                 "How do we have a group name but no group?!" );

    if ( this.group && !this.group.isEvaluating ) {
        return false;
    }

    // Otherwise, evaluate our trigger condition and return the result.
    this.assert( this.triggerCondition.children.length === 1, 
                 "How do we not have exactly 1 trigger condition?!" );

    return ( this.triggerCondition.children.length > 0 ) && 
           this.triggerCondition.children[ 0 ].evaluateClause();
}

this.fire = function() {
    this.triggered();

    this.spew( "fire", "Firing actions for trigger '" + this.name + "'." );

    for ( var i = 0; i < this.actions.children.length; ++i ) {
        this.spew( "fire", "    Starting action " + i + " ('" + 
                   this.actions.children[ i ].name + "')." );
        this.actions.children[ i ].executeAction();
        this.spew( "fire", "    Finished action " + i + " ('" + 
                   this.actions.children[ i ].name + "')." );
    }

    this.spew( "fire", "All actions complete for trigger '" + this.name + "'.");
}

this.spew = function( str1, str2 ) {
    if ( this.spewToLog ) {
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
