import type { Express } from "express";
import { Router } from "express";
import { guard, handle, body } from "../../app.js";
import { SkillType } from "@prisma/client";
import { z } from "zod";
import {
  createProjectController,
  deleteProjectController,
  listProjectsController,
  updateProjectController,
} from "./projects.controller.js";

export function registerRoutes(app: Express) {
  const router = Router();
  router.post(
    "/projects",
    guard,
    body(
      z.object({
        title: z.string().min(1).max(150),
        description: z.string().max(10000).optional(),
        goal: z.string().max(10000).optional(),
        skillType: z.nativeEnum(SkillType),
      }),
    ),
    handle(createProjectController),
  );
  router.get("/projects", guard, handle(listProjectsController));
  router.patch(
    "/projects/:id",
    guard,
    body(
      z.object({
        title: z.string().min(1).max(150).optional(),
        description: z.string().max(10000).nullable().optional(),
        goal: z.string().max(10000).nullable().optional(),
        visibility: z.enum(["PRIVATE", "PUBLIC"]).optional(),
      }),
    ),
    handle(updateProjectController),
  );
  router.delete("/projects/:id", guard, handle(deleteProjectController));
  app.use(router);
}
