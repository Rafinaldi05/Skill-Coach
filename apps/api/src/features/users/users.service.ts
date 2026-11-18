import { randomUUID } from "node:crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { prisma } from "../../app.js";
import { env } from "../../config.js";

export function getProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      skillField: true,
      level: true,
      critiqueTone: true,
      createdAt: true,
    },
  });
}

export function updateProfile(userId: string, data: Record<string, unknown>) {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      skillField: true,
      level: true,
      critiqueTone: true,
    },
  });
}

export async function createUploadUrl(
  userId: string,
  contentType: string,
  requestedSize: number,
) {
  if (!env.STORAGE_ENDPOINT || !env.STORAGE_ACCESS_KEY || !env.STORAGE_SECRET_KEY)
    throw Object.assign(Error("Storage belum dikonfigurasi."), {
      status: 503,
      code: "STORAGE_UNAVAILABLE",
    });
  const client = new S3Client({
    region: "auto",
    endpoint: env.STORAGE_ENDPOINT,
    credentials: {
      accessKeyId: env.STORAGE_ACCESS_KEY,
      secretAccessKey: env.STORAGE_SECRET_KEY,
    },
  });
  const key = `${userId}/${randomUUID()}`;
  const url = await getSignedUrl(
    client,
    new PutObjectCommand({
      Bucket: env.STORAGE_BUCKET,
      Key: key,
      ContentType: contentType,
      ContentLength: requestedSize,
    }),
    { expiresIn: 300, signableHeaders: new Set(["content-length"]) },
  );
  return {
    uploadUrl: url,
    method: "PUT" as const,
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(requestedSize),
    },
    fileKey: key,
    expiresIn: 300,
    maxBytes: 5 * 1024 * 1024,
  };
}
