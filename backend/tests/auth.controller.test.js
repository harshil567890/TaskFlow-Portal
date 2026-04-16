jest.mock("../src/models/user.model");
jest.mock("../src/utils/jwt", () => ({
  generateToken: jest.fn(() => "mock-token"),
}));

const User = require("../src/models/user.model");
const { register, login } = require("../src/controllers/auth.controller");
const { createMockRes } = require("./helpers");

describe("auth.controller", () => {
  it("registers a user", async () => {
    const req = {
      body: {
        name: "Alice",
        email: "alice@example.com",
        password: "SecurePass123",
      },
    };
    const res = createMockRes();
    const next = jest.fn();

    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      _id: "u1",
      name: "Alice",
      email: "alice@example.com",
      role: "user",
    });

    await register(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: "Registration successful",
      })
    );
  });

  it("returns conflict when email exists", async () => {
    const req = {
      body: {
        name: "Alice",
        email: "alice@example.com",
        password: "SecurePass123",
      },
    };
    const res = createMockRes();
    const next = jest.fn();

    User.findOne.mockResolvedValue({ _id: "existing-user" });

    await register(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0].statusCode).toBe(409);
  });

  it("logs in with valid credentials", async () => {
    const req = {
      body: {
        email: "alice@example.com",
        password: "SecurePass123",
      },
    };
    const res = createMockRes();
    const next = jest.fn();

    const userDoc = {
      _id: "u1",
      name: "Alice",
      email: "alice@example.com",
      role: "user",
      comparePassword: jest.fn().mockResolvedValue(true),
    };

    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(userDoc),
    });

    await login(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: "Login successful",
      })
    );
  });

  it("rejects invalid credentials", async () => {
    const req = {
      body: {
        email: "alice@example.com",
        password: "wrong-password",
      },
    };
    const res = createMockRes();
    const next = jest.fn();

    const userDoc = {
      _id: "u1",
      name: "Alice",
      email: "alice@example.com",
      role: "user",
      comparePassword: jest.fn().mockResolvedValue(false),
    };

    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(userDoc),
    });

    await login(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0].statusCode).toBe(401);
  });
});
