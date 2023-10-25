"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const fastify_1 = __importDefault(require("fastify"));
const postImage_1 = require("./routes/images/postImage");
const getImage_1 = require("./routes/images/getImage");
const projectRoutes_1 = require("./routes/project/projectRoutes");
const login_1 = require("./routes/user/login");
const users_1 = require("./routes/user/users");
const cors_1 = __importDefault(require("@fastify/cors"));
exports.server = (0, fastify_1.default)();
exports.server.register(cors_1.default, {
    origin: '*'
});
const port = Number(process.env.PORT) || 3000;
exports.server.get('/', (req, res) => {
    res.send({ message: 'Hello World!' });
});
//routes
(0, projectRoutes_1.projectRoutes)(exports.server);
(0, postImage_1.postImage)(exports.server);
(0, getImage_1.getImage)(exports.server);
(0, login_1.userLogin)(exports.server);
(0, users_1.putUser)(exports.server);
exports.server.listen({
    port
})
    .then(() => console.log(`Server is listening on port ${port}`))
    .catch((err) => console.warn(err));
