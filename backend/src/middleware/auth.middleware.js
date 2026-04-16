const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { verifyToken } = require("../utils/jwt");

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Authorization token missing");
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  const user = await User.findById(decoded.id).lean();
  if (!user) {
    throw new ApiError(401, "Invalid token user");
  }

  req.user = user;
  next();
});

module.exports = protect;
