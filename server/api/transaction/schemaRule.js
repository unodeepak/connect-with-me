const Joi = require("joi");

const id = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);
module.exports = {
  addMoneyToUserWallet: {
    body: {
      userId: id.required(),
      projectId: id.required(),
      amount: Joi.number().min(0).required(),
    },
  },

  getBalanceByUserId: {
    params: {
      userId: id.required(),
    },
  },

  getTransactionHistory: {
    query: {
      page: Joi.number().min(0).required(),
      limit: Joi.number().min(0).required(),
      status: Joi.string()
        .valid("all", "pending", "failed", "success")
        .required(),
    },
  },
};
