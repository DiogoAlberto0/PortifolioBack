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
exports.projectRoutes = void 0;
const prisma_1 = require("../../config/prisma");
const verifyjwt_1 = require("../../verifyjwt");
const projectRoutes = (server) => {
    server.get('/project', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const projects = yield prisma_1.db.project.findMany({
            select: {
                id: true,
                name: true,
                imageUrl: true
            }
        });
        res.send({
            projects
        });
    }));
    server.get('/project/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const projects = yield prisma_1.db.project.findUnique({
            where: {
                id: Number(id)
            }
        });
        res.send({
            projects
        });
    }));
    server.post('/project', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { auth, message, decoded } = yield (0, verifyjwt_1.verifyJwt)(req.headers.authentication);
        console.log(auth, message, decoded);
        if (!auth)
            return res.status(401).send(message);
        if ((decoded === null || decoded === void 0 ? void 0 : decoded.admin) === false)
            return res.status(401).send('Você não tem permissão para cadastrar um projeto');
        const { name, description, imageUrl, githubUrl, projectUrl } = req.body;
        if (!name || !description || !imageUrl || !githubUrl)
            return res.send('Informe todos os dados');
        yield prisma_1.db.project.create({
            data: {
                name,
                description,
                imageUrl,
                githubUrl,
                userId: decoded === null || decoded === void 0 ? void 0 : decoded.id,
                projectUrl
            }
        })
            .then(() => res.send('Projeto cadastrado com sucesso!'))
            .catch(err => res.code(400).send(`Erro: ${err}`));
    }));
    server.put('/project/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, verifyjwt_1.verifyJwt)(req.headers.authentication);
        const { id } = req.params;
        const { name, description, imageUrl, githubUrl, projectUrl } = req.body;
        yield prisma_1.db.project.update({
            where: {
                id: Number(id)
            },
            data: {
                name,
                description,
                imageUrl,
                githubUrl,
                projectUrl
            }
        })
            .then(() => res.send('Projeto atualizado com sucesso!'))
            .catch(err => res.code(400).send(`Erro: ${err}`));
    }));
};
exports.projectRoutes = projectRoutes;
