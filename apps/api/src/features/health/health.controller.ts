import type { Request, Response } from "express";
import { getHealth } from "./health.service.js";

export async function healthController(_req: Request, res: Response) {
  try {
    res.json({ success: true, data: await getHealth() });
  } catch {
    res.status(503).json({
      success: false,
      error: {
        code: "UNHEALTHY",
        message: "Service dependency unavailable",
      },
    });
  }
}
