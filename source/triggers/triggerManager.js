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
    if ( this.uri ) {
        return;
    }
    this.children.create( "clauseGen", 
                          "source/triggers/generators/generator_Clause.vwf" );

    this.children.create( "actionGen",
                          "source/triggers/generators/generator_Action.vwf" );

    // This one is just an empty node that will hold all of our triggers once
    //  we create them.
    this.children.create( "triggerSet", "http://vwf.example.com/node.vwf" );
}

this.loadTriggers = function( scenario ) {
    this.assert( this.triggerSet );
    if ( this.triggerSet.children.length > 0 ) {
        this.logger.warnx( "loadTriggers", "Loading a new set of triggers, " +
                           "but we still had some there from a previous set!" );
    }

    this.loadTriggerList( this.triggers, scenario );
}

this.loadTriggerList = function( triggerList, scenario ) {
    for ( var key in triggerList ) {
        if ( !triggerList.hasOwnProperty( key ) ) {
            continue;
        }

        this.addTrigger( key, triggerList[ key ], scenario );
    }
}

this.addTrigger = function( triggerName, definition, scenario ) {
    var initTrigger = function( trigger ) {
        var success = trigger.initTrigger( this.clauseGen, this.actionGen,
                                           definition, scenario );

        if ( !success ) {
            this.logger.errorx( "addTrigger", "Failed to initialize " +
                                "trigger '" + triggerName + "'!");
            this.triggerSet.children.delete( trigger );
        }
    };

    this.triggerSet.children.create( triggerName, 
                                     "source/triggers/trigger.vwf",
                                     initTrigger.bind( this ) );
}

this.setIsEnabled$ = function( value ) {
    if ( !this.name ) {
        return; // this is the prototype
    }

    this.assert( this.triggerSet );
    if ( this.isEnabled !== value ) {
        this.isEnabled = value;
        for ( var i = 0; i < this.triggerSet.children.length; ++i ) {
            this.triggerSet.children[ i ].isEnabled = value;
        }
    }
}

//@ sourceURL=source/triggers/triggerManager.js
