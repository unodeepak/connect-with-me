const Joi = require("joi");
module.exports = {
  login: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  },
  signup: {
    body: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().lowercase().required(),
    },
  },
  updateRecord: {
    body: {
      firstName: Joi.string().optional(),
      lastName: Joi.string().optional(),
      email: Joi.string().email().lowercase().optional(),
      phoneNumber: Joi.string()
        .pattern(/^[0-9]{10,15}$/)
        .optional(),
      linkedinUri: Joi.string().uri().allow(null, "").optional(),
      fiverrUri: Joi.string().uri().allow(null, "").optional(),
      upworkUri: Joi.string().uri().allow(null, "").optional(),
      instaUri: Joi.string().uri().allow(null, "").optional(),
      twitter: Joi.string().uri().allow(null, "").optional(),
      gender: Joi.string()
        .valid("male", "female", "other")
        .allow(null, "")
        .optional(),
      dob: Joi.date().allow(null, "").optional(),
      address: Joi.string().allow(null, "").optional(),
      pincode: Joi.string()
        .pattern(/^[0-9]{5,10}$/)
        .allow(null, "")
        .optional(),
      city: Joi.string().allow(null, "").optional(),
      state: Joi.string().allow(null, "").optional(),
      district: Joi.string().allow(null, "").optional(),
      country: Joi.string().allow(null, "").optional(),
      profilePictureUrl: Joi.string().uri().allow(null, "").optional(),
    },
  },
};
