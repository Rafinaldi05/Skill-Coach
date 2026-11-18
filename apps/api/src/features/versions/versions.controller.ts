import type { Request, Response } from "express";
import {
  createVersion,
  findVersion,
  projectProgress,
  retryVersion,
} from "./versions.service.js";

type AuthedRequest = Request & { user: { id: string }; requestId?: string };

export async function createVersionController(req: Request, res: Response) {
  const request = req as AuthedRequest;
  res.locals.ok(
    await createVersion(
      request.user.id,
      String(req.params.id),
      req.body,
      request.requestId,
    ),
    201,
  );
}

export async function getVersionController(req: Request, res: Response) {
  const request = req as AuthedRequest;
  const version = await findVersion(request.user.id, String(req.params.id));
  if (!version)
    throw Object.assign(Error("Versi tidak ditemukan."), {
      status: 404,
      code: "NOT_FOUND",
    });
  res.locals.ok(version);
}

export async function retryVersionController(req: Request, res: Response) {
  const request = req as AuthedRequest;
  res.locals.ok(
    await retryVersion(request.user.id, String(req.params.id), request.requestId),
  );
}

export async function projectProgressController(req: Request, res: Response) {
  const request = req as AuthedRequest;
  res.locals.ok(await projectProgress(request.user.id, String(req.params.id)));
}
