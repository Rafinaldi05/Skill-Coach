import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { randomUUID } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { app, token } from "../app.js";

const prisma = new PrismaClient();
const runDatabaseTests = process.env.RUN_INTEGRATION_TESTS === "1";

describe("API auth boundary", () => {
  it("rejects requests without a valid access token", async () => {
    const response = await request(app).get("/me");
    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("UNAUTHORIZED");
  });
});

describe.skipIf(!runDatabaseTests)("tenant isolation", () => {
  const ownerId = randomUUID();
  const otherUserId = randomUUID();
  const projectId = randomUUID();
  let otherUserToken = "";
  let fixtureCreated = false;

  beforeAll(async () => {
    await prisma.user.createMany({
      data: [ownerId, otherUserId].map((id) => ({
        id,
        email: `${id}@test.invalid`,
        username: `u_${id.replaceAll("-", "").slice(0, 20)}`,
        passwordHash: "unused-test-hash",
        displayName: "Tenant test",
      })),
    });
    await prisma.project.create({
      data: {
        id: projectId,
        userId: ownerId,
        title: "Private tenant project",
        skillType: "CODE",
      },
    });
    fixtureCreated = true;
    otherUserToken = await token(otherUserId);
  });

  afterAll(async () => {
    if (fixtureCreated)
      await prisma.user.deleteMany({ where: { id: { in: [ownerId, otherUserId] } } });
    await prisma.$disconnect();
  });

  it("does not allow another tenant to read or mutate a project", async () => {
    const read = await request(app)
      .get(`/projects?cursor=${projectId}`)
      .set("Authorization", `Bearer ${otherUserToken}`);
    expect(read.status).toBe(200);
    expect(read.body.data.items).toHaveLength(0);

    const update = await request(app)
      .patch(`/projects/${projectId}`)
      .set("Authorization", `Bearer ${otherUserToken}`)
      .send({ title: "Changed by another tenant" });
    expect(update.status).toBe(404);

    const stored = await prisma.project.findUnique({ where: { id: projectId } });
    expect(stored?.title).toBe("Private tenant project");
  });
});
