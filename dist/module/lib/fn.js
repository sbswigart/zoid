'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.noop = noop;
exports.once = once;
exports.memoize = memoize;
exports.debounce = debounce;
exports.serializeFunctions = serializeFunctions;
exports.deserializeFunctions = deserializeFunctions;

var _util = require('./util');

/*  Noop
    ----

    Do nothing, zilch, nada, zip
*/

function noop() {}
// pass


/*  Once
    ----

    Create a wrapper function which only allows the inner function to run once, otherwise is a noop
*/

function once(method) {

    var called = false;
    var result = void 0;

    // eslint-disable-next-line no-unused-vars
    return function onceWrapper() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        if (called) {
            return result;
        }

        called = true;
        result = method.apply(this, arguments);
        return result;
    };
}

/*  Memoize
    -------

    Create a wrapper function which caches the result of the first call, then for subsequent calls returns the cached value
*/

function memoize(method) {

    var results = {};

    // eslint-disable-next-line no-unused-vars
    return function memoizeWrapper() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        var cacheKey = void 0;

        try {
            cacheKey = JSON.stringify(Array.prototype.slice.call(arguments), function (key, val) {

                if (typeof val === 'function') {
                    return 'xcomponent:memoize[' + (0, _util.getObjectID)(val) + ']';
                }

                return val;
            });
        } catch (err) {
            throw new Error('Arguments not serializable -- can not be used to memoize');
        }

        if (!results.hasOwnProperty(cacheKey)) {
            results[cacheKey] = method.apply(this, arguments);
        }

        return results[cacheKey];
    };
}

function debounce(method) {
    var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;


    var timeout = void 0;

    return function debounceWrapper() {
        var _this = this,
            _arguments = arguments;

        clearTimeout(timeout);

        timeout = setTimeout(function () {
            return method.apply(_this, _arguments);
        }, time);
    };
}

function serializeFunctions(obj) {
    return (0, _util.replaceObject)(obj, function (value) {
        if (typeof value === 'function') {
            return {
                __type__: '__function__'
            };
        }
    });
}

function deserializeFunctions(obj, handler) {
    return (0, _util.replaceObject)(obj, function (value, key, fullKey) {
        if (value && value.__type__ === '__function__') {
            return function deserializedFunctionWrapper() {
                return handler({ key: key, fullKey: fullKey, self: this, args: arguments });
            };
        }
    });
}