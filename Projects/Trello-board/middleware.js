const jwt = require("jsonwebtoken")

function authMiddleware(req, res, next){
    const token = req.headers.token;
    const decoded = jwt.verify(token, "yash123");

    const userId = decoded.userId;

    if(userId){
        req.userId = userId;
        next();
    } else{
        return res.status(403).json({
            message: "Malformed token"
        })
    }
}

module.exports = {
    authMiddleware: authMiddleware
}