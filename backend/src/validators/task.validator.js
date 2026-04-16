const { body, param, query } = require("express-validator");
const { paginationValidation } = require("./common.validator");

const taskIdValidation = [
  param("id").isMongoId().withMessage("Valid task ID is required"),
];

const taskQueryValidation = [
  ...paginationValidation,
  query("status")
    .optional()
    .isIn(["todo", "in-progress", "done"])
    .withMessage("Status must be todo, in-progress, or done"),
  query("search")
    .optional()
    .trim()
    .isLength({ max: 120 })
    .withMessage("Search query can be at most 120 characters"),
];

const createTaskValidation = [
  body("title")
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage("Title must be between 2 and 120 characters"),
  body("description")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description can be at most 1000 characters"),
  body("status")
    .optional()
    .isIn(["todo", "in-progress", "done"])
    .withMessage("Status must be todo, in-progress, or done"),
  body("dueDate").optional({ nullable: true }).isISO8601().withMessage("Due date must be valid"),
];

const updateTaskValidation = [
  body().custom((value) => {
    const allowed = ["title", "description", "status", "dueDate"];
    const keys = Object.keys(value || {});
    if (keys.length === 0) {
      throw new Error("At least one field is required for update");
    }

    const invalidKeys = keys.filter((key) => !allowed.includes(key));
    if (invalidKeys.length > 0) {
      throw new Error(`Invalid update fields: ${invalidKeys.join(", ")}`);
    }

    return true;
  }),
  body("title")
    .optional()
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage("Title must be between 2 and 120 characters"),
  body("description")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description can be at most 1000 characters"),
  body("status")
    .optional()
    .isIn(["todo", "in-progress", "done"])
    .withMessage("Status must be todo, in-progress, or done"),
  body("dueDate").optional({ nullable: true }).isISO8601().withMessage("Due date must be valid"),
];

module.exports = {
  taskIdValidation,
  taskQueryValidation,
  createTaskValidation,
  updateTaskValidation,
};
