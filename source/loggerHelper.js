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

var shortMsg = "";

this.addLogWithLimit = function( msg, widthLimit ) {
    if ( msg.length > widthLimit ) {
        shortMsg = msg.substring( 0, widthLimit );
        var spaceIndex = shortMsg.lastIndexOf( " " );
        this.addLog( msg.substring( 0, spaceIndex ) );
        this.addLogWithLimit( msg.substring( spaceIndex, msg.length ), widthLimit );
    } else {
        this.addLog( msg );
    }
}

//@ sourceURL=source/loggerHelper.js