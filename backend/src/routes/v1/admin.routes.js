const express = require("express");
const { listUsers } = require("../../controllers/admin.controller");
const protect = require("../../middleware/auth.middleware");
const authorize = require("../../middleware/role.middleware");
const ROLES = require("../../constants/roles");
const validateRequest = require("../../middleware/validate.middleware");
const { paginationValidation } = require("../../validators/common.validator");

const router = express.Router();

router.use(protect);
router.use(authorize(ROLES.ADMIN));

/**
 * @swagger
 * /api/v1/admin/users:
 *   get:
 *     summary: List users (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users fetched
 *       403:
 *         description: Forbidden
 */
router.get("/users", paginationValidation, validateRequest, listUsers);

module.exports = router;
