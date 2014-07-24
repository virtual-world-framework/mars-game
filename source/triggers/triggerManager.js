this.initialize = function() {
    this.triggerSet$ = {};

    // We have to create these here because VWF doesn't give our children
    //   to objects that extend us.
    this.children.create( "conditionFactory", 
                          "source/triggers/booleanFunctionFactory.vwf" );

    this.children.create( "actionFactory",
                          "source/triggers/actionFactory.vwf" );
}

this.loadTriggers = function( context ) {
    if ( !this.isEmpty() ) {
        this.logger.warnx( "loadTriggers", "Loading a new set of triggers, " +
                           "but we still had some there from a previous set!" );
    }

    this.loadTriggerList( this.triggers, context );
}

this.loadTriggerList = function( triggerList, context ) {
    for ( var key in triggerList ) {
        if ( !triggerList.hasOwnProperty( key ) ) {
            continue;
        }

        this.addTrigger( key, triggerList[ key ], context );
    }
}

this.addTrigger = function( triggerName, trigger, context ) {
    this.triggerSet$[ triggerName ] = new Trigger( this.conditionFactory, 
                                                   this.actionFactory, 
                                                   context, 
                                                   trigger, 
                                                   this.logger );
}

this.clearTriggers = function() {
    for ( var key in this.triggerSet$ ) {
        if ( !this.triggerSet$.hasOwnProperty( key ) ) {
            continue;
        }

        this.triggerSet$[ key ].isDeleted = true;
        delete this.triggerSet$[ key ];
    }

    if ( !this.isEmpty() ) {
        this.logger.errorx( "clearTriggers", "How do we still have triggers?!" );
    }
}

this.clearTriggerList = function( triggerList ) {
    for ( var key in triggerList ) {
        if ( !triggerList.hasOwnProperty( key ) ) {
            continue;
        }

        if ( this.triggerSet$[ key ] !== undefined ) {
            this.triggerSet$[ key ].isDeleted = true;
            delete this.triggerSet$[ key ];
        } else {
            this.logger.warnx( "clearTriggerList", "Trigger '" + key +
                               "' not found.");
        }
    }
}

this.isEmpty = function() {
    for ( var key in this.triggerSet$ ) {
        if ( this.triggerSet$.hasOwnProperty( key ) ) {
            return false;
        }
    }

    return true;
}

function Trigger( conditionFactory, actionFactory, context, definition, logger ) {
    this.initialize( conditionFactory, actionFactory, context, definition, logger );
    return this;
}

Trigger.prototype = {
    // The conditions that we check to see if the trigger should fire
    triggerCondition: undefined,
    additionalCondition: undefined,

    // The actions we take when the trigger fires
    actions: undefined,

    // This doesn't appear to be getting deleted properly, so redundantly disable it
    //   if it should be deleted.
    isDeleted: undefined,

    initialize: function( conditionFactory, actionFactory, context, definition, 
                          logger ) {
        if ( !definition.triggerCondition || 
             ( definition.triggerCondition.length !== 1 ) ) {

            logger.errorx( "Trigger.initialize", "There must be exactly one " +
                           "trigger condition.  Try using 'and' or 'or'." );
            return undefined;
        } 

        if ( definition.additionalCondition && 
             ( definition.additionalCondition.length !== 1 ) ) {

            logger.errorx( "Trigger.initialize", "There must be at most one " +
                           "additional condition.  Try using 'and' or 'or'." );
            return undefined;
        }

        if ( !definition.actions || ( definition.actions.length < 1 )) {
            logger.errorx( "Trigger.initialize", "There must be at least one " +
                           "action." );
            return undefined;
        }

        this.isDeleted = false;

        this.triggerCondition = 
            conditionFactory.executeFunction( definition.triggerCondition[0],
                                              context, 
                                              this.checkFire.bind( this ) );

        if ( definition.additionalCondition ) {
            this.additionalCondition = 
                conditionFactory.executeFunction( definition.additionalCondition[0],
                                                  context );
        }

        this.actions = [];
        for ( var i = 0; i < definition.actions.length; ++i ) {
            var action = actionFactory.executeFunction( definition.actions[ i ], 
                                                        context );
            action && this.actions.push( action );
        }
    },

    // Check our conditions, and take action if they're true
    checkFire: function() {
        if ( !this.isDeleted && 
             this.triggerCondition && this.triggerCondition() &&
             ( !this.additionalCondition || this.additionalCondition() ) ) {
            for ( var i = 0; i < this.actions.length; ++i ) {
                this.actions[ i ] && this.actions[ i ]();
            }
        }
    },
}

//@ sourceURL=source/triggers/triggerManager.js
