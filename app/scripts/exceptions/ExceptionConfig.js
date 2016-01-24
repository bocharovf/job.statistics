angular
    .module('hhStat')
    .config(exceptionConfig);

exceptionConfig.$inject = ['$provide'];

function exceptionConfig($provide) {
    $provide.decorator('$exceptionHandler', extendExceptionHandler);
}

extendExceptionHandler.$inject = ['$delegate', '$injector'];

function extendExceptionHandler($delegate, $injector) {
    return function(exception, cause) {
        $delegate(exception, cause);
        
        var backend = $injector.get('BackendService');
        backend.logRemote(exception.stack, true);
    };
}