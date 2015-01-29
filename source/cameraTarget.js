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

this.getMount = function( mountName ) {
	var mount;
	if ( mountName ) {
		mount = this[ mountName ];
		if ( !mount ) {
			this.logger.errorx( "getMount", this.name + "." + mountName + " could not be found!" );
			return undefined;
		} else if ( !mount.mountCamera ) {
			this.logger.errorx( "getMount", this.name + "." + mountName + " is not a cameraMount!" );
			return undefined;
		}
	} else {
		mount = this.defaultMount;
	}
	return mount;
}

this.setDefaultMount = function( mountName ) {
	var mount;
	if ( mountName ) {
		mount = this[ mountName ];
		if ( !mount ) {
			this.logger.errorx( "setDefaultMount", this.name + "." + mountName + " could not be found!" );
		} else if ( !mount.mountCamera ) {
			this.logger.errorx( "setDefaultMount", this.name + "." + mountName + " is not a cameraMount!" );
		}
	} else {
		this.logger.errorx( "setDefaultMount", "No mount name found!" );
	}
	this.defaultMount = mount;
}

//@ sourceURL=source/cameraTarget.js