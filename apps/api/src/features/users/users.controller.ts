import type { Request, Response } from "express";
import { createUploadUrl, getProfile, updateProfile } from "./users.service.js";
type AuthedRequest = Request & { user: { id: string } };
export async function getProfileController(req: Request, res: Response) {
  res.locals.ok(await getProfile((req as AuthedRequest).user.id));
}
export async function updateProfileController(req: Request, res: Response) {
  res.locals.ok(await updateProfile((req as AuthedRequest).user.id, req.body));
}
export async function createUploadUrlController(req: Request, res: Response) {
  const request = req as AuthedRequest;
  res.locals.ok(
    await createUploadUrl(request.user.id, req.body.contentType, req.body.size),
  );
}
