"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.combine = void 0;
function combine(initS) {
    var fn = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        fn[_i - 1] = arguments[_i];
    }
    return function (s, a) {
        if (s === void 0) { s = initS; }
        for (var i = 0; i < fn.length; i += 1) {
            var newState = fn[i](s, a);
            if (newState)
                return newState;
        }
        return s;
    };
}
exports.combine = combine;
