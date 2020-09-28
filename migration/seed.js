const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcrypt");
const {
  userModel,
  loginModel,
  organizationModel,
  sessionModel,
  planningModel,
} = require("../src/models");

const app = express();

app.listen(5000, () => console.log("API ready port: 5000..."));

(async () => {
  try {
    const UserNoTenant = userModel({ skipTenant: true });
    const Login = loginModel();
    const Organization = organizationModel();

    await mongoose.connect("mongodb://localhost:27017", {
      dbName: "trainFESDb",
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });

    await Login({
      rut: "7272601-4",
      password: bcrypt.hashSync("root", 10),
      role: "root",
      user: await UserNoTenant({
        rut: "7272601-4",
        name: "TrainFES",
        phone: "361515665",
        email: "trainfes@trainfes.com",
      }).save(),
    }).save();

    const { _id: organizationSeedId } = await Organization({
      name: "Organizacion seed",
      plan: "premium",
      address: "Metropolitana santiago de chile",
      phone: "+56955555555",
      rut: "12345678-k",
    }).save();

    const UserTenant = userModel({ organizationId: organizationSeedId });
    const Session = sessionModel({ organizationId: organizationSeedId });
    const Planning = planningModel({ organizationId: organizationSeedId });

    await Login({
      rut: "21389733-0",
      password: bcrypt.hashSync("admin", 10),
      role: "admin",
      user: await UserTenant({
        rut: "21389733-0",
        name: "admin organizacion seed",
        phone: "+56200000000",
        email: "admin@organizacion.com",
        organization: organizationSeedId,
      }).save(),
    }).save();

    const { _id: sessionId1 } = await Session({
      name: "sesión de entrenamiento 1",
      description: "descripción de sesión 1",
      objective: "objetivo de sesión 1",
      type: "flexion",
      parameters: {
        series: 10,
        repeat: 5,
      },
    }).save();
    const { _id: sessionId2 } = await Session({
      name: "sesión de entrenamiento 2",
      description: "descripción de sesión 2",
      objective: "objetivo de sesión 2",
      type: "sensor",
      parameters: {
        series: 10,
        repeat: 5,
        contraction_time: 25,
        rest_time: 30,
      },
    }).save();
    const { _id: sessionId3 } = await Session({
      name: "sesión de entrenamiento 3",
      description: "descripción de sesión 3",
      objective: "objetivo de sesión 3",
      type: "flexion",
      parameters: {
        series: 3,
        repeat: 8,
      },
    }).save();
    const { _id: sessionId4 } = await Session({
      name: "sesión de entrenamiento 4",
      description: "descripción de sesión 4",
      objective: "objetivo de sesión 4",
      type: "flexion",
      parameters: {
        series: 5,
        repeat: 9,
      },
    }).save();

    await Login({
      rut: "11677143-8",
      password: bcrypt.hashSync("user1", 10),
      role: "user",
      user: await UserTenant({
        rut: "11677143-8",
        name: "user 1",
        lastname: "seed",
        phone: "+56200000000",
        email: "user1@organizacion.com",
        country: "chile",
        city: "santiago",
        region: "centro",
        gender: "m",
        birthday: new Date("1960/03/16"),
        insurance: "banmedica",
        organization: organizationSeedId,
        plannings: [
          await Planning({
            name: "planificacion sesiones de entrenamento 1 y 2 user 1",
            links: ["https://www.google.com", "https://docs.mongodb.com/"],
            planningDate: new Date("2020/10/02"),
            sessions: [sessionId1, sessionId2],
          }).save(),
          await Planning({
            name: "planificacion sesiones de entrenamento 3 y 4 user 1",
            links: ["https://www.google.com", "https://docs.mongodb.com/"],
            planningDate: new Date("2020/10/03"),
            sessions: [sessionId3, sessionId4],
          }).save(),
        ],
      }).save(),
    }).save();

    await Login({
      rut: "5996755-k",
      password: bcrypt.hashSync("user2", 10),
      role: "user",
      user: await UserTenant({
        rut: "5996755-k",
        name: "user 2",
        lastname: "seed",
        phone: "+56200000001",
        email: "user2@organizacion.com",
        country: "chile",
        city: "santiago",
        region: "centro",
        gender: "m",
        birthday: new Date("1990/02/05"),
        insurance: "fonasa",
        organization: organizationSeedId,
        plannings: [
          await Planning({
            name: "planificacion sesiones de entrenamento 1  user 2",
            links: ["https://www.google.com", "https://docs.mongodb.com/"],
            planningDate: new Date("2020/10/02"),
            sessions: [sessionId1],
          }).save(),
          await Planning({
            name: "planificacion sesiones de entrenamento 2 user 2",
            links: ["https://www.google.com", "https://docs.mongodb.com/"],
            planningDate: new Date("2020/10/03"),
            sessions: [sessionId2],
          }).save(),
          await Planning({
            name: "planificacion sesiones de entrenamento 3 user 2",
            links: ["https://www.google.com", "https://docs.mongodb.com/"],
            planningDate: new Date("2020/10/03"),
            sessions: [sessionId3],
          }).save(),
          await Planning({
            name: "planificacion sesiones de entrenamento 2 3 y 4 user 2",
            links: ["https://www.google.com", "https://docs.mongodb.com/"],
            planningDate: new Date("2020/10/04"),
            sessions: [sessionId2, sessionId3, sessionId4],
          }).save(),
        ],
      }).save(),
    }).save();

    mongoose.disconnect().then(() => console.log("seed finish"));
  } catch (error) {
    console.error(error);
  }
})();
