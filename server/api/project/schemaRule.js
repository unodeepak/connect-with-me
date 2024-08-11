module.exports = {
  createProject: {
    body: {
      client: Joi.object({
        name: Joi.string().allow("", null).optional(),
        email: Joi.string().email().required(),
        phone: Joi.string()
          .pattern(/^[0-9]{10,15}$/)
          .allow("", null)
          .required(),
      }).required(),
      projectName: Joi.string().required(),
      description: Joi.string().required(),
    },
  },

  updateProject: {
    body: {
      client: Joi.object({
        name: Joi.string().allow("", null).optional(),
        email: Joi.string().email().allow("", null).optional(),
        phone: Joi.string()
          .pattern(/^[0-9]{10,15}$/)
          .allow("", null)
          .optional(),
      }).optional(),
      projectName: Joi.string().allow("", null).optional(),
      description: Joi.string().allow("", null).optional(),
      status: Joi.string().valid("pending", "approved", "cancelled").optional(),
      cancelReason: Joi.string().allow("", null).optional(),
    },
  },
};
