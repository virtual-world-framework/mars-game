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

this.addTrigger = function( trigger ) {
    this.assert( trigger && trigger.groupName );
    var groupName = trigger.groupName;

    // We use an array to keep track of the groups that we have, because they
    //  may not be fully created yet.  This is also why triggers are added
    //  to the group in a future(0).
    if ( this.groupNames.indexOf( groupName ) < 0 ) {

        // If we get here, the group hasn't been added yet - so do that.  
        this.groups.children.create( groupName, 
                                     "source/triggers/groups/triggerGroup.vwf" );

        this.groupNames.push( groupName );
    }

    this.future( 0.01 ).insertTrigger$( trigger );
}

this.getGroup = function( groupName ) {
    var groupArray = this.groups.find( groupName );
    this.assert( groupArray && ( groupArray.length !== undefined ) );
    return groupArray[ 0 ];
}

this.insertTrigger$ = function( trigger ) {
    var group = this.getGroup( trigger.groupName );
    this.assert( group );
    group.addTrigger( trigger );
}

this.setCheckingGroups$ = function( value ) {
    var i, names, group;
    names = this.groupNames;
    for ( i = 0; i < names.length; i++ ) {
        group = this.groups.find( names[ i ] )[ 0 ];
        group.isChecking = value;
    }
}

//@ sourceURL=source/triggers/groups/triggerGroupManager.js
