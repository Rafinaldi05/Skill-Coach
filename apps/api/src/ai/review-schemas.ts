import { z } from "zod";
export const ImprovementItemSchema = z.object({
  title: z.string().min(3),
  problem: z.string().min(10),
  why_it_matters: z.string().min(10),
  example_fix: z.string().min(5),
  location: z.string().optional(),
});
export const ReviewOutputSchema = z.object({
  summary: z.string().min(20),
  scores: z.record(z.string(), z.number().min(1).max(10)),
  strengths: z.array(z.string()).min(2),
  improvements: z.array(ImprovementItemSchema),
  next_steps: z.tuple([z.string(), z.string(), z.string()]),
  comparison: z
    .object({
      score_delta: z.record(z.string(), z.number()).optional(),
      progress_commentary: z.string(),
    })
    .nullable()
    .optional(),
});
