const Joi = require("joi");
const { createValidator } = require("express-joi-validation");
const validator = createValidator({ passError: true });
const boom = require("@hapi/boom");

const validateSchema = (schema) => (req, res, next) => {
  const validators = [];

  if (schema.body) {
    validators.push(validator.body(Joi.object(schema.body)));
  }

  if (schema.query) {
    validators.push(validator.query(Joi.object(schema.query)));
  }

  if (schema.params) {
    validators.push(validator.params(Joi.object(schema.params)));
  }

  const runValidators = (ind) => {
    if (ind < validators.length) {
      validators[ind](req, res, (err) => {
        if (err) {
          return res.status(400).json({
            err: "Validation error",
            msg: err.error.message,
            details: err.error.details, // Detailed validation issues
          });
        }
        runValidators(ind + 1);
      });
    } else {
      next();
    }
  };

  runValidators(0);
};

module.exports = validateSchema;
