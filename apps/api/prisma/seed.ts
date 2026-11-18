import "dotenv/config";
import argon2 from "argon2";
import { PrismaClient } from "@prisma/client";

if (process.env.NODE_ENV === "production") {
  throw new Error("Seed demo tidak boleh dijalankan di production.");
}

const email = process.env.SEED_EMAIL;
const username = process.env.SEED_USERNAME;
const password = process.env.SEED_PASSWORD;
const displayName = process.env.SEED_DISPLAY_NAME || "Skill Coach Demo";

if (!email || !username || !password) {
  throw new Error(
    "Isi SEED_EMAIL, SEED_USERNAME, dan SEED_PASSWORD sebelum menjalankan seed.",
  );
}
if (password.length < 10) {
  throw new Error("SEED_PASSWORD minimal 10 karakter.");
}

const prisma = new PrismaClient();

try {
  const passwordHash = await argon2.hash(password);
  const user = await prisma.user.upsert({
    where: { email },
    create: { email, username, passwordHash, displayName },
    update: { username, passwordHash, displayName },
    select: { id: true, email: true },
  });

  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
  await prisma.usageQuota.upsert({
    where: { userId_periodStart: { userId: user.id, periodStart } },
    create: { userId: user.id, periodStart, limitCount: 10 },
    update: {},
  });

  console.log(`Seed user siap: ${user.email}`);
} finally {
  await prisma.$disconnect();
}
