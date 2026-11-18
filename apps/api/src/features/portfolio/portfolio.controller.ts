import type { Request, Response } from "express";
import { findPublicPortfolio } from "./portfolio.service.js";

export async function getPublicPortfolio(req: Request, res: Response) {
  const profile = await findPublicPortfolio(String(req.params.username));
  if (!profile)
    throw Object.assign(Error("Profil tidak ditemukan."), {
      status: 404,
      code: "NOT_FOUND",
    });
  res.locals.ok(profile);
}
