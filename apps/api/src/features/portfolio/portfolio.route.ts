import type { Express } from "express";
import { Router } from "express";
import { handle } from "../../app.js";
import { getPublicPortfolio } from "./portfolio.controller.js";
export function registerRoutes(app: Express) {
  const router = Router();
  router.get("/public/p/:username", handle(getPublicPortfolio));
  app.use(router);
}
