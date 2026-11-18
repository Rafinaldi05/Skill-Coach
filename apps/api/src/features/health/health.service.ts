import { prisma } from "../../app.js";
import { env } from "../../config.js";

export async function getHealth() {
  await prisma.$queryRaw`SELECT 1`;
  return {
    database: "ok" as const,
    storage: env.STORAGE_ENDPOINT ? "configured" : "not_configured",
    queue: "postgres_backed" as const,
  };
}
