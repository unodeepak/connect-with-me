const Joi = require("joi");
const page = {
  page: Joi.number().min(0).required(),
  limit: Joi.number().min(1).required(),
};
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

  verifyOtp: {
    body: {
      email: Joi.string().email().required(),
      otp: Joi.string().length(6).required(),
    },
  },

  sendOtp: {
    body: {
      email: Joi.string().email().optional().allow("", null),
      phoneNumber: Joi.string().length(10).optional().allow("", null),
    },
  },

  verifyOtpPassword: {
    body: {
      email: Joi.string().email().optional().allow("", null),
      phoneNumber: Joi.string().length(10).optional().allow("", null),
      otp: Joi.string().required(),
    },
  },

  changePassword: {
    body: {
      oldPassword: Joi.string().required(),
      newPassword: Joi.string().length(10).required(),
    },
  },

  forgotPassword: {
    body: {
      password: Joi.string().length(10).required(),
    },
  },

  createPassword: {
    body: {
      password: Joi.string().min(8).required(),
    },
  },

  updateRecord: {
    body: {
      firstName: Joi.string().optional(),
      lastName: Joi.string().optional(),
      email: Joi.string().email().lowercase().optional(),
      phoneNumber: Joi.string()
        .regex(/^[0-9]{10,15}$/)
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
        .regex(/^[0-9]{5,10}$/)
        .allow(null, "")
        .optional(),
      city: Joi.string().allow(null, "").optional(),
      state: Joi.string().allow(null, "").optional(),
      district: Joi.string().allow(null, "").optional(),
      country: Joi.string().allow(null, "").optional(),
      profilePictureUrl: Joi.string().uri().allow(null, "").optional(),

      bankDetails: Joi.object({
        accountHolderName: Joi.string()
          .trim()
          .max(100)
          .optional()
          .allow("", null),
        accountNumber: Joi.string()
          .trim()
          .min(10)
          .max(20)
          .optional()
          .allow("", null),
        bankName: Joi.string().trim().max(100).optional().allow("", null),
        branchName: Joi.string().trim().max(100).optional().allow("", null),
        ifscCode: Joi.string()
          .trim()
          .uppercase()
          .length(11)
          .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/)
          .message("{{#label}} is not a valid IFSC code!")
          .optional()
          .allow("", null),

        accountType: Joi.string()
          .valid("Savings", "Current", "Salary", "Fixed Deposit")
          .default("Savings")
          .optional()
          .allow("", null),
      }),
    },
  },
  getAllUsers: {
    query: {
      isActive: Joi.boolean().allow("", null).optional(),
      unVerifiedUser: Joi.boolean().allow("", null).optional(),
      page: Joi.number().min(0).required(),
      limit: Joi.number().min(1).required(),
    },
  },
};
