import { prisma } from "../../app.js";

export function findPublicPortfolio(username: string) {
  return prisma.user.findUnique({
    where: { username },
    select: {
      username: true,
      displayName: true,
      skillField: true,
      projects: {
        where: { visibility: "PUBLIC" },
        include: {
          versions: {
            where: { status: "DONE" },
            orderBy: { versionNumber: "asc" },
            include: { review: true },
          },
        },
      },
    },
  });
}
