const Joi = require("joi");

const validateSchema = (schemas) => {
  return (req, res, next) => {
    let schema = {};
    if (req?.body && Object.keys(req.body).length && req?.method != "GET") {
      schema.body = req.body;
    }
    if (req.query && Object.keys(req.query).length) {
      schema.query = req.query;
      console.log(req.query, req.method);
    }
    if (req.params && Object.keys(req.params).length) {
      schema.params = req.params;
    }
    const { error } = schemas.validate(schema);

    if (error) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        details: error?.details?.[0]?.message,
      });
    }

    next();
  };
};

module.exports = validateSchema;
