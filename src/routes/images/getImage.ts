import { FastifyInstance } from "fastify";
import fastifyStatic from '@fastify/static';

import path from "path";

interface imageParams {
    fileName: string
}
export const getImage = (server: FastifyInstance) => {
    const __dirname = path.resolve(path.dirname(""));
    server.register(fastifyStatic, {
        root: path.join(__dirname, 'public'),
        prefix: '/public'
    })

    server.get('/image/:fileName', ( req , res ) => {

        const { fileName } = (req.params as imageParams)

        res.sendFile(fileName)
    })
}