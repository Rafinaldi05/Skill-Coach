import { registerRoutes as registerHealth } from "./features/health/health.route.js";
import { registerRoutes as registerAuth } from "./features/auth/auth.route.js";
import { registerRoutes as registerUsers } from "./features/users/users.route.js";
import { registerRoutes as registerProjects } from "./features/projects/projects.route.js";
import { registerRoutes as registerVersions } from "./features/versions/versions.route.js";
import { registerRoutes as registerPortfolio } from "./features/portfolio/portfolio.route.js";
import { registerRoutes as registerReviews } from "./features/reviews/reviews.route.js";
import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import pino from "pino";
import { randomUUID, createHash } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import PgBoss from "pg-boss";
import { env } from "./config.js";
export const prisma = new PrismaClient(),
  logger = pino({
    redact: [
      "req.headers.authorization",
      "password",
      "passwordHash",
      "tokenHash",
      "NEBIUS_API_KEY",
    ],
  });
export const app = express();
app.disable("x-powered-by");
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use((req, res, next) => {
  const id = req.header("x-request-id") || `req_${randomUUID()}`;
  res.setHeader("x-request-id", id);
  (req as any).requestId = id;
  next();
});
app.use((req, res, next) => {
  res.locals.ok = (data: any, status = 200) =>
    res.status(status).json({
      success: true,
      data,
      meta: {
        requestId: (req as any).requestId,
        timestamp: new Date().toISOString(),
      },
    });
  next();
});
export const authLimit = rateLimit({ windowMs: 60000, limit: 10 }),
  apiLimit = rateLimit({ windowMs: 60000, limit: 120 });
app.use(apiLimit);
const accessKey = new TextEncoder().encode(env.JWT_SECRET),
  refreshKey = new TextEncoder().encode(env.JWT_REFRESH_SECRET),
  hash = (v: string) => createHash("sha256").update(v).digest("hex");
export { refreshKey };
export async function token(userId: string, refresh = false) {
  const key = refresh ? refreshKey : accessKey;
  return new SignJWT({ sub: userId, type: refresh ? "refresh" : "access" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(refresh ? "7d" : "15m")
    .sign(key);
}
type Authed = Request & {
  user: {
    id: string;
  };
};
export const guard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const h = req.header("authorization");
    if (!h?.startsWith("Bearer ")) throw Error();
    const { payload } = await jwtVerify(h.slice(7), accessKey);
    if (payload.type !== "access" || !payload.sub) throw Error();
    (req as Authed).user = { id: payload.sub };
    next();
  } catch {
    res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Sesi tidak valid atau kedaluwarsa.",
      },
    });
  }
};
export const handle =
  (fn: (req: Authed, res: Response) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req as Authed, res)).catch(next);
export const body =
  (s: z.ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const p = s.safeParse(req.body);
    if (!p.success)
      return res.status(422).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Data tidak valid.",
          details: p.error.flatten(),
        },
      });
    req.body = p.data;
    next();
  };
export const boss = new PgBoss(env.DATABASE_URL);
registerHealth(app);
registerAuth(app);
registerUsers(app);
registerProjects(app);
registerVersions(app);
registerPortfolio(app);
registerReviews(app);
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  logger.error({ err, requestId: res.getHeader("x-request-id") }, "request failed");
  const status = err.status || (err.code === "P2002" ? 409 : 500);
  res.status(status).json({
    success: false,
    error: {
      code: err.code || "INTERNAL_ERROR",
      message: status === 500 ? "Terjadi kesalahan pada server." : err.message,
      details: err.details,
    },
    meta: {
      requestId: res.getHeader("x-request-id"),
      timestamp: new Date().toISOString(),
    },
  });
});
export { hash, env };
