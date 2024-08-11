const express = require("express");
const route = express.Router();
const user = require("./user.controller");
const validateForm = require("express-joi-validator");
const schema = require("./schemaRule");
const checkAuth = require("../../middleware/checkAuth");

route.post("/auth/login", user.login);
route.post("/auth/signup", validateForm(schema.signup), user.signup);

route.post("/verifyOtp", user.verifyOtp);
route.post("/createPassword", user.createPassword);
route.get("/getUserData", user.getUserData);
route.get("/getUserById/:userId", user.getUserById);
route.put("/updateRecord", user.updateRecord);

module.exports = route;
