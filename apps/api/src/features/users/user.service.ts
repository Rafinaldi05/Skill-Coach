import { prisma } from "../../app.js";
import { env } from "../../config.js";

const currentPeriod = () => new Date(new Date().getFullYear(), new Date().getMonth(), 1);

export function getOrCreateMonthlyQuota(userId: string) {
  const periodStart = currentPeriod();
  return prisma.usageQuota.upsert({
    where: { userId_periodStart: { userId, periodStart } },
    create: {
      userId,
      periodStart,
      limitCount: env.MONTHLY_REVIEW_LIMIT,
    },
    update: {},
  });
}
