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
 
    for ( var i = 0; i < this.functionSets.length; ++i ) {
        var fnSet = this.functionSets[ i ];

        // This gray magic looks on this particular function set to see if it 
        //  has the required constructor function.
        var fnImplementation = fnSet[ fnName ];

        // If we found it, call it.  They all take the same arguments - 
        //  fnParams is an array which contains the arguments from the yaml.
        if (fnImplementation) {
            return fnImplementation( fnParams, context, callback );
        }
    }

    this.logger.errorx( "executeFunction", "Failed to find implementation " +
                        "for function of type '" + fnName + "'." );

    return undefined;
}

this.addFunctionSet = function( functionSet ) {
    this.functionSets.unshift( functionSet );
}

this.findInContext = function( context, objectName ) {
    if (!context) {
        this.logger.errorx( "findInContext", "Context  is undefined!" );
        return undefined;
    }

    var results = context.find( "//" + objectName );

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

this.findTypeInContext = function( context, typeName ) {
    if (!context) {
        this.logger.errorx( "findInContext", "Context  is undefined!" );
        return undefined;
    }

    var results = context.find( ".//element(*,'" + typeName + "')" );

    if ( results.length < 1 ) {
        this.logger.errorx( "findTypeInContext", "Nothing found with type '" +
                            typeName + "'." );
    }

    if ( results.length > 1 ) {
        this.logger.warnx( "findTypeInContext", "Multiple objects of type '" + 
                           typeName + "' found.  We'll return the first one." );
    }

    return results[ 0 ];
}

//@ sourceURL=source/triggers/declarativeFunctionExecutor.js
