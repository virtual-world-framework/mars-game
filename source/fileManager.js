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

var FileManager = function( domParent ) {
    if ( File && FileReader && FileList && Blob ) {
        this.initialize( domParent );
    } else {
        alert( "Your browser does not support the File APIs!" );
    }
    return this;
}

FileManager.prototype = {
    constructor: FileManager,
    cache: undefined,
    reader: undefined,
    loadElement: undefined,
    saveElement: undefined,
    file: undefined,
    initialize: function( domParent ) {
        this.cache = {};
        this.reader = new FileReader();
        this.loadElement = document.createElement( "input" );
        this.loadElement.id = "loadElement";
        this.loadElement.type = "file";
        this.loadElement.onchange = this.openFile.bind( this );
        this.saveElement = document.createElement( "div" );
        this.saveElement.saveLink = document.createElement( "a" );
        this.saveElement.saveLink.id = "saveLink";
        this.saveElement.saveText = document.createElement( "input" );
        this.saveElement.saveText.type = "text";
        this.saveElement.saveText.id = "saveText";
        this.saveElement.appendChild( this.saveElement.saveText );
        this.saveElement.appendChild( this.saveElement.saveLink );
        this.saveElement.id = "saveElement";
        this.saveElement.saveLink.innerHTML = "Save File";
        if ( domParent ) {
            domParent.appendChild( this.loadElement );
            domParent.appendChild( this.saveElement );
        } else {
            document.body.appendChild( this.loadElement );
            document.body.appendChild( this.saveElement );
        }
    },
    openFile: function( callback ) {
        var file = this.loadElement.files[ 0 ];
        this.reader.onload = ( function( event ) {
            var file = this.makeFile( this.reader.result );
            this.file = file;
            this.onFileOpened( file );
        } ).bind( this );
        this.reader.readAsText( file, "text/plain" );
    },
    onFileOpened: function( file ) {},
    makeFile: function( input ) {
        var file;
        if ( !( input instanceof Array ) ) {
            input = [ input ];
        }
        file = new Blob( input, { "type": "text/plain" } );
        return file;
    },
    readFile: function( value, callback ) {
        var file = this.checkCache( value );
        if ( file === false ) {
            return;
        }
        var contents;
        this.reader.onload = ( function( event ) {
            contents = this.reader.result;
            if ( callback instanceof Function ) {
                callback( contents );
            } else {
                console.log( contents );
            }
        } ).bind( this );
        this.reader.readAsText( file );
    },
    saveFile: function( value, filename ) {
        var file = this.checkCache( value );
        if ( file === false ) {
            return;
        }
        var url = URL.createObjectURL( file );
        this.saveElement.saveLink.href = url;
        this.saveElement.saveLink.download = filename;
    },
    cacheFile: function( file, cacheID ) {
        this.cache[ cacheID ] = file;
    },
    checkCache: function( value ) {
        if ( value instanceof Blob ) {
            return value;
        } else if ( typeof value === "string" ) {
            if ( this.cache[ value ] instanceof Blob ) {
                return this.cache[ value ];
            } else {
                console.log( "Could not find file with ID " +
                    "\"" + value + "\" in the cache." );
                return false;
            }
        } else {
            console.log( "This function only accepts values " +
                "of the types string and Blob (files)." );
            return false;
        }
    }
} //@ sourceURL=source/fileManager.js