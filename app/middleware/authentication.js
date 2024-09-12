const jwt = require("../utils/jwt")

const authentication = async (req, res, next) => {
  try {
    const [type, token] = req.header("Authorization")?.split(' ') ?? [];

    if (type !== "Bearer" || !token) {
        return res.status(401).json({
            statusCode: 401,
            success: false,
            message: 'Unauthorized',
          });
    }

    const payload = jwt.verifyToken(token)

    req.user = payload
    next();
  } catch (error) {
    res.status(401).json({
        statusCode: 401,
        success: false,
        message: 'Unauthorized',
      });
  }
};

module.exports = authentication;