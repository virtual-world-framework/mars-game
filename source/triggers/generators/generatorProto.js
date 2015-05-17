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

this.addObjectSet = function( functionSet ) {
    this.objSets$.unshift( functionSet );
}

this.generateObject = function( objDefinition, parentObj, payload ) {
    // So this is a little bit ugly (or maybe just Javascript-ey)...
    // The first thing we're going to do is get the name of the function, which
    //  is done using black magic and the power of the internets, as follows:
    var objKeys = Object.keys( objDefinition );
    if ( objKeys.length != 1 )
    {
        console.log('malformed data');
        this.logger.errorx( "generateObject", "Malformed data definition." );
        return undefined;
    }
    var typeName = objKeys[ 0 ];
    var params = objDefinition[ typeName ] || [];
 
    for ( var i = 0; i < this.objSets$.length; ++i ) {
        var objSet = this.objSets$[ i ];
        var objFileName = objSet[ typeName ];
        this.assert( objFileName, "Object file not found - this may not be " +
                                  "an error if you have more than one object " +
                                  "set.");

        if ( objFileName ) {
            var onGenerated = function( generatedObj ) {
                if ( !generatedObj.onGenerated ) {
                    this.assert( false, "The prototype for objects of type '" +
                                        typeName + "' doesn't have an " +
                                        "onGenerated method! You need to " +
                                        "define that." );
                    parentObj.children.delete( generatedObj );
                } else {
                    if ( !generatedObj.onGenerated( params, this, payload ) ) {
                        this.assert( false, "Failed to initialize object of " +
                                            "type '" + typeName + "'!");
                        parentObj.children.delete( generatedObj );
                    }
                }
            };

            var uniqueName = typeName + "_" + this.uniqueNameCtr$;
            this.uniqueNameCtr$++;

            parentObj.children.create( uniqueName, objFileName, 
                                       onGenerated.bind( this ) );

            return;
        }
    }

    this.logger.errorx( "generateObject", "Failed to find definition " +
                        "for object of type '" + typeName + "'." );
}

//@ sourceURL=source/triggers/generators/generatorProto.js
