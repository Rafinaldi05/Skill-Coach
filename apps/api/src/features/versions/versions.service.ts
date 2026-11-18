import { prisma, boss } from "../../app.js";
import { getOrCreateMonthlyQuota } from "../users/user.service.js";

const fail = (message: string, status: number, code: string, details?: unknown) =>
  Object.assign(Error(message), { status, code, details });

export async function createVersion(
  userId: string,
  projectId: string,
  data: Record<string, unknown>,
  requestId?: string,
) {
  const project = await prisma.project.findFirst({ where: { id: projectId, userId } });
  if (!project) throw fail("Proyek tidak ditemukan.", 404, "NOT_FOUND");
  if (data.fileKey && !String(data.fileKey).startsWith(`${userId}/`))
    throw fail("File tidak valid.", 403, "FORBIDDEN");
  const quota = await getOrCreateMonthlyQuota(userId);
  if (quota.usedCount >= quota.limitCount)
    throw fail("Batas kuota review bulanan kamu telah habis.", 429, "QUOTA_EXCEEDED", {
      limit: quota.limitCount,
      resetAt: new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        1,
      ).toISOString(),
    });
  const version = await prisma.$transaction(async (tx) => {
    const last = await tx.version.findFirst({
      where: { projectId },
      orderBy: { versionNumber: "desc" },
    });
    return tx.version.create({
      data: { projectId, versionNumber: (last?.versionNumber || 0) + 1, ...data },
    });
  });
  const jobId = await boss.send(
    "review-process-job",
    { versionId: version.id, requestId },
    { retryLimit: 2, retryDelay: 5, retryBackoff: true },
  );
  if (!jobId) {
    await prisma.version.update({
      where: { id: version.id },
      data: { status: "FAILED", errorMessage: "Job review gagal dimasukkan ke antrean." },
    });
    throw fail("Antrean review sedang tidak tersedia.", 503, "QUEUE_UNAVAILABLE");
  }
  return version;
}

export function findVersion(userId: string, versionId: string) {
  return prisma.version.findFirst({
    where: { id: versionId, project: { userId } },
    include: { review: true },
  });
}

export async function retryVersion(
  userId: string,
  versionId: string,
  requestId?: string,
) {
  const version = await prisma.version.findFirst({
    where: { id: versionId, project: { userId } },
  });
  if (!version) throw fail("Versi tidak ditemukan.", 404, "NOT_FOUND");
  if (version.status !== "FAILED")
    throw fail("Hanya review gagal yang dapat diulang.", 409, "INVALID_STATE");
  await prisma.version.update({
    where: { id: version.id },
    data: { status: "QUEUED", errorMessage: null },
  });
  const jobId = await boss.send(
    "review-process-job",
    { versionId: version.id, requestId },
    { retryLimit: 2, retryDelay: 5, retryBackoff: true },
  );
  if (!jobId) {
    await prisma.version.update({
      where: { id: version.id },
      data: { status: "FAILED", errorMessage: "Job review gagal dimasukkan ke antrean." },
    });
    throw fail("Antrean review sedang tidak tersedia.", 503, "QUEUE_UNAVAILABLE");
  }
  return { id: version.id, status: "QUEUED" as const };
}

export async function projectProgress(userId: string, projectId: string) {
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId },
    include: {
      versions: {
        where: { status: "DONE" },
        orderBy: { versionNumber: "asc" },
        include: { review: true },
      },
    },
  });
  if (!project) throw fail("Proyek tidak ditemukan.", 404, "NOT_FOUND");
  return project.versions.map((version) => ({
    versionId: version.id,
    versionNumber: version.versionNumber,
    createdAt: version.createdAt,
    scores: version.review?.scores,
  }));
}
