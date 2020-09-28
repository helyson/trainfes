const { ValidationError } = require("../errors");

function routeHelper(callback) {
  return async (req, res, next) => {
    try {
      await callback(req, res);
    } catch (error) {
      if (error.errors || error.name === "MongoError")
        next(new ValidationError(error));
      next(error);
    }
  };
}

module.exports = {
  routeHelper,
};
