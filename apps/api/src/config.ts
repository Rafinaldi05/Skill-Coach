import "dotenv/config";
import { z } from "zod";
const schema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  NEBIUS_API_KEY: z.string().default(""),
  NEBIUS_BASE_URL: z.string().url().default("https://api.tokenfactory.nebius.com/v1/"),
  NEBIUS_MODEL_TEXT_BASE_URL: z.string().url().optional(),
  NEBIUS_MODEL_VISION_BASE_URL: z.string().url().optional(),
  NEBIUS_MODEL_TEXT: z.string().default("meta-llama/Meta-Llama-3.1-70B-Instruct"),
  NEBIUS_MODEL_VISION: z.string().default("meta-llama/Llama-3.2-11B-Vision-Instruct"),
  NEBIUS_INPUT_COST_PER_MILLION: z.coerce.number().nonnegative().default(0),
  NEBIUS_OUTPUT_COST_PER_MILLION: z.coerce.number().nonnegative().default(0),
  STORAGE_ENDPOINT: z.string().default(""),
  STORAGE_BUCKET: z.string().default("skill-coach-storage"),
  STORAGE_ACCESS_KEY: z.string().default(""),
  STORAGE_SECRET_KEY: z.string().default(""),
  FRONTEND_URL: z.string().default("http://localhost:5173"),
  PORT: z.coerce.number().default(3000),
  MONTHLY_REVIEW_LIMIT: z.coerce.number().int().positive().default(10),
});
const parsedEnv = schema.parse(process.env);
export const env = {
  ...parsedEnv,
  NEBIUS_MODEL_TEXT_BASE_URL:
    parsedEnv.NEBIUS_MODEL_TEXT_BASE_URL ?? parsedEnv.NEBIUS_BASE_URL,
  NEBIUS_MODEL_VISION_BASE_URL:
    parsedEnv.NEBIUS_MODEL_VISION_BASE_URL ?? parsedEnv.NEBIUS_BASE_URL,
};
