const express = require("express");
const route = express.Router();
const user = require("./user.controller");

route.post("/auth/login", user.login);
route.post("/auth/signup", user.signup);

route.post("/verifyOtp", user.verifyOtp);
route.post("/createPassword", user.createPassword);
route.get("/getUserData", user.getUserData);
route.get("/getUserById/:userId", user.getUserById);
route.put("/updateRecord", user.updateRecord);

module.exports = route;
