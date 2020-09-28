const storage = require("../../lib/storage");
const jwt = require("jsonwebtoken");
const { AuthError } = require("../errors");

module.exports = (req, res, next) => {
  try {
    const [, encrypt] = req.headers["authorization"].split(" ");
    const { role } = jwt.verify(encrypt, "secret");
    if (role === "root") next();
    else next(new AuthError());
  } catch (error) {
    next(new AuthError());
  }
};
