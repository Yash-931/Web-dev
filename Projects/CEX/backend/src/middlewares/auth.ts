import jwt from 'jsonwebtoken'
import 'dotenv/config'
import type { Request, Response, NextFunction } from 'express';

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.token;

    if(!token){
        res.json({
            message: "Please provide the auth token"            
        })
        return;
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if(!decodedToken){
        res.status(403).json({
            message: "Malformed token"
        })
        return;
    }

    req.userId = decodedToken.userId;
    next();
}

export default authMiddleware;