import jwt from 'jsonwebtoken'

interface decodedData {
    id: number;
    login: string;
    password: string;
    admin: boolean;
}

type verifyFunction = Promise<{
    auth: boolean;
    message: string;
    decoded: decodedData | null;
}>

export const verifyJwt = async (token: string): verifyFunction => {

    

    if (!token) return({ auth: false, message: 'No token provided.', decoded: null });

    const resp:any =  await jwt.verify(token, process.env.SECRET_KEY as string, async function (err, decoded: any) {

        if (err) return({ auth: false, message: 'Failed to authenticate token.', decoded: null});

        return ({ auth: true, message: 'Authenticated with success', decoded: decoded as decodedData})
    
    })

    return resp
}