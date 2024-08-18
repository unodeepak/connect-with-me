const express = require("express");
const route = express.Router();
const user = require("./user.controller");
const schema = require("./schemaRule");
const checkAuth = require("../../middleware/checkAuth");
const validateForm = require("../../middleware/validateSchema");

route.post("/auth/login", validateForm(schema.login), user.login);
route.post("/auth/signup", validateForm(schema.signup), user.signup);
route.post("/auth/refreshToken", checkAuth(), user.refreshToken);

route.post("/auth/verifyOtp", validateForm(schema.verifyOtp), user.verifyOtp);
route.post(
  "/createPassword",
  checkAuth(),
  validateForm(schema.createPassword),
  user.createPassword
);
route.get("/getUserData", checkAuth(), user.getUserData);
route.get("/getUserById/:userId", checkAuth("admin"), user.getUserById);
route.put(
  "/updateRecord",
  checkAuth(),
  validateForm(schema.updateRecord),
  user.updateRecord
);

route.post("/sendOtp", validateForm(schema.sendOtp), user.sendOtp);
route.post(
  "/verifyOtpPassword",
  validateForm(schema.verifyOtpPassword),
  user.verifyOtpPassword
);
route.put(
  "/changePassword",
  checkAuth(),
  validateForm(schema.changePassword),
  user.changePassword
);
route.put(
  "/forgotPassword",
  checkAuth(),
  validateForm(schema.forgotPassword),
  user.forgotPassword
);

route.get("/getUserDashboard", checkAuth(), user.getUserDashboard);

module.exports = route;
