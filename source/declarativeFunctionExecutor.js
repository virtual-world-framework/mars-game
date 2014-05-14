var self;

this.initialize = function() {
    self = this;
}

this.executeFunction = function( declarativeFn, context, callback ) {
    // So this is a little bit ugly (or maybe just Javascript-ey)...
    // The first thing we're going to do is get the name of the function, which 
    //  is done using black magic and the power of the internets, as follows:
    var fnKeys = Object.keys( declarativeFn );
    if ( fnKeys.length != 1 )
    {
        this.logger.errorx( "executeFunction", "Malformed function." );
        return undefined;
    }
    var fnName = fnKeys[ 0 ];
    var fnParams = declarativeFn[ fnName ];
 
    for ( var i = 0; i < self.functionSets.length; ++i ) {
        var fnSet = self.functionSets[ i ];

        // This gray magic looks on this particular function set to see if it 
        //  has the required constructor function.
        var implementation = fnSet[ fnName ];

        // If we found it, call it.  They all take the same arguments - 
        //  fnParams is an array which contains the arguments from the yaml.
        if (implementation) {
            return implementation( fnParams, context, callback );
        }
    }

    this.logger.errorx( "executeFunction", "Failed to find implementation " +
                        "for function of type '" + fnName + "'." );

    return undefined;
}

this.addFunctionSet = function( functionSet ) {
    self.functionSets.unshift( functionSet );
}

this.findInContext = function( context, objectName ) {
    if (!context) {
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

//@ sourceURL=source/declarativeFunctionExecutor.js
