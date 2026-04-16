const mongoSanitize = require("mongo-sanitize");

const sanitizeInput = (req, res, next) => {
  req.body = mongoSanitize(req.body);
  req.params = mongoSanitize(req.params);
  req.query = mongoSanitize(req.query);
  next();
};

module.exports = sanitizeInput;
