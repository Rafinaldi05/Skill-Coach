import type { Express } from "express";
import { Router } from "express";
import { guard, handle, body } from "../../app.js";
import { getOrCreateMonthlyQuota } from "./user.service.js";
import {
  getProfileController,
  updateProfileController,
  createUploadUrlController,
} from "./users.controller.js";
import { z } from "zod";
import { SkillField, CritiqueTone } from "@prisma/client";

export function registerRoutes(app: Express) {
  const router = Router();
  router.get("/me", guard, handle(getProfileController));
  router.patch(
    "/me",
    guard,
    body(
      z.object({
        displayName: z.string().min(1).max(100).optional(),
        skillField: z.nativeEnum(SkillField).nullable().optional(),
        level: z.string().max(50).nullable().optional(),
        critiqueTone: z.nativeEnum(CritiqueTone).optional(),
      }),
    ),
    handle(updateProfileController),
  );
  router.get(
    "/me/quota",
    guard,
    handle(async (req, res) => {
      const quota = await getOrCreateMonthlyQuota(req.user.id);
      res.locals.ok({
        used: quota.usedCount,
        limit: quota.limitCount,
        remaining: Math.max(0, quota.limitCount - quota.usedCount),
        resetAt: new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          1,
        ).toISOString(),
      });
    }),
  );
  router.post(
    "/uploads/presign",
    guard,
    body(
      z.object({
        fileName: z.string().min(1).max(200),
        contentType: z.enum([
          "image/png",
          "image/jpeg",
          "image/webp",
          "text/plain",
          "application/pdf",
        ]),
        size: z
          .number()
          .int()
          .positive()
          .max(5 * 1024 * 1024),
      }),
    ),
    handle(createUploadUrlController),
  );
  app.use(router);
}
