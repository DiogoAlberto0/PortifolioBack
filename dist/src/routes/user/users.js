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
Object.defineProperty(exports, "__esModule", { value: true });
exports.putUser = void 0;
const prisma_1 = require("../../config/prisma");
const verifyjwt_1 = require("../../verifyjwt");
const crypto_1 = require("../../crypto");
const putUser = (server) => {
    server.put('/user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { auth, message, decoded } = yield (0, verifyjwt_1.verifyJwt)(req.headers.authentication);
        if ((decoded === null || decoded === void 0 ? void 0 : decoded.admin) === false)
            return res.status(401).send('Você não tem permissão para cadastrar um projeto');
        if (!auth)
            return res.status(401).send(message);
        const { name, login, password, newPassword, gitHubPage, admin } = req.body;
        if (!login || !password)
            return res.code(400).send('informe login e senha');
        const userFromDb = yield prisma_1.db.user.findUnique({
            where: {
                login
            }
        });
        if (!userFromDb)
            return res.send('Usuário não encontrado');
        if ((0, crypto_1.compareHash)(password, userFromDb === null || userFromDb === void 0 ? void 0 : userFromDb.password)) {
            const hash = newPassword ? (0, crypto_1.generateHash)(newPassword) : userFromDb.password;
            yield prisma_1.db.user.update({
                where: {
                    login
                },
                data: {
                    name: name || userFromDb.name,
                    login: login || userFromDb.login,
                    password: hash,
                    gitHubPage: gitHubPage || userFromDb.gitHubPage,
                    admin: admin || userFromDb.admin
                }
            })
                .then(() => res.send('Usuário atualizado com sucesso!'))
                .catch(err => res.code(400).send(`Erro: ${err}`));
        }
        else {
            return res.code(500).send('Senha incorreta');
        }
    }));
};
exports.putUser = putUser;
