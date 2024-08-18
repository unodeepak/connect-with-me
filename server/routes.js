const express = require("express");
const route = express.Router();
const user = require("./api/user");

route.use("/user", user);
route.use("/proposal", require("./api/proposal"));

module.exports = route;
