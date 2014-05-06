var self;
var cachedScene;

this.initialize = function() {
    self = this;
}

this.checkForSuccess = function() {
    if (self.hasSucceeded && self.hasSucceeded()) {
        self.completed();
    }
}

this.checkForFailure = function() {
    if (self.hasFailed && self.hasFailed()) {
        self.failed();
    }
}

this.Clause_isAtPosition = function(objectName, x, y, callback) {
    var object = findInScene(objectName);
 
    object.moved = self.events.add( callback );

    return function() {
        return ( object.currentGridSquare[0] === x && 
                 object.currentGridSquare[1] === y );
    };
}

this.Clause_hasObject = function(ownerName, objectName, callback) {
    var owner = findInScene(ownerName);
    var object = findInScene(objectName);

    object.pickedUp = self.events.add( callback );
    object.dropped = self.events.add( callback );

    return function() {
        return owner.find( "*/" + objectName ).length > 0;
    };
}

this.Clause_moveFailed = function(objectName, callback) {
    var object = findInScene(objectName);
    var moveHasFailed = false;

    object.moveFailed = self.events.add( function() {
        moveHasFailed = true;
        callback();
    })

    return function() {
        return moveHasFailed;
    };
}

this.Clause_AND = function() {
    var clauses = arguments;
    return function() {
        for ( var i = 0; i < clauses.length; ++i ) {
            if (!clauses[i]()) { 
                return false;
            }
        }
        return true;
    }
}

this.Clause_OR = function() {
    var clauses = arguments;
    return function() {
        for ( var i = 0; i < clauses.length; ++i ) {
            if (clauses[i]()) { 
                return true;
            }
        }
        return false;
    }
}

this.Clause_NOT = function(clause) {
    return function() {
        return !clause();
    }
}

function findInScene(object) {
    var results = getScene().find( "//" + object );

    if (results.length < 1) {
        self.logger.errorx("findInScene", "Object '" + object + "' not found");
        return undefined;
    } else if (results.length > 1) {
        self.logger.errorx("findInScene", "Multiple objects named '" + object + 
                           "' found.  Names must be unique!");
        return undefined;
    } else {
        return results[0];
    }
}

function getScene() {
    if ( !cachedScene ) {
        var searchArray = self.find( self.scenePath );
        if ( searchArray.length ) {
            cachedScene = searchArray[ 0 ];
        }
    }
    return cachedScene;
}

//@ sourceURL=source/scenario.js
