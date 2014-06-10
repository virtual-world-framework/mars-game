this.initialize = function() {
    this.children.create( "conditionFactory", 
                          "source/triggers/booleanFunctionFactory.vwf" );

    this.children.create( "actionFactory",
                          "source/triggers/actionFactory.vwf" );
}

this.loadTriggers = function( triggers, context ) {
	if ( !this.isEmpty() ) {
		this.logger.warnx( "loadTriggers", "Loading a new set of triggers, but " +
						   "we still had some there from a previous set!" );
	}

	for ( var key in triggers ) {
		if ( !triggers.hasOwnProperty( key ) ) {
			continue;
		}

		this.triggers$[ key ] = new Trigger( this.conditionFactory, 
											 this.actionFactory, 
											 context, 
											 triggers[ key ], 
											 this.logger );
	}
}

this.clearTriggers = function() {
	for ( var key in this.triggers$ ) {
		if ( !this.triggers$.hasOwnProperty( key ) ) {
			continue;
		}

		delete this.triggers$[ key ];
	}

	if ( !this.isEmpty() ) {
		this.logger.errorx( "clearTriggers", "How do we still have triggers?!" );
	}
}

this.isEmpty = function() {
	for ( var key in this.triggers$ ) {
		if ( this.triggers$.hasOwnProperty( key ) ) {
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
    actions: [],

    initialize: function( conditionFactory, actionFactory, context, definition, logger ) {
        if ( !definition.triggerCondition || ( definition.triggerCondition.length !== 1 ) ) {
            logger.errorx( "Trigger.initialize", "There must be exactly one trigger " +
                           "condition.  Try using 'and' or 'or'." );
            return undefined;
        } 

        if ( definition.additionalCondition && ( definition.additionalCondition.length !== 1 ) ) {
            logger.errorx( "Trigger.initialize", "There must be at most one additional " +
                           "condition.  Try using 'and' or 'or'." );
            return undefined;
        }

        if ( !definition.actions || ( definition.actions.length < 1 )) {
            logger.errorx( "Trigger.initialize", "There must be at least one action." );
            return undefined;
        }

        this.triggerCondition = 
            conditionFactory.executeFunction( definition.triggerCondition[0],
                                              context, 
                                              this.checkFire.bind( this ) );

        if ( definition.additionalCondition ) {
            this.additionalCondition = 
                conditionFactory.executeFunction( definition.additionalCondition[0],
                                                  context );
        }

        for ( var i = 0; i < definition.actions.length; ++i ) {
            var action = actionFactory.executeFunction( definition.actions[ i ], context );
            action && this.actions.push( action );
        }
    },

    // Check our conditions, and take action if they're true
    checkFire: function() {
        if ( this.triggerCondition && this.triggerCondition() &&
             ( !this.additionalCondition || this.additionalCondition() ) ) {
            for ( var i = 0; i < this.actions.length; ++i ) {
                this.actions[ i ] && this.actions[ i ]();
            }
        }
    },
}

//@ sourceURL=source/triggers/triggerManager.js
