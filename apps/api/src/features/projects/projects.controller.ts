import type { Request, Response } from "express";
import {
  createProject,
  deleteProject,
  listProjects,
  updateProject,
} from "./projects.service.js";

type AuthedRequest = Request & { user: { id: string } };

export async function createProjectController(req: Request, res: Response) {
  const request = req as AuthedRequest;
  res.locals.ok(await createProject(request.user.id, request.body), 201);
}

export async function listProjectsController(req: Request, res: Response) {
  const request = req as AuthedRequest;
  const cursor = typeof req.query.cursor === "string" ? req.query.cursor : undefined;
  res.locals.ok(await listProjects(request.user.id, cursor));
}

export async function updateProjectController(req: Request, res: Response) {
  const request = req as AuthedRequest;
  const project = await updateProject(String(req.params.id), request.user.id, req.body);
  if (!project)
    throw Object.assign(Error("Proyek tidak ditemukan."), {
      status: 404,
      code: "NOT_FOUND",
    });
  res.locals.ok(project);
}

export async function deleteProjectController(req: Request, res: Response) {
  const request = req as AuthedRequest;
  const deleted = await deleteProject(String(req.params.id), request.user.id);
  if (!deleted)
    throw Object.assign(Error("Proyek tidak ditemukan."), {
      status: 404,
      code: "NOT_FOUND",
    });
  res.locals.ok({ deleted: true });
}
