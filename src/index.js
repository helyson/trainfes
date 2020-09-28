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

const app = express();

app.use(express.json());

app.use(bindCurrentNamespace);

app.use("/login", loginRouter);

app.use("/users", usersRouter);

app.use("/register", registersRouter);

app.use("/organization", organizationsRouter);

app.use("/session", sessionsRouter);

app.use("/planning", planingsRouter);

app.use(errorsMiddleware);

app.listen(5000, () => console.log("API ready port: 5000..."));

(async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017", {
      dbName: "trainFESDb",
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
  } catch (error) {
    console.error(error);
  }
})();
