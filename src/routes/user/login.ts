import { FastifyInstance } from "fastify";
import { db } from "../../config/prisma";

import jwt from 'jsonwebtoken'
import { compareHash } from '../../crypto';


interface userLoginBody {
    login: string;
    password: string;
}

export const userLogin = (server: FastifyInstance) => {
    
    server.post('/singin', async ( req, res ) => {

        const { login, password } = req.body as userLoginBody

        if(!login || !password) return res.send('Preencha todos os campos!')

        const userFromDb = await db.user.findUnique({
            where: {
                login
            }
        })
        
        if(!userFromDb) return res.code(500).send('Login inválido')
        
        if(compareHash(password, userFromDb?.password as string)) {
            const token = jwt.sign({ userFromDb }, process.env.SECRET_KEY as string, {
                expiresIn: 60 * 60 // 1h
            })

            res.send({ authenticated: true, token})
        }

        return res.code(500).send('Login inválido')

    })
}