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

function appendClass( element, className ) {
    if ( element.className.indexOf( className ) === -1 ) {
        element.className += " " + className;
    }
}

function removeClass( element, className ) {
    if ( element.className.indexOf( className ) !== -1 ) {
        element.className = element.className.replace( " " + className, "" );
    }
}

function copyArray( a, b ) {
    for ( var i = 0; i < b.length; i++ ) {
        a[ i ] = b[ i ];
    }
}

function removeArrayElement( array, index ) {
    for ( var i = index; i < array.length - 1; i++ ) {
        array[ i ] = array[ i + 1 ];
    }
    array.length--;
}

//@ sourceURL=source/utils.js