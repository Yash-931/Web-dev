import jwt from 'jsonwebtoken'
import { configDotenv } from 'dotenv';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({
      message: "Missing appropriate auth header",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (decodedToken.userId) {
      req.userId = decodedToken.userId;
      next();
    } else {
      return res.status(403).json({
        message: "UserId not present in the token payload",
      });
    }
  } catch (err) {
    return res.status(403).json({
      message: "Malformed token cannot be decoded",
      err,
    });
  }
};

