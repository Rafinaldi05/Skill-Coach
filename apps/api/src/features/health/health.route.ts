import type { Express } from "express";
import { Router } from "express";
import { healthController } from "./health.controller.js";

export function registerRoutes(app: Express) {
  const router = Router();
  router.get("/health", healthController);
  app.use(router);
}
