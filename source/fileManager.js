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
    fileInput: undefined,
    file: undefined,
    saveLink: undefined,
    initialize: function( domParent ) {
        this.cache = {};
        this.reader = new FileReader();
        this.fileInput = document.createElement( "input" );
        this.fileInput.id = "fileInput";
        this.fileInput.type = "file";
        this.fileInput.onchange = this.openFile.bind( this );
        if ( domParent ) {
            domParent.appendChild( this.fileInput );
        }
        this.saveLink = document.createElement( "a" );
        this.saveLink.id = "saveLink";
        this.saveLink.style.display = "none";
        document.body.appendChild( this.saveLink );
    },
    openFile: function( callback ) {
        var file = this.fileInput.files[ 0 ];
        this.reader.onload = ( function( event ) {
            var file = this.makeFile( this.reader.result );
            this.file = file;
        } ).bind( this );
        this.reader.readAsText( file, "text/plain" );
    },
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
        this.saveLink.innerHTML = "Click to download " + filename;
        this.saveLink.href = url;
        this.saveLink.download = filename;
        this.saveLink.style.display = "block";
        // this.saveLink.onclick = ( function( event ) {
        //     this.saveLink.innerHTML = "";
        //     this.saveLink.href = "";
        //     this.saveLink.download = "";
        //     this.saveLink.style.display = "none";
        //     URL.revokeObjectURL( url );
        // } ).bind( this );
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