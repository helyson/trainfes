const express = require("express");
const { routeHelper } = require("../helper/route");
const { jwtMiddleware } = require("../middleware");
const { getCurrent } = require("../../lib/storage");
const { AuthError } = require("../errors");
const { sessionModel } = require("../models");

const router = express.Router();

router.post(
  "/",
  jwtMiddleware,
  routeHelper(async (req, res, next) => {
    const role = getCurrent("role");
    if (!role || role !== "admin") {
      throw new AuthError();
    }
    const { name, description, objective, type, parameters } = req.body;
    const Session = sessionModel();
    const sessionDb = await Session({
      name,
      description,
      objective,
      type,
      parameters,
    }).save();

    res.status(201).json({
      session: {
        id: sessionDb._id,
        name: sessionDb.name,
        description: sessionDb.description,
        objective: sessionDb.objective,
        type: sessionDb.type,
        parameters: sessionDb.parameters,
      },
    });
  })
);

module.exports = router;
