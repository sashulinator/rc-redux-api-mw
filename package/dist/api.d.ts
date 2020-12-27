import { Middleware, Dispatch } from "redux";
import { APIAction, Settings } from "./type";
export declare class APIMiddleware {
    refreshAction?: Settings["refreshAction"];
    constructor(settings?: Settings);
    middleware: () => Middleware<Dispatch<APIAction>>;
    private request;
    private refreshToken;
    private fetch;
    private mockRequest;
}
