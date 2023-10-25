"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImage = void 0;
const static_1 = __importDefault(require("@fastify/static"));
const path_1 = __importDefault(require("path"));
const getImage = (server) => {
    const __dirname = path_1.default.resolve(path_1.default.dirname(""));
    server.register(static_1.default, {
        root: path_1.default.join(__dirname, 'public'),
        prefix: '/public'
    });
    server.get('/image/:fileName', (req, res) => {
        const { fileName } = req.params;
        res.sendFile(fileName);
    });
};
exports.getImage = getImage;
