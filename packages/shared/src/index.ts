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

export type ReviewOutput = z.infer<typeof ReviewOutputSchema>;

// HTTP contracts. Database status values are normalized only when parsed by clients.
export const ReviewStatusSchema = z.enum(["queued", "processing", "done", "failed"]);
export type ReviewStatus = z.infer<typeof ReviewStatusSchema>;
export const WireStatusSchema = z.enum(["QUEUED", "PROCESSING", "DONE", "FAILED"])
  .transform((status) => ReviewStatusSchema.parse(status.toLowerCase()));
export const SkillTypeSchema = z.enum(["UI", "CODE", "ESSAY"]);
export const SkillFieldSchema = z.enum(["UI_UX", "SOFTWARE_ENGINEERING", "WRITING"]);
export const CritiqueToneSchema = z.enum(["FRIENDLY", "STANDARD", "BLUNT"]);
export const ApiMetaSchema = z.object({ requestId: z.string(), timestamp: z.string() });
export const ApiErrorSchema = z.object({ success: z.literal(false), error: z.object({
  code: z.string(), message: z.string(), details: z.unknown().optional(),
}), meta: ApiMetaSchema.optional() });
export const ApiEnvelopeSchema = z.object({ success: z.literal(true), data: z.unknown(), meta: ApiMetaSchema.optional() });
export const LoginInputSchema = z.object({ email: z.string().email(), password: z.string() });
export const RegisterInputSchema = z.object({
  email: z.string().email().max(255), username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(10).max(128), displayName: z.string().min(1).max(100),
});
export const AuthUserSchema = z.object({ id: z.string(), email: z.string(), username: z.string(), displayName: z.string() });
export const TokenPairSchema = z.object({ accessToken: z.string(), refreshToken: z.string() });
export const AuthResultSchema = TokenPairSchema.extend({ user: AuthUserSchema });
export const ProfileSchema = AuthUserSchema.extend({ skillField: SkillFieldSchema.nullable(), level: z.string().nullable(), critiqueTone: CritiqueToneSchema, createdAt: z.string().optional() });
export const UpdateProfileInputSchema = z.object({ displayName: z.string().min(1).max(100).optional(), skillField: SkillFieldSchema.nullable().optional(), level: z.string().max(50).nullable().optional(), critiqueTone: CritiqueToneSchema.optional() });
export const QuotaSchema = z.object({ used: z.number(), limit: z.number(), remaining: z.number(), resetAt: z.string() });
export const CreateProjectInputSchema = z.object({ title: z.string().min(1).max(150), description: z.string().max(10000).optional(), goal: z.string().max(10000).optional(), skillType: SkillTypeSchema });
export const UpdateProjectInputSchema = z.object({ title: z.string().min(1).max(150).optional(), description: z.string().max(10000).nullable().optional(), goal: z.string().max(10000).nullable().optional(), visibility: z.enum(["PRIVATE", "PUBLIC"]).optional() });
export const ReviewSchema = z.object({
  id: z.string(), versionId: z.string(), summary: ReviewOutputSchema.shape.summary,
  scores: ReviewOutputSchema.shape.scores, strengths: ReviewOutputSchema.shape.strengths,
  improvements: ReviewOutputSchema.shape.improvements, nextSteps: ReviewOutputSchema.shape.next_steps,
  comparison: ReviewOutputSchema.shape.comparison, model: z.string(), promptVersion: z.string(),
  tokensIn: z.number(), tokensOut: z.number(), costEstimate: z.string(), createdAt: z.string(),
});
export const VersionSchema = z.object({ id: z.string(), projectId: z.string(), versionNumber: z.number(), fileKey: z.string().nullable(), fileType: z.string().nullable(), textContent: z.string().nullable(), status: WireStatusSchema, errorMessage: z.string().nullable(), createdAt: z.string(), review: ReviewSchema.nullable().optional() });
export const ProjectSchema = z.object({ id: z.string(), userId: z.string(), title: z.string(), description: z.string().nullable(), goal: z.string().nullable(), skillType: SkillTypeSchema, visibility: z.string(), createdAt: z.string(), _count: z.object({ versions: z.number() }).optional(), versions: z.array(VersionSchema).optional() });
export const ProjectsPageSchema = z.object({ items: z.array(ProjectSchema), nextCursor: z.string().nullable() });
export const FileTypeSchema = z.enum(["image/png", "image/jpeg", "image/webp", "text/plain", "application/pdf"]);
export const CreateVersionInputSchema = z.object({ textContent: z.string().max(500000).optional(), fileKey: z.string().max(500).optional(), fileType: FileTypeSchema.optional() }).refine(v => Boolean(v.textContent || v.fileKey), "textContent atau fileKey wajib diisi").refine(v => !v.fileKey || Boolean(v.fileType), "fileType wajib diisi saat menggunakan fileKey");
export const RetryVersionSchema = z.object({ id: z.string(), status: WireStatusSchema });
export const ProgressSchema = z.array(z.object({ versionId: z.string(), versionNumber: z.number(), createdAt: z.string(), scores: z.record(z.string(), z.number()).optional() }));
export const FeedbackInputSchema = z.object({ helpful: z.boolean(), comment: z.string().max(2000).optional() });
export const FeedbackSchema = z.object({ id: z.string(), reviewId: z.string(), userId: z.string(), helpful: z.boolean(), comment: z.string().nullable(), createdAt: z.string() });
export const PortfolioSchema = z.object({ username: z.string(), displayName: z.string(), skillField: SkillFieldSchema.nullable(), projects: z.array(ProjectSchema) });
export const DeletedSchema = z.object({ deleted: z.literal(true) });
export type LoginInput = z.infer<typeof LoginInputSchema>;
export type RegisterInput = z.infer<typeof RegisterInputSchema>;
export type TokenPair = z.infer<typeof TokenPairSchema>;
export type AuthResult = z.infer<typeof AuthResultSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileInputSchema>;
export type CreateProjectInput = z.infer<typeof CreateProjectInputSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectInputSchema>;
export type CreateVersionInput = z.infer<typeof CreateVersionInputSchema>;
export type FeedbackInput = z.infer<typeof FeedbackInputSchema>;
export type Version = z.infer<typeof VersionSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Review = z.infer<typeof ReviewSchema>;
