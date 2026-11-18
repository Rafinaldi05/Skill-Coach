import type { Request, Response } from "express";
import { loginAccount, registerAccount, rotateRefreshToken } from "./auth.service.js";

export async function registerController(req: Request, res: Response) {
  res.locals.ok(await registerAccount(req.body), 201);
}

export async function loginController(req: Request, res: Response) {
  const result = await loginAccount(req.body.email, req.body.password);
  if (!result)
    return res.status(401).json({
      success: false,
      error: { code: "INVALID_CREDENTIALS", message: "Email atau kata sandi salah." },
    });
  res.locals.ok(result);
}

export async function refreshController(req: Request, res: Response) {
  const result = await rotateRefreshToken(req.body.refreshToken);
  if (!result)
    return res.status(401).json({
      success: false,
      error: { code: "INVALID_REFRESH_TOKEN", message: "Silakan masuk kembali." },
    });
  res.locals.ok(result);
}
