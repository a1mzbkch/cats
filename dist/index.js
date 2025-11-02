"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const server = (0, app_1.default)();
const startServer = () => {
    try {
        const PORT = process.env.PORT || 3000;
        server.listen({
            port: PORT,
            host: "0.0.0.0",
        }, () => {
            console.log(`${new Date()}`);
            console.log(`Сервер запушен в: http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.log(`Серверная ошибка: ${error}`);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map