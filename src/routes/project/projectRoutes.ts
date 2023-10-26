import { FastifyInstance } from "fastify";
import { db } from "../../config/prisma";
import { verifyJwt } from "../../verifyjwt";

import { del } from "@vercel/blob";

interface postProjectBody {
    name: string;
    description: string;
    githubUrl: string;
    imageUrl: string;
    projectUrl?: string;
}

interface putProjectParams {
    id: number;
}

interface decodedData {
    id: number;
    login: string;
    password: string;
    admin: boolean;
}


export const projectRoutes = (server: FastifyInstance) => {


    server.get('/project', async ( req, res ) => {
        const projects = await db.project.findMany({
            select: {
                id: true,
                name: true,
                imageUrl: true
            }
        });

        res.send({
            projects
        })
    })

    server.get('/project/:id', async ( req, res ) => {

        const { id } = req.params as putProjectParams

        const projects = await db.project.findUnique({
            where: {
                id: Number(id)
            }
        });

        res.send({
            projects
        })
    })

    server.post('/project', async (req, res) => {
        const { auth, message, decoded } = await verifyJwt(req.headers.authentication as string)
        
        console.log(auth, message, decoded)

        if(!auth) return res.status(401).send(message)

        if(decoded?.admin === false) return res.status(401).send('Você não tem permissão para cadastrar um projeto')

        const { name, description, imageUrl, githubUrl, projectUrl } = req.body as postProjectBody;

        if(!name || !description || !imageUrl || !githubUrl) return res.send('Informe todos os dados')

        await db.project.create({
            data: {
                name,
                description,
                imageUrl,
                githubUrl,
                userId: decoded?.id,
                projectUrl
            }
        })
        .then(() => res.send('Projeto cadastrado com sucesso!'))
        .catch(err => res.code(400).send(`Erro: ${err}`))
    });

    server.put('/project/:id', async (req, res) => {
        const { auth, decoded, message } = await verifyJwt(req.headers.authentication as string)

        if(!auth) return res.status(401).send(message)

        if(decoded?.admin === false) return res.status(401).send('Você não tem permissão para cadastrar um projeto')

        const { id } = req.params as putProjectParams
        
        const { name, description, imageUrl, githubUrl, projectUrl,  } = req.body as postProjectBody;

        const project = await db.project.findUnique({
            where: {
                id: Number(id)
            },
            select: {
                imageUrl: true
            }
        })

        console.log(project)
        
        del(project?.imageUrl as string).then((resp) => console.log(resp)).catch((err) => console.log(err))

        await db.project.update({
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
        .catch(err => res.code(400).send(`Erro: ${err}`))
    })

    server.delete('/project/:id', async (req, res) => {
        const { auth, decoded, message } = await verifyJwt(req.headers.authentication as string)

        if(!auth) return res.status(401).send(message)

        if(decoded?.admin === false) return res.status(401).send('Você não tem permissão para cadastrar um projeto')

        const { id } = req.params as putProjectParams

        const project = await db.project.delete({
            where: {
                id: Number(id)
            }
        })

        console.log(project)

        del(project?.imageUrl as string).then((resp) => console.log(resp)).catch((err) => console.log(err))


    })

}