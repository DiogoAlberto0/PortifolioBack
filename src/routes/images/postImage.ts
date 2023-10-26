import { FastifyInstance } from "fastify";
import multipart from '@fastify/multipart'

import fs from 'node:fs'
import util from 'node:util'
import { pipeline } from "node:stream";
import { verifyJwt } from "../../verifyjwt";

const pump = util.promisify(pipeline)


export const postImage = (server: FastifyInstance) => {

    
    server.register(multipart);
    
    server.post('/image', async ( req, res ) => {
        const { auth, message, decoded } = await verifyJwt(req.headers.authentication as string)
        
        if(!auth) return res.status(401).send(message)

        if(decoded?.admin === false) return res.status(401).send('Você não tem permissão para cadastrar um projeto')

        const data = await req.file({limits: {
            fileSize: 1000000 * 10,  // For multipart forms, the max file size in bytes
            files: 2,                // Max number of file fields
        }});
        
        //verificações do arquivo
        if(!data) return res.send('Selecione um arquivo de imagem!');
        
        const input = data.mimetype
        const barra = input.indexOf('/')
        const dataType = input.slice(0, barra)
        
        if(dataType != 'image') return res.send('Selecione um arquivo de imagem!')
        
        if(data.file.truncated) res.send(new server.multipartErrors.FilesLimitError());
        //nome unico do arquivo baseado na data em milesegundos
        const name = `${Date.now()}-${data.filename}`;
        
        //salvando a imagem no servidor

            // image url
            const imagePath = `tmp/${name}`
        await pump(data.file, fs.createWriteStream(imagePath))
        .then(() => res.send({path: imagePath}))
        .catch(( err ) => res.send( err ))
    });
}