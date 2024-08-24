const Joi = require("joi");

const id = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);
module.exports = {
  addMoneyToUserWallet: Joi.object({
    body: Joi.object({
      userId: id.required(),
      projectId: id.required(),
      amount: Joi.number().min(0).required(),
    }),
  }),
  getBalanceByUserId: Joi.object({
    params: Joi.object({
      userId: id.required(),
    }),
  }),
  getTransactionHistory: Joi.object({
    body: Joi.object({
      page: Joi.number().min(0).required(),
      limit: Joi.number().min(0).required(),
    }),
  }),
};
