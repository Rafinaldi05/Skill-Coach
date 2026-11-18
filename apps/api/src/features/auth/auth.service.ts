import argon2 from "argon2";
import { jwtVerify } from "jose";
import { prisma, hash, token, refreshKey } from "../../app.js";
import { env } from "../../config.js";

export async function registerAccount(data: {
  email: string;
  username: string;
  password: string;
  displayName: string;
}) {
  const user = await prisma.user.create({
    data: {
      ...data,
      passwordHash: await argon2.hash(data.password),
      quotas: {
        create: {
          periodStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          limitCount: env.MONTHLY_REVIEW_LIMIT,
        },
      },
    },
    select: { id: true, email: true, username: true, displayName: true },
  });
  const refreshToken = await token(user.id, true);
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hash(refreshToken),
      expiresAt: new Date(Date.now() + 7 * 864e5),
    },
  });
  return {
    user,
    accessToken: await token(user.id),
    refreshToken,
  };
}

export async function loginAccount(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await argon2.verify(user.passwordHash, password))) return null;
  const refreshToken = await token(user.id, true);
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hash(refreshToken),
      expiresAt: new Date(Date.now() + 7 * 864e5),
    },
  });
  return {
    accessToken: await token(user.id),
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
    },
  };
}

export async function rotateRefreshToken(refreshToken: string) {
  try {
    const { payload } = await jwtVerify(refreshToken, refreshKey);
    if (payload.type !== "refresh" || !payload.sub) return null;
    const next = await token(payload.sub, true);
    return await prisma.$transaction(async (tx) => {
      const claimed = await tx.refreshToken.updateMany({
        where: {
          tokenHash: hash(refreshToken),
          userId: payload.sub,
          revokedAt: null,
          expiresAt: { gt: new Date() },
        },
        data: { revokedAt: new Date() },
      });
      if (!claimed.count) return null;
      await tx.refreshToken.create({
        data: {
          userId: payload.sub!,
          tokenHash: hash(next),
          expiresAt: new Date(Date.now() + 7 * 864e5),
        },
      });
      return { accessToken: await token(payload.sub!), refreshToken: next };
    });
  } catch (error) {
    if (error instanceof Error && error.name === "JWTExpired") return null;
    if (error instanceof Error && error.name.startsWith("JWT")) return null;
    throw error;
  }
}
