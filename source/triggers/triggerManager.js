var self;

this.initialize = function() {
	self = this;

    this.children.create( "conditionFactory", 
                          "source/triggers/booleanFunctionFactory.vwf" );

    this.children.create( "actionFactory",
                          "source/triggers/actionFactory.vwf" );
}

this.loadTriggers = function( triggers, context ) {
	if ( !self.isEmpty() ) {
		self.logger.warnx( "loadTriggers", "Loading a new set of triggers, but " +
						   "we still had some there from a previous set!" );
	}

	for ( var key in triggers ) {
		if ( !triggers.hasOwnProperty( key ) ) {
			continue;
		}

		self.triggers$[ key ] = new Trigger( self.conditionFactory, 
											 self.actionFactory, 
											 context, 
											 triggers[ key ], 
											 self.logger );
	}
}

this.clearTriggers = function() {
	for ( var key in self.triggers$ ) {
		if ( !self.triggers$.hasOwnProperty( key ) ) {
			continue;
		}

		delete self.triggers$[ key ];
	}

	if ( !self.isEmpty() ) {
		self.logger.errorx( "clearTriggers", "How do we still have triggers?!" );
	}
}

this.isEmpty = function() {
	for ( var key in self.triggers$ ) {
		if ( self.triggers$.hasOwnProperty( key ) ) {
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
    self: undefined,

    // The conditions that we check to see if the trigger should fire
    triggerCondition: undefined,
    additionalCondition: undefined,

    // The actions we take when the trigger fires
    actions: [],

    initialize: function( conditionFactory, actionFactory, context, definition, logger ) {
        self = this;

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

        self.triggerCondition = 
            conditionFactory.executeFunction( definition.triggerCondition[0],
                                              context, 
                                              self.checkFire.bind( self ) );

        if ( definition.additionalCondition ) {
            self.additionalCondition = 
                conditionFactory.executeFunction( definition.additionalCondition[0],
                                                  context );
        }

        for ( var i = 0; i < definition.actions.length; ++i ) {
            var action = actionFactory.executeFunction( definition.actions[ i ], context );
            action && self.actions.push( action );
        }
    },

    // Check our conditions, and take action if they're true
    checkFire: function() {
        if ( self.triggerCondition && self.triggerCondition() &&
             ( !self.additionalCondition || self.additionalCondition() ) ) {
            for ( var i = 0; i < self.actions.length; ++i ) {
                self.actions[ i ] && self.actions[ i ]();
            }
        }
    },
}

//@ sourceURL=source/triggers/triggerManager.js
