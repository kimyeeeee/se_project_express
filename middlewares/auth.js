const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { INVALID_STATUS_CODE } = require("../utils/errors");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(INVALID_STATUS_CODE)
      .send({ message: "Authorization header is missing" });
  }
  const token = authorization.replace("Bearer ", "");
  if (!token) {
    return res
      .status(INVALID_STATUS_CODE)
      .send({ message: "Token is missing" });
  }
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
    if (!payload) {
      return res
        .status(INVALID_STATUS_CODE)
        .send({ message: "Invalid token payload" });
    }
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(INVALID_STATUS_CODE).json({
      message: "Invalid token or token has expired",
    });
  }
};

module.exports = { auth };
