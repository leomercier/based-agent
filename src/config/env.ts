import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  CDP_API_KEY_NAME: z.string(),
  CDP_PRIVATE_KEY: z.string(),
  OPENAI_API_KEY: z.string(),
  BASE_RPC_URL: z.string().optional(),
  ENVIRONMENT: z.enum(["development", "production"]).default("development"),
});

export const env = envSchema.parse(process.env);
