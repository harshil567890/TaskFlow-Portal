const Task = require("../models/task.model");
const ROLES = require("../constants/roles");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create({
    ...req.body,
    owner: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Task created",
    data: { task },
  });
});

const getTasks = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;
  const { status, search } = req.query;

  const filter = {};
  if (req.user.role !== ROLES.ADMIN) {
    filter.owner = req.user._id;
  }
  if (status) {
    filter.status = status;
  }
  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  const [tasks, total] = await Promise.all([
    Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Task.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    message: "Tasks fetched",
    data: {
      tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    },
  });
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (req.user.role !== ROLES.ADMIN && String(task.owner) !== String(req.user._id)) {
    throw new ApiError(403, "You can access only your own tasks");
  }

  res.status(200).json({
    success: true,
    message: "Task fetched",
    data: { task },
  });
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (req.user.role !== ROLES.ADMIN && String(task.owner) !== String(req.user._id)) {
    throw new ApiError(403, "You can update only your own tasks");
  }

  const allowedFields = ["title", "description", "status", "dueDate"];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      task[field] = req.body[field];
    }
  });

  await task.save();

  res.status(200).json({
    success: true,
    message: "Task updated",
    data: { task },
  });
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (req.user.role !== ROLES.ADMIN && String(task.owner) !== String(req.user._id)) {
    throw new ApiError(403, "You can delete only your own tasks");
  }

  await task.deleteOne();

  res.status(200).json({
    success: true,
    message: "Task deleted",
  });
});

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
