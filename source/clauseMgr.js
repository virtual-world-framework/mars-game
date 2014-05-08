var self;

this.clauseSets = [];

this.initialize = function() {
	self = this;

	self.addClauseSet(self.defaultClauseSet);
}

this.constructClause = function( clause, callback, context ) {
	// So this is a little bit ugly (or maybe just Javascript-ey)...
	// The first thing we're going to do is get the name of the clause, which 
	//  is done using black magic and the power of the internets, as follows:
	var clauseKeys = Object.keys( clause );
	if ( clauseKeys.length != 1 )
	{
		this.logger.errorx( "constructClause", "Malformed clause." );
		return undefined;
	}
	var clauseName = clauseKeys[ 0 ];
   	var clauseParams = clause[ clauseName ];
 
	for ( var i = 0; i < self.clauseSets.length; ++i ) {
		var clauseSet = self.clauseSets[ i ];

		// This gray magic looks on this particular clause set to see if it has the
		//  required constructor function.
		var constructorFn = clauseSet[ clauseName ];

		// If we found it, call it.  The all take the same arguments - clauseParams
		//  is an array which contains the "real" arguments.
		if (constructorFn) {
			return constructorFn( clauseParams, callback, context );
		}
	}

	this.logger.errorx( "constructClause", "Failed to create clause of " +
								 "type '" + clauseName + "'." );

	return undefined;
}

this.addClauseSet = function( clauseSet ) {
	self.clauseSets.unshift( clauseSet );
}

this.findInContext = function( context, objectName ) {
	if (!context){
		this.logger.errorx( "findInContext", "Context  is undefined!" );
		return undefined;
	}

	var results = context.find( "*/" + objectName );

	if ( results.length < 1 ) {
		this.logger.errorx( "findInContext", "Object '" + objectName + 
									 "' not found" );
		return undefined;
	}
	
	if ( results.length > 1 ) {
		this.logger.warnx( "findInContext", "Multiple objects named '" + 
						   			objectName + "' found.  Names should really " +
						   			"be unique... but we'll return the first one." );
	} 

	return results[ 0 ];
}

this.defaultClauseSet.isAtPosition = function( params, callback, context ) {
	if ( !params || ( params.length != 3 ) ) {
		this.logger.errorx( "isAtPosition", 
							 		 		"The isAtPosition clause requires three " +
							 		 		"arguments: the object, the x, and the y." );
		return undefined;
	}

	var objectName = params[ 0 ];
	var x = params[ 1 ];
	var y = params[ 2 ];

	var object = self.findInContext( context, objectName );
 
	object.moved = self.events.add( callback );

	return function() {
		return ( object.currentGridSquare[ 0 ] === x && 
				 object.currentGridSquare[ 1 ] === y );
	};
}

this.defaultClauseSet.hasObject = function( params, callback, context ) {
	if ( !params || ( params.length != 2 ) ) {
		this.logger.errorx( "hasObject", 
								 	 		"The hasObject clause requires two arguments: " +
									 		"the owner and the object." );
		return undefined;
	}

	var ownerName = params[ 0 ];
	var objectName = params[ 1 ];

	var owner = self.findInContext( context, ownerName );
	var object = self.findInContext( context, objectName );

	object.pickedUp = self.events.add( callback );
	object.dropped = self.events.add( callback );

	return function() {
		return owner.find( "*/" + objectName ).length > 0;
	};
}

this.defaultClauseSet.moveFailed = function( params, callback, context ) {
	if ( !params || ( params.length != 1 ) ) {
		this.logger.errorx( "moveFailed", "The moveFailed clause " +
									 		"requires one argument: the object." );
		return undefined;
	}

	var objectName = params[ 0 ];

	var object = self.findInContext( context, objectName );
	var moveHasFailed = false;

	object.moveFailed = self.events.add( function() {
		moveHasFailed = true;
		callback();
	} );

	return function() {
		return moveHasFailed;
	};
}

this.defaultClauseSet.and = function( params, callback, context ) {
	if ( !params || ( params.length < 1 ) ) {
		this.logger.errorx( "and", "The 'and' clause needs to have at " +
									 		" least one (and ideally two or more) clauses " +
									 		" inside of it." );
		return undefined;
	} else if ( params.length < 2 ) {
		this.logger.warnx( "and", "The 'and' clause probably ought to " +
						   				   "have two or more clauses inside of it." );
	}

	var clauses = [];
	for ( var i = 0; i < params.length; ++i ) {
		var thisClause = self.constructClause( params[ i ], callback, context );
		thisClause && clauses.push( thisClause );
	}

	return function() {
		for ( var i = 0; i < clauses.length; ++i ) {
			if ( !clauses[ i ]() ) { 
				return false;
			}
		}
		return true;
	}
}

this.defaultClauseSet.or = function( params, callback, context ) {
	if ( !params || ( params.length < 1 ) ) {
		this.logger.errorx( "or", "The 'or' clause needs to have at " +
									 		"least one (and ideally two or more) clauses " +
									 		"inside of it." );
		return undefined;
	} else if ( params.length < 2 ) {
		this.logger.warnx( "or", "The 'or' clause probably ought to " +
						   				   "have two or more clauses inside of it." );
	}

	var clauses = [];
	for ( var i = 0; i < params.length; ++i ) {
		var thisClause = self.constructClause( params[ i ], callback, context );
		thisClause && clauses.push( thisClause );
	}

   return function() {
		for ( var i = 0; i < clauses.length; ++i ) {
			if ( clauses[ i ]() ) { 
				return true;
			}
		}
		return false;
	}
}

this.defaultClauseSet.not = function( params, callback, context ) {
	if ( !params || ( params.length != 1 ) ) {
		this.logger.errorx( "not", "The 'not' clause needs to have one " +
									 		"clause inside of it." );
		return undefined;
	}

	var clause = self.constructClause( params[ 0 ], callback, context );

	return function() {
		return !clause();
	}
}

//@ sourceURL=source/clauseMgr.js
