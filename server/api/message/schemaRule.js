const Joi = require("joi");

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

  updateProjectByUser: {
    body: {
      client: Joi.object({
        name: Joi.string().allow("", null).optional(),
        email: Joi.string().email().optional().allow("", null),
        phone: Joi.string()
          .pattern(/^[0-9]{10,15}$/)
          .optional()
          .allow("", null),
      }),
      projectName: Joi.string().optional().allow("", null),
      description: Joi.string().optional().allow("", null),
      projectId: Joi.string().required(),
    },
  },

  getProjectByProjectId: {
    params: {
      projectId: Joi.string().required(),
    },
  },

  getProjectByUserId: {
    query: {
      userId: Joi.string().required(),
      page: Joi.number().min(1).required(),
      limit: Joi.string().min(1).required(),
    },
  },

  updateProjectByAdmin: {
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
      status: Joi.string()
        .valid("pending", "running", "completed", "cancelled")
        .optional(),
      cancelReason: Joi.string().allow("", null).optional(),
      projectId: Joi.string().required(),
    },
  },
};
