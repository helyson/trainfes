const express = require("express");
const bcrypt = require("bcrypt");
const { userModel, loginModel } = require("../models");
const { routeHelper } = require("../helper/route");
const { isRootMiddleware, jwtMiddleware } = require("../middleware");
const { setCurrent, getCurrent } = require("../../lib/storage");
const {AuthError} = require("../errors");

const router = express.Router();

const requestRegister = async (res, role, body, organization) => {
  const User = userModel();
  const Login = loginModel();
  const {
    name,
    lastname,
    email,
    password,
    rut,
    phone,
    birthday,
    insurance,
    gender,
    city,
    region,
  } = body;
  const { user } = await Login({
    rut,
    password: bcrypt.hashSync(password, 10),
    role,
    user: await User({
      name,
      lastname,
      email,
      organization,
      rut,
      phone,
      birthday,
      insurance,
      gender,
      city,
      region,
    }).save(),
  }).save();

  res.status(201).json({
    user: {
      name: `${user.name} ${user.lastname || ""}`,
      email: user.email,
      organization: user.organization._id,
      rut: user.rut,
      phone: user.phone,
      birthday: user.birthday,
      insurance: user.insurance,
      gender: user.gender,
      city: user.city,
      region: user.region,
    },
  });
};

router.post(
  "/user",
  jwtMiddleware,
  routeHelper(async (req, res, next) => {
    const organizationId = getCurrent("tenantId");
    const role = getCurrent("role");
    if (!role || role !== "admin") {
      throw new AuthError();
    }
    await requestRegister(res, "user", req.body, organizationId);
  })
);

router.post(
  "/admin/:id",
  isRootMiddleware,
  routeHelper(async (req, res, next) => {
    const { id } = req.params || {};
    setCurrent("tenantId", id);
    await requestRegister(res, "admin", req.body, id);
  })
);

router.post(
  "/root",
  isRootMiddleware,
  routeHelper(async (req, res, next) => {
    const User = userModel({ skipTenant: true });
    const Login = loginModel();
    const { name, email, password, rut, phone } = req.body;
    const { user } = await Login({
      rut,
      password: bcrypt.hashSync(password, 10),
      role: "root",
      user: await User({
        name,
        email,
        rut,
        phone,
      }).save(),
    }).save();

    res.status(201).json({
      user: {
        name: user.name,
        email: user.email,
        rut: user.rut,
        phone: user.phone,
      },
    });
  })
);

module.exports = router;
