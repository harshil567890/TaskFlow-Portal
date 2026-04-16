const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { generateToken } = require("../utils/jwt");

const buildAuthResponse = (user) => ({
  token: generateToken({ id: user._id, role: user.role }),
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
});

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "Email is already registered");
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    message: "Registration successful",
    data: buildAuthResponse(user),
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: buildAuthResponse(user),
  });
});

const me = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "User profile fetched",
    data: {
      user: req.user,
    },
  });
});

module.exports = {
  register,
  login,
  me,
};
