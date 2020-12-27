"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIMiddleware = void 0;
var APIActions = require("./action");
var constant_1 = require("./constant");
var helper_1 = require("./helper");
var APIMiddleware = /** @class */ (function () {
    function APIMiddleware(settings) {
        var _this = this;
        this.middleware = function () {
            return function (api) { return function (next) { return function (action) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (action.type !== constant_1.REST_API) {
                        return [2 /*return*/, next(action)];
                    }
                    if (action.mockBody)
                        return [2 /*return*/, this.mockRequest(action, api)];
                    return [2 /*return*/, this.request(action, api)];
                });
            }); }; }; };
        };
        this.refreshAction = settings === null || settings === void 0 ? void 0 : settings.refreshAction;
    }
    APIMiddleware.prototype.request = function (action, api) {
        return __awaiter(this, void 0, void 0, function () {
            var abortController, startActionParams, response, body, endActionParams, e_1, requestError, failActionParams;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        abortController = new AbortController();
                        startActionParams = { action: action, abortController: abortController };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        helper_1.emitStageFunction(startActionParams);
                        api.dispatch(APIActions.start(startActionParams));
                        return [4 /*yield*/, this.fetch(api, action, abortController)];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, helper_1.getResponseBody(action, response)];
                    case 3:
                        body = _a.sent();
                        endActionParams = __assign({ body: body, response: response }, startActionParams);
                        helper_1.emitStageFunction(endActionParams);
                        return [2 /*return*/, api.dispatch(APIActions.success(endActionParams))];
                    case 4:
                        e_1 = _a.sent();
                        requestError = e_1.toString();
                        failActionParams = __assign({ requestError: requestError }, startActionParams);
                        helper_1.emitStageFunction(failActionParams);
                        return [2 /*return*/, api.dispatch(APIActions.fail(failActionParams))];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    APIMiddleware.prototype.refreshToken = function (api, refreshAction) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0: return [4 /*yield*/, api.dispatch(refreshAction)];
                    case 1:
                        result = _j.sent();
                        // TODO it must be client function
                        if (((_b = (_a = result === null || result === void 0 ? void 0 : result.payload) === null || _a === void 0 ? void 0 : _a.body) === null || _b === void 0 ? void 0 : _b.token) && ((_d = (_c = result === null || result === void 0 ? void 0 : result.payload) === null || _c === void 0 ? void 0 : _c.body) === null || _d === void 0 ? void 0 : _d.refreshToken)) {
                            localStorage.setItem("token", (_f = (_e = result === null || result === void 0 ? void 0 : result.payload) === null || _e === void 0 ? void 0 : _e.body) === null || _f === void 0 ? void 0 : _f.token);
                            localStorage.setItem("refreshToken", (_h = (_g = result === null || result === void 0 ? void 0 : result.payload) === null || _g === void 0 ? void 0 : _g.body) === null || _h === void 0 ? void 0 : _h.refreshToken);
                            return [2 /*return*/, true];
                        }
                        // TODO client must do smth if failed
                        return [2 /*return*/, false];
                }
            });
        });
    };
    APIMiddleware.prototype.fetch = function (api, action, abortController) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var refreshAction, isRefresh, request, response, isSuccess;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        refreshAction = (_a = this.refreshAction) === null || _a === void 0 ? void 0 : _a.call(this);
                        isRefresh = action.url === refreshAction.url;
                        request = helper_1.buildRequest(action, api, abortController, isRefresh);
                        return [4 /*yield*/, fetch(request)];
                    case 1:
                        response = _b.sent();
                        if (!(response.status === 401 && !isRefresh)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.refreshToken(api, refreshAction)];
                    case 2:
                        isSuccess = _b.sent();
                        if (!isSuccess) return [3 /*break*/, 4];
                        return [4 /*yield*/, fetch(request)];
                    case 3:
                        response = _b.sent();
                        _b.label = 4;
                    case 4: return [2 /*return*/, response];
                }
            });
        });
    };
    APIMiddleware.prototype.mockRequest = function (action, api) {
        return __awaiter(this, void 0, void 0, function () {
            var abortController, startActionParams, response, endActionParams, e_2, requestError, FailActionParams;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        abortController = new helper_1.FakeAbortController();
                        startActionParams = { action: action, abortController: abortController };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        helper_1.emitStageFunction(startActionParams);
                        api.dispatch(APIActions.start(startActionParams));
                        // TODO ms must be set by user
                        console.warn("Fake request was send! Wait for " + 1000 + "ms to get fake data!");
                        return [4 /*yield*/, new Promise(function (resolve) {
                                setTimeout(function () { return resolve({ status: 200, ok: true, body: action.mockBody }); }, 1000);
                            })];
                    case 2:
                        response = _a.sent();
                        endActionParams = __assign({ body: action.mockBody, response: response }, startActionParams);
                        helper_1.emitStageFunction(endActionParams);
                        return [2 /*return*/, api.dispatch(APIActions.success(endActionParams))];
                    case 3:
                        e_2 = _a.sent();
                        requestError = e_2.toString();
                        FailActionParams = { abortController: abortController, action: action, requestError: requestError };
                        helper_1.emitStageFunction(FailActionParams);
                        return [2 /*return*/, api.dispatch(APIActions.fail(FailActionParams))];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return APIMiddleware;
}());
exports.APIMiddleware = APIMiddleware;
