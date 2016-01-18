'use strict';

/**
 * @class extensions
 * @description SelectMany analog written by @sharkbrainguy (https://gist.github.com/sharkbrainguy/5086585)
 */
(function () {
    var apply = Function.prototype.apply;
    var flatten = apply.bind(Array.prototype.concat, []);

    Array.prototype.selectMany = function (fn) {
        return flatten(this.map(fn));
    };
}());