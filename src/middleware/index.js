const errorsMiddleware = require("./errors");
const isRootMiddleware = require("./isRoot");
const jwtMiddleware = require("./jwt");

module.exports = {
  errorsMiddleware,
  isRootMiddleware,
  jwtMiddleware,
};
