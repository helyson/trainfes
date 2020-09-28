const express = require("express");
const { routeHelper } = require("../helper/route");
const { jwtMiddleware } = require("../middleware");
const { getCurrent } = require("../../lib/storage");
const { AuthError } = require("../errors");
const { userModel } = require("../models");

const router = express.Router();

router.get(
  "/:rut",
  jwtMiddleware,
  routeHelper(async (req, res, next) => {
    const organizationId = getCurrent("tenantId");
    const role = getCurrent("role");
    if (!role || role !== "admin") {
      throw new AuthError();
    }
    const { rut: rutParam } = req.params || {};
    const user =
      (await userModel()
        .findOne({ rut: rutParam })
        .select(
          "name lastname email password rut phone birthday insurance  gender city region"
        )
        .lean()) || {};
    res.json({
      user,
    });
  })
);

module.exports = router;
