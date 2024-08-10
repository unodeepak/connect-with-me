const Joi = require("joi");

const validateSchema = (req, schemas) => {
  const targetKeys = ["body", "params", "query"];
  let errors = [];

  targetKeys.forEach((target) => {
    if (schemas[target]) {
      const { error, value } = schemas[target].validate(req[target], {
        abortEarly: false,
      });
      if (error) {
        errors = errors.concat(error.details.map((detail) => detail.message));
      } else {
        req[target] = value; // Update the request object with validated data
      }
    }
  });

  if (errors.length > 0) {
    return { isValid: false, errorMessage: errors.join(", ") };
  }

  return { isValid: true };
};

module.exports = validateSchema;
