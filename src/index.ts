import fastify from 'fastify';

import { postImage } from './routes/images/postImage';
import { getImage } from './routes/images/getImage';
import { projectRoutes } from './routes/project/projectRoutes';
import { userLogin } from './routes/user/login';
import { putUser } from './routes/user/users';

import cors from '@fastify/cors';

export const server = fastify();
server.register(cors, {
    origin: '*'
})

const port = Number(process.env.PORT) || 3000;

server.get('/', (req, res) => {
     
    res.send({ message: 'Hello World!' })
    
});

//routes
projectRoutes(server);
postImage(server);
getImage(server);

userLogin(server)
putUser(server)

server.listen({
    port
})
    .then(() => console.log(`Server is listening on port ${port}`))
    .catch((err) => console.warn(err));

