const Joi = require("joi");

const id = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);
module.exports = {
  addMoneyToUserWallet: Joi.object({
    body: Joi.object({
      userId: id.required(),
      amount: Joi.number().min(0).required(),
    }),
  }),
};
