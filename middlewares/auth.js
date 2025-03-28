const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Authorization header is missing" });
  }
  const token = authorization.replace("Bearer ", "");
  if (!token) {
    return res.status(401).send({ message: "Token is missing" });
  }
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
    if (!payload) {
      return res.status(401).send({ message: "Invalid token payload" });
    }
    req.user = payload;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError" || "TokenExpiredError") {
      return res.status(401).json({
        message: "Invalid token or token has expired",
      });
    }
  }
};

module.exports = { auth };
