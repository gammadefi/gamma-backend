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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const config_1 = require("./config");
const express_1 = __importDefault(require("express"));
const app_1 = __importDefault(require("./app"));
const http_1 = __importDefault(require("http"));
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    yield (0, utils_1.connectToDB)(config_1.DB);
    yield (0, app_1.default)(app);
    const server = http_1.default.createServer(app);
    server
        .listen(config_1.PORT, () => console.log(`Starting Gamma Backend on port ${config_1.PORT}...`))
        .on("listening", () => console.log(`Gamma Backend Running.`))
        .on("error", (err) => {
        console.log(`An error occured on Gamma Backend, ${err}\nShutting down app..`);
        process.exit();
    });
});
startServer();
//# sourceMappingURL=server.js.map