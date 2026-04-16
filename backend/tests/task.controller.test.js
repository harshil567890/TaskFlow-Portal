jest.mock("../src/models/task.model");

const Task = require("../src/models/task.model");
const {
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../src/controllers/task.controller");
const { createMockRes } = require("./helpers");

describe("task.controller", () => {
  it("creates a task", async () => {
    const req = {
      body: {
        title: "Create docs",
        description: "Write swagger docs",
      },
      user: {
        _id: "u1",
        role: "user",
      },
    };
    const res = createMockRes();
    const next = jest.fn();

    Task.create.mockResolvedValue({
      _id: "t1",
      title: "Create docs",
      description: "Write swagger docs",
      owner: "u1",
    });

    await createTask(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(Task.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Create docs",
        owner: "u1",
      })
    );
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("blocks user from accessing someone else's task", async () => {
    const req = {
      params: { id: "t2" },
      user: { _id: "u1", role: "user" },
    };
    const res = createMockRes();
    const next = jest.fn();

    Task.findById.mockResolvedValue({
      _id: "t2",
      owner: "u9",
    });

    await getTaskById(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0].statusCode).toBe(403);
  });

  it("updates own task", async () => {
    const taskDoc = {
      _id: "t1",
      title: "Old title",
      description: "",
      status: "todo",
      owner: "u1",
      save: jest.fn().mockResolvedValue(true),
    };

    const req = {
      params: { id: "t1" },
      body: { title: "New title", status: "in-progress" },
      user: { _id: "u1", role: "user" },
    };
    const res = createMockRes();
    const next = jest.fn();

    Task.findById.mockResolvedValue(taskDoc);

    await updateTask(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(taskDoc.title).toBe("New title");
    expect(taskDoc.status).toBe("in-progress");
    expect(taskDoc.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("deletes existing task", async () => {
    const taskDoc = {
      _id: "t1",
      owner: "u1",
      deleteOne: jest.fn().mockResolvedValue(true),
    };

    const req = {
      params: { id: "t1" },
      user: { _id: "u1", role: "user" },
    };
    const res = createMockRes();
    const next = jest.fn();

    Task.findById.mockResolvedValue(taskDoc);

    await deleteTask(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(taskDoc.deleteOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
