const express = require("express");
const route = express.Router();
const user = require("./api/user"); // service

route.use("/user", require("./api/user"));
route.use("/proposal", require("./api/proposal"));
route.use("/payment", require("./api/transaction"));

module.exports = route;
