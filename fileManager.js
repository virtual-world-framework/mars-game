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

var FileManager = function() {
	if ( File && FileReader && FileList && Blob ) {
		this.initialize();
	} else {
		alert( "Your browser does not support the File APIs!" );
	}
	return this;
}

FileManager.prototype = {
	constructor: FileManager,
	cache: undefined,
	reader: undefined,
	initialize: function() {
		this.cache = new Array();
		this.reader = new FileReader();
	},
	readFile: function( file ) {
		this.reader.onload = function( event ) {
			console.log( this.reader.result );
		}
		this.reader.readAsText( file, "text/plain" );
	},
	saveFile: function() {}
}