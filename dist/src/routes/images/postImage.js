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
exports.postImage = void 0;
const multipart_1 = __importDefault(require("@fastify/multipart"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_util_1 = __importDefault(require("node:util"));
const node_stream_1 = require("node:stream");
const verifyjwt_1 = require("../../verifyjwt");
const pump = node_util_1.default.promisify(node_stream_1.pipeline);
const postImage = (server) => {
    server.register(multipart_1.default);
    server.post('/image', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { auth, message, decoded } = yield (0, verifyjwt_1.verifyJwt)(req.headers.authentication);
        if (!auth)
            return res.status(401).send(message);
        if ((decoded === null || decoded === void 0 ? void 0 : decoded.admin) === false)
            return res.status(401).send('Você não tem permissão para cadastrar um projeto');
        const data = yield req.file({ limits: {
                fileSize: 1000000 * 10,
                files: 2, // Max number of file fields
            } });
        //verificações do arquivo
        if (!data)
            return res.send('Selecione um arquivo de imagem!');
        const input = data.mimetype;
        const barra = input.indexOf('/');
        const dataType = input.slice(0, barra);
        if (dataType != 'image')
            return res.send('Selecione um arquivo de imagem!');
        if (data.file.truncated)
            res.send(new server.multipartErrors.FilesLimitError());
        //nome unico do arquivo baseado na data em milesegundos
        const name = `${Date.now()}-${data.filename}`;
        //salvando a imagem no servidor
        // image url
        const imagePath = `public/${name}`;
        yield pump(data.file, node_fs_1.default.createWriteStream(imagePath))
            .then(() => res.send({ path: imagePath }))
            .catch((err) => res.send(err));
    }));
};
exports.postImage = postImage;
