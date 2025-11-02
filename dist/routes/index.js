"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("../modules/auth/auth.routes"));
const globalRouter = (0, express_1.Router)();
const corsConfig = {
    origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
    ],
};
globalRouter.use("/auth", (0, cors_1.default)(corsConfig), auth_routes_1.default);
exports.default = globalRouter;
//# sourceMappingURL=index.js.map