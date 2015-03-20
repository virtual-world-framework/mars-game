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
    this.triggers$ = [];
    this.canFire$ = [];
    this.checkFrequency$ = 0.08 + ( Math.random() * 0.04 );
    this.future( this.checkFrequency$ ).checkTriggers$();
}

this.addTrigger = function( trigger ) {
    this.assert( trigger.groupName === this.name );

    var triggers$ = this.triggers$;
    triggers$.push( trigger );
    this.triggers$ = triggers$;

    var canFire$ = this.canFire$;
    canFire$.push( false );
    this.canFire$ = canFire$;

    this.assert( this.triggers$.length === this.canFire$.length );
}

this.checkTriggers$ = function() {
    // We need to keep track of whether we're currently evaluating, so that
    //  triggers know they're allowed to fire!
    this.isEvaluating$ = true;

    // First, check if each trigger is ready to fire.
    var triggers = this.triggers$;
    var numTriggers = triggers.length;
    var haveTriggerToFire = false;
    var canFire = this.canFire$;
    for ( var i = 0; i < numTriggers; ++i ) {
        canFire[ i ] = triggers[ i ].check();
        haveTriggerToFire = haveTriggerToFire || canFire[ i ];
    }

    this.canFire$ = canFire;
    this.triggers$ = triggers;

    // done evaluating (for now)
    this.isEvaluating$ = false;

    // We can't control where we are in the evaluation.  It may be that two 
    //  triggers are going to fire during the same frame, but one actually
    //  fires before the group checks its trigger and the other fires after - 
    //  which would result in both being valid (because to the group, it would
    //  look like they fired one after the other).  This would be rare, but not
    //  impossible - especially with a low frame rate.  In order to address 
    //  this, do another check after a future(0).
    if ( haveTriggerToFire ) {
        this.future( 0 ).checkTriggersCallback$();
    } else if ( this.isChecking ) {
        // schedule the next check
        this.future( this.checkFrequency$ ).checkTriggers$();
    }
}

this.checkTriggersCallback$ = function() {
    // We need to keep track of whether we're currently evaluating, so that
    //  triggers know they're allowed to fire!
    this.isEvaluating$ = true;

    // First, check each trigger that wasn't ready in checkTriggers$ to see if
    //  it's ready now.
    var haveTriggerToFire = false;
    for ( var i = 0; i < this.triggers$.length; ++i ) {
        if ( !this.canFire$[ i ] ) {
            var trigger = this.triggers$[ i ];
            this.canFire$[ i ] = trigger.isEnabled && trigger.check();
            haveTriggerToFire = haveTriggerToFire || this.canFire$[ i ];
        } else {
            haveTriggerToFire = true;
        }
    }
    this.assert( haveTriggerToFire );

    // Next, find the best priority and the number of triggers at that priority.
    var bestPriority = Number.NEGATIVE_INFINITY;
    var numAtPriority = 0;
    for ( var i = 0; i < this.triggers$.length; ++i ) {
        if ( this.canFire$[ i ] ) {
            var triggerPriority = this.triggers$[ i ].priority;

            if ( triggerPriority > bestPriority ) {
                bestPriority = triggerPriority;
                numAtPriority = 1;
            } else if ( triggerPriority === bestPriority ) {
                ++numAtPriority;
            } 
        }
    }
    this.assert( bestPriority > Number.NEGATIVE_INFINITY );
    this.assert( numAtPriority > 0 );

    // Finally, pick a trigger and fire it.  Tell all other triggers that were 
    //  ready to fire that they were evaluated, so they can record keep 
    //  accordingly.

    // Math.random() returns [0, 1), so this will get us a random integer 
    //  in the range [0, numAtPriority).
    var selectionValue = Math.floor( Math.random() * numAtPriority );

    for ( var i = 0; i < this.triggers$.length; ++i ) {
        var trigger = this.triggers$[ i ];
        if ( this.canFire$[ i ] ) {
            if ( trigger.priority === bestPriority ) {
                if ( selectionValue === 0 ) {
                    // this.logger.logx( "checkTriggersCallback$",
                    //                   "Firing trigger '" + trigger.name +
                    //                   "'." );
                    trigger.fire();
                    continue;
                }
                --selectionValue;
            }
        } 

        // If we get here, we didn't fire (because there's a continue when we
        //  fire).
        // this.logger.logx( "checkTriggersCallback$",
        //                   "   Evaluated trigger '" + trigger.name +
        //                   "'." );
        trigger.evaluated();
    }

    // schedule the next check - this wasn't done inside checkTriggers$ because
    //  we scheduled this check instead.
    this.future( this.checkFrequency$ ).checkTriggers$();
}

//@ sourceURL=source/triggers/groups/triggerGroup.js
