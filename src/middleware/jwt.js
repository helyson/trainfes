const { setCurrent } = require("../../lib/storage");
const jwt = require("jsonwebtoken");
const { AuthError } = require("../errors");

module.exports = (req, res, next) => {
  try {
    const [, encrypt] = req.headers["authorization"].split(" ");
    const { organizationId = null, role, userId } = jwt.verify(
      encrypt,
      "secret"
    );
    setCurrent("tenantId", organizationId);
    setCurrent("role", role);
    setCurrent("userId", userId);
    next();
  } catch (error) {
    next(new AuthError());
  }
};
