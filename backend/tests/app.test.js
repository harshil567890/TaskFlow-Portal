const request = require("supertest");
const app = require("../src/app");

describe("app", () => {
  it("returns healthy status from /health", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        message: "Service healthy",
      })
    );
  });

  it("returns 404 for unknown route", async () => {
    const response = await request(app).get("/unknown");
    expect(response.status).toBe(404);
  });
});
