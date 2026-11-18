import type { Express } from "express";
import { Router } from "express";
import { prisma, guard, handle, body } from "../../app.js";
import { z } from "zod";
import { submitReviewFeedback } from "./reviews.controller.js";
export function registerRoutes(app: Express) {
  const router = Router();
  router.post(
    "/reviews/:id/feedback",
    guard,
    body(
      z.object({
        helpful: z.boolean(),
        comment: z.string().max(2000).optional(),
      }),
    ),
    handle(submitReviewFeedback),
  );
  app.use(router);
}
