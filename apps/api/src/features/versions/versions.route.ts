import type { Express } from "express";
import { Router } from "express";
import { body, guard, handle } from "../../app.js";
import { z } from "zod";
import {
  createVersionController,
  getVersionController,
  projectProgressController,
  retryVersionController,
} from "./versions.controller.js";

export function registerRoutes(app: Express) {
  const router = Router();
  router.post(
    "/projects/:id/versions",
    guard,
    body(
      z
        .object({
          textContent: z.string().max(500000).optional(),
          fileKey: z.string().max(500).optional(),
          fileType: z
            .enum([
              "image/png",
              "image/jpeg",
              "image/webp",
              "text/plain",
              "application/pdf",
            ])
            .optional(),
        })
        .refine((value) => Boolean(value.textContent || value.fileKey), {
          message: "textContent atau fileKey wajib diisi",
        })
        .refine((value) => !value.fileKey || Boolean(value.fileType), {
          message: "fileType wajib diisi saat menggunakan fileKey",
          path: ["fileType"],
        }),
    ),
    handle(createVersionController),
  );
  router.get("/versions/:id", guard, handle(getVersionController));
  router.post("/versions/:id/retry", guard, handle(retryVersionController));
  router.get("/projects/:id/progress", guard, handle(projectProgressController));
  app.use(router);
}
