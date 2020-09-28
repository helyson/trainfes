const loginRouter = require("./login");
const usersRouter = require("./users");
const registersRouter = require("./registers");
const organizationsRouter = require("./organizations");
const sessionsRouter = require("./sessions");
const planingsRouter = require("./plannings");

module.exports = {
    loginRouter,
    usersRouter,
    registersRouter,
    organizationsRouter,
    sessionsRouter,
    planingsRouter
}