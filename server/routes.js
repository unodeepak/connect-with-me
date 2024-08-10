const express = require("express");
const route = express.Router();
const user = require("./api/user");

route.post("/user", user);

module.exports = route;
