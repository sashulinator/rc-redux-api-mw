"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.success = exports.fail = exports.start = void 0;
exports.start = function (payload) {
    return {
        type: payload.action.stageActionTypes.START,
        payload: payload,
    };
};
exports.fail = function (payload) {
    return {
        type: payload.action.stageActionTypes.FAIL,
        payload: payload,
    };
};
exports.success = function (payload) {
    return {
        type: payload.action.stageActionTypes.SUCCESS,
        payload: payload,
    };
};
