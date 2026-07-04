const jwt = require('jsonwebtoken')

function authMiddleware(req, res, next) {
    const token = req.headers.token;
    const decoded = jwt.verify(token, "yash123");

    if(decoded.userId){
        req.userId = decoded.userId;
        next();
    } else{
        res.status(403).json({
            messgae: "Invalid token"
        });
    }
}

module.exports = {
    authMiddleware: authMiddleware
}