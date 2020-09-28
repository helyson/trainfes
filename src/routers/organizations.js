const express = require("express");
const { routeHelper } = require("../helper/route");
const { organizationModel } = require("../models");
const { isRootMiddleware } = require("../middleware");

const router = express.Router();

router.post(
  "/",
  isRootMiddleware,
  routeHelper(async (req, res, next) => {
    const { body } = req || {};
    const Organization = organizationModel();
    const { _id: id, name, plan, address, phone, rut } = await Organization({
      name: body.name,
      plan: body.plan,
      address: body.address,
      phone: body.phone,
      rut: body.rut,
    }).save();

    res.status(201).json({
      organization: {
        id,
        name,
        plan,
        address,
        phone,
        rut,
      },
    });
  })
);

router.get(
  "/",
  isRootMiddleware,
  routeHelper(async (req, res, next) => {
    const organizations = await organizationModel()
      .find({})
      .select("name plan address phone rut")
      .lean();
    res.json({
      organizations,
    });
  })
);

router.get(
  "/:id",
  isRootMiddleware,
  routeHelper(async (req, res, next) => {
    const { id } = req.params || {};
    const organization = await organizationModel()
      .findById(id)
      .select("name plan address phone rut")
      .lean();
    res.json({
      organization,
    });
  })
);

module.exports = router;
