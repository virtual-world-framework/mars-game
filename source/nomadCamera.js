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

this.setCameraTarget = function( node, mountName ) {
    if ( !node || !node.getMount ) {
        this.logger.errorx( "setCameraTarget", "This function requires a cameraTarget node." );
    } else {
        if ( this.target ) {
            this.detachFromTarget();
        }
        this.target = node;
        this.setCameraMount( mountName );
        this.attachToTarget();
    }
}

this.setCameraMount = function( mountName ) {
    var mount;
    mount = this.target.getMount( mountName );
    if ( !mount ) {
        this.logger.errorx( "setCameraMount", "No camera mount could be found!" );
    } else {
        mount.mountCamera( this );
    }
}

this.followTarget = function( transform ) {
    for ( var i = 0; i < 3; i++ ) {
        this.transform[ i + 12 ] += transform[ i + 12 ] - this.lastTargetPosition[ i ];
        this.lastTargetPosition[ i ] = transform[ i + 12 ];
    }
}

this.attachToTarget = function() {
    for ( var i = 0; i < 3; i++ ) {
        this.lastTargetPosition[ i ] = this.target.transform[ i + 12 ];
    }
    this.target.transformChanged = this.target.events.add( this.followTarget );
}

this.detachFromTarget = function() {
    this.target.transformChanged = this.target.events.remove( this.followTarget );
}

//@ sourceURL=source/nomadCamera.js