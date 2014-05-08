var self;

this.clauseSets$ = [];

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
 
	for ( var i = 0; i < self.clauseSets$.length; ++i ) {
		var clauseSet = self.clauseSets$[ i ];

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
	self.clauseSets$.unshift( clauseSet );
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
