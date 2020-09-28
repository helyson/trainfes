const mongoose = require("mongoose");
const express = require("express");
const { bindCurrentNamespace } = require("../lib/storage");
const errorMiddleware = require("./middleware/errors");
const {
    loginRouter,
    usersRouter,
    registersRouter,
    organizationsRouter,
    sessionsRouter,
    planingsRouter,
  } = require("./routers");

const app = express();
/* 
const UserModel = require("./models/user");
const LoginModel = require("./models/login");
const User = UserModel({ skipTenant: true });
const Login = LoginModel(); */
app.use(express.json());

app.use(bindCurrentNamespace);

app.use("/login", loginRouter);

app.use("/users", usersRouter);

app.use("/register", registersRouter);

app.use("/organization", organizationsRouter);

app.use("/session", sessionsRouter);

app.use("/planning", planingsRouter);

app.use(errorMiddleware);

app.listen(5000, () => console.log("API ready port: 5000..."));

(async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017", {
      dbName: "bdd2",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    /*   const login = await Login({
      rut: "27195157-4",
      password: "$2b$10$yAe7bmKwmLmPTMrsY7KTPu8xEfl7mZF36mekkV4cA7j/ZFzeljhzO",
      role: "root",
      user: await User({
        rut: "27195157-4",
        name: "helyson Perdomo",
        phone: "361515665",
      }).save(),
    }).save(); */

    console.log("running....");
  } catch (error) {
    console.error(error);
  }
})();
