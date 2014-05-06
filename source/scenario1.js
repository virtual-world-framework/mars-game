var self = this;
var cachedScene;

this.entering = function() {
    var successCheckFn = self.checkForSuccess.bind(self);
    var failureCheckFn = self.checkForFailure.bind(self);
    
    var isAtGoal = self.Clause_isAtPosition( "rover", 15, 7, successCheckFn);
    var hasRadio = self.Clause_hasObject( "rover", "radio", successCheckFn);
    self.hasSucceeded = self.Clause_AND( isAtGoal, hasRadio );

    self.hasFailed = self.Clause_moveFailed( "rover", failureCheckFn);
}

//@ sourceURL=source/scenario1.js