const express = require("express");
const route = express.Router();
const transaction = require("./transaction.controller");
const schema = require("./schemaRule");
const checkAuth = require("../../middleware/checkAuth");
const validateForm = require("../../middleware/validateSchema");

route.post(
  "/addMoneyToUserWallet",
  checkAuth("admin"),
  validateForm(schema.addMoneyToUserWallet),
  transaction.addMoneyToUserWallet
);

route.get(
  "/getBalanceByUserId/:userId",
  checkAuth(),
  validateForm(schema.getBalanceByUserId),
  transaction.getBalanceByUserId
);

route.get(
  "/getTransactionHistory",
  checkAuth(),
  validateForm(schema.getTransactionHistory),
  transaction.getTransactionHistory
);

route.get(
  "/getTransactionTopBarData",
  checkAuth(),
  // validateForm(schema.getTransactionTopBarData),
  transaction.getTransactionTopBarData
);

module.exports = route;
