import type { Express } from "express";
import { Router } from "express";
import { authLimit, body, handle } from "../../app.js";
import { z } from "zod";
import {
  loginController,
  refreshController,
  registerController,
} from "./auth.controller.js";

export function registerRoutes(app: Express) {
  const router = Router();
  router.post(
    "/auth/register",
    authLimit,
    body(
      z.object({
        email: z.string().email().max(255),
        username: z
          .string()
          .min(3)
          .max(50)
          .regex(/^[a-zA-Z0-9_]+$/),
        password: z.string().min(10).max(128),
        displayName: z.string().min(1).max(100),
      }),
    ),
    handle(registerController),
  );
  router.post(
    "/auth/login",
    authLimit,
    body(z.object({ email: z.string().email(), password: z.string() })),
    handle(loginController),
  );
  router.post(
    "/auth/refresh",
    authLimit,
    body(z.object({ refreshToken: z.string() })),
    handle(refreshController),
  );
  app.use(router);
}
