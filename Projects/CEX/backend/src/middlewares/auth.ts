import jwt from 'jsonwebtoken'
import 'dotenv/config'

async function authMiddleware(req, res, next) {
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

    req.username = decodedToken.username;
    next();
}

export default authMiddleware;