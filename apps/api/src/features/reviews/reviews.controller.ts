import type { Request, Response } from "express";
import { saveReviewFeedback } from "./reviews.service.js";

export async function submitReviewFeedback(req: Request, res: Response) {
  const feedback = await saveReviewFeedback(
    String(req.params.id),
    (req as Request & { user: { id: string } }).user.id,
    req.body,
  );
  if (!feedback)
    throw Object.assign(Error("Review tidak ditemukan."), {
      status: 404,
      code: "NOT_FOUND",
    });
  res.locals.ok(feedback, 201);
}
