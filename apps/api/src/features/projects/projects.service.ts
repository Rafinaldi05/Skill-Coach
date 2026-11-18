import { prisma } from "../../app.js";
import type { Prisma } from "@prisma/client";

export function createProject(
  userId: string,
  data: Omit<Prisma.ProjectUncheckedCreateInput, "userId">,
) {
  return prisma.project.create({
    data: { ...data, userId },
    include: { _count: { select: { versions: true } } },
  });
}

export async function listProjects(userId: string, cursor?: string) {
  const rows = await prisma.project.findMany({
    where: { userId },
    take: 21,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { versions: true } },
      versions: {
        where: { status: "DONE" },
        orderBy: { versionNumber: "desc" },
        take: 1,
        include: { review: true },
      },
    },
  });
  return {
    items: rows.slice(0, 20),
    nextCursor: rows.length > 20 ? (rows[19]?.id ?? null) : null,
  };
}

export async function updateProject(
  projectId: string,
  userId: string,
  data: Prisma.ProjectUpdateManyMutationInput,
) {
  const result = await prisma.project.updateMany({
    where: { id: projectId, userId },
    data,
  });
  if (!result.count) return null;
  return prisma.project.findUnique({ where: { id: projectId } });
}

export async function deleteProject(projectId: string, userId: string) {
  const result = await prisma.project.deleteMany({
    where: { id: projectId, userId },
  });
  return result.count > 0;
}
