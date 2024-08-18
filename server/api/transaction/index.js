const express = require("express");
const route = express.Router();
const transaction = require("./transaction.controller");
const schema = require("./schemaRule");
const checkAuth = require("../../middleware/checkAuth");
const validateForm = require("../../middleware/validateSchema");

route.post(
  "/addMoneyToUserWallet",
  checkAuth(),
  validateForm(schema.addMoneyToUserWallet),
  transaction.addMoneyToUserWallet
);

module.exports = route;
