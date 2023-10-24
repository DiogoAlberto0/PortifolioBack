import { FastifyInstance } from "fastify";

import { db } from "../../config/prisma";

import { verifyJwt } from "../../verifyjwt";
import { compareHash, generateHash } from "../../crypto";

interface postUserBody {
    name?: string;
    login: string;
    password?: string;
    newPassword?: string;
    gitHubPage?: string;
    admin?: boolean;
}

export const putUser = (server: FastifyInstance) => {

    server.put('/user', async (req, res) => {

        const { auth, message, decoded } = await verifyJwt(req.headers.authentication as string)

        if(decoded?.admin === false) return res.status(401).send('Você não tem permissão para cadastrar um projeto')


        if(!auth) return res.status(401).send(message)

        const { name, login, password, newPassword, gitHubPage, admin } = req.body as postUserBody;

        if(!login || !password) return res.code(400).send('informe login e senha')

        const userFromDb = await db.user.findUnique({
            where: {
                login
            }
        })

        if(!userFromDb) return res.send('Usuário não encontrado')

        if(compareHash(password, userFromDb?.password as string)) {

            const hash = newPassword ? generateHash(newPassword) : userFromDb.password
            await db.user.update({
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
            .catch(err => res.code(400).send(`Erro: ${err}`))
        } else {
            return res.code(500).send('Senha incorreta')
        }

    })
}