const mongoose = require("mongoose");
const express = require("express");
const { bindCurrentNamespace } = require("../lib/storage");
const { errorsMiddleware } = require("./middleware");
const {
  loginRouter,
  usersRouter,
  registersRouter,
  organizationsRouter,
  sessionsRouter,
  planingsRouter,
} = require("./routers");

const baseUrl = "/api/v1/trainfes"
const app = express();

app.use(express.json());

app.use(bindCurrentNamespace);

app.use(`${baseUrl}/login`, loginRouter);

app.use(`${baseUrl}/users`, usersRouter);

app.use(`${baseUrl}/register`, registersRouter);

app.use(`${baseUrl}/organization`, organizationsRouter);

app.use(`${baseUrl}/session`, sessionsRouter);

app.use(`${baseUrl}/planning`, planingsRouter);

app.use(errorsMiddleware);

app.listen(5000, () => console.log("API ready port: 5000..."));

(async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017", {
      dbName: "trainFESDb",
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
  } catch (error) {
    console.error(error);
  }
})();
