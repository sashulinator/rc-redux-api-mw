"use strict";
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
exports.FakeAbortController = exports.buildRequest = exports.getResponseBody = exports.emitStageFunction = void 0;
function emitStageFunction(actionParams) {
    var _a;
    var action = actionParams.action, response = actionParams.response, requestError = actionParams.requestError;
    var stageFunctionName = requestError
        ? "onFail"
        : "onStart";
    if (requestError) {
        console.error("ReduxAPIMiddlewareRequestError: " + requestError);
    }
    if (response) {
        stageFunctionName = response.ok ? "onSuccess" : "onFail";
    }
    try {
        (_a = action[stageFunctionName]) === null || _a === void 0 ? void 0 : _a.call(action, actionParams);
    }
    catch (e) {
        console.error("ReduxAPIMiddleware" + stageFunctionName + "FunctionError: " + e);
    }
}
exports.emitStageFunction = emitStageFunction;
function getResponseBody(action, response) {
    return __awaiter(this, void 0, void 0, function () {
        var contentType;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    contentType = response.headers.get("Content-Type");
                    if (!(action.responseBodyType === "readableStream")) return [3 /*break*/, 1];
                    return [2 /*return*/, response.body];
                case 1:
                    if (!action.responseBodyType) return [3 /*break*/, 3];
                    return [4 /*yield*/, response[action.responseBodyType]()];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    if (!/json/.test(contentType)) return [3 /*break*/, 5];
                    return [4 /*yield*/, response.json()];
                case 4: return [2 /*return*/, _a.sent()];
                case 5:
                    if (!/text/.test(contentType)) return [3 /*break*/, 7];
                    return [4 /*yield*/, response.text()];
                case 6: return [2 /*return*/, _a.sent()];
                case 7:
                    if (!/form-data/.test(contentType)) return [3 /*break*/, 9];
                    return [4 /*yield*/, response.formData()];
                case 8: return [2 /*return*/, _a.sent()];
                case 9: return [2 /*return*/, response.body];
            }
        });
    });
}
exports.getResponseBody = getResponseBody;
function buildRequest(action, api, abortController, isRefresh) {
    var token = isRefresh
        ? localStorage.getItem("refreshToken")
        : localStorage.getItem("token");
    var body = typeof action.body !== "string" ? JSON.stringify(action.body) : action.body;
    var credentials = "same-origin";
    var _a = action.headers, headers = _a === void 0 ? {} : _a, _b = action.method, method = _b === void 0 ? "get" : _b, url = action.url;
    if (token) {
        headers.Authorization = "Bearer " + token;
    }
    var request = new Request(url, {
        signal: abortController.signal,
        method: method,
        credentials: credentials,
        headers: headers,
        body: body,
    });
    return request;
}
exports.buildRequest = buildRequest;
var FakeAbortController = /** @class */ (function () {
    function FakeAbortController() {
    }
    FakeAbortController.prototype.abort = function () {
        throw Error("Request aborted by user");
    };
    return FakeAbortController;
}());
exports.FakeAbortController = FakeAbortController;
