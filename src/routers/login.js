const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");
const { routeHelper } = require("../helper/route");
const { loginModel, userModel } = require("../models");
const { SessionError } = require("../errors");

const router = express.Router();

router.post(
  "/",
  routeHelper(async (req, res, next) => {
    const { body } = req || {};
    const User = userModel({ skipTenant: true });

    const LoginDb = await loginModel()
      .findOne({
        rut: body.username,
      })
      .select("role user password")
      .populate("user", "_id name email phone rut organization")
      .lean();

    if (!LoginDb || !bcrypt.compareSync(body.password, LoginDb.password)) {
      throw new SessionError();
    }
    const { user, role } = LoginDb;
    const organizationId =
      user && user.organization ? user.organization._id : undefined;
    const token = jwt.sign(
      {
        userId: user._id,
        organizationId,
        role,
      },
      "secret"
    );
    res.json({
      user,
      token,
    });
  })
);

module.exports = router;
