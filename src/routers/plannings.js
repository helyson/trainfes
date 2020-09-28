const express = require("express");
const { routeHelper } = require("../helper/route");
const { jwtMiddleware } = require("../middleware");
const { getCurrent } = require("../../lib/storage");
const { AuthError, FindError } = require("../errors");
const { planningModel, userModel, sessionModel } = require("../models");

const router = express.Router();

router.get(
  "/",
  jwtMiddleware,
  routeHelper(async (req, res, next) => {
    const userId = getCurrent("userId");
    const Planning = planningModel();
    const Session = sessionModel();
    const { plannings } = await userModel()
      .findById(userId)
      .select("plannings")
      .populate({
        path: "plannings",
        model: "Planning",
        select: "-_id name links sessions planningDate",
        populate: {
          path: "sessions",
          model: "Session",
          select: "-_id name description objective mode parameters",
        },
      })
      .lean();
    res.json({
      plannings,
    });
  })
);
router.get(
  "/sessions",
  jwtMiddleware,
  routeHelper(async (req, res, next) => {
    const userId = getCurrent("userId");
    const { date } = req.query || {};
    const searchDate = new Date(date);
    const Planning = planningModel();
    const Session = sessionModel();
    const { plannings } = await userModel()
      .findById(userId)
      .select("plannings")
      .populate({
        path: "plannings",
        model: "Planning",
        select: "-_id name sessions planningDate",
        populate: {
          path: "sessions",
          model: "Session",
          select: "-_id name description objective mode parameters",
        },
      })
      .lean();
    const exercises = plannings
      .filter(({ planningDate }) => {
        const dateExercise = new Date(planningDate);
        return searchDate.getDate() === dateExercise.getDate();
      })
      .map(({ sessions, name: planificationName, planningDate: date }) => {
        return {
          planificationName,
          date,
          sessions: sessions,
        };
      });
    res.json({
      exercises,
    });
  })
);
router.post(
  "/",
  jwtMiddleware,
  routeHelper(async (req, res, next) => {
    const role = getCurrent("role");
    if (!role || role !== "admin") {
      throw new AuthError();
    }
    const { name, links, planningDate, sessions } = req.body;
    const Planning = planningModel();
    const { rut } = req.query || {};
    const userDb = await userModel()
      .findOneAndUpdate(
        { rut: rut },
        {
          $push: {
            plannings: await Planning({
              name,
              links,
              planningDate,
              sessions,
            }).save(),
          },
        },
        { new: true }
      )
      .select("-_id plannings sessions")
      .populate({
        path: "plannings",
        model: "Planning",
        select: "-_id name links sessions planningDate",
      })
      .lean();
    if (!userDb) {
      throw new FindError({ path: "rut", value: rut });
    }
    const plannig = userDb.plannings.slice(-1).pop();
    res.status(201).json({
      planning: userDb.plannings.slice(-1).pop(),
    });
  })
);

module.exports = router;
