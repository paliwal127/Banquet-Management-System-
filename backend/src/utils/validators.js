const { body, param, query } = require("express-validator");

const requiredString = (field, message) =>
  body(field)
    .trim()
    .notEmpty()
    .withMessage(message || `${field} is required`);

const optionalString = (field) =>
  body(field)
    .optional()
    .isString()
    .trim();

const numericField = (field, message) =>
  body(field)
    .optional()
    .isNumeric()
    .withMessage(message || `${field} must be a number`);

const emailField = (field) =>
  body(field)
    .optional()
    .isEmail()
    .withMessage(`${field} must be a valid email address`);

const idParam = (field = "id") =>
  param(field)
    .isInt({ gt: 0 })
    .withMessage(`${field} must be a valid numeric id`);

module.exports = {
  body,
  param,
  query,
  requiredString,
  optionalString,
  numericField,
  emailField,
  idParam
};
