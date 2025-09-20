// lib/env.ts
import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development","test","production"]).default("development"),
  SITE_URL: z.string().optional(),
  ALLOWED_ORIGINS: z.string().optional(),
  IMAGE_PROXY_REQUIRE_SIGNATURE: z.enum(["true","false"]).default("false"),
  IMAGE_PROXY_SECRET: z.string().optional(),
  IMAGE_PROXY_MAX_BYTES: z.string().optional(),
  IMAGE_PROXY_TIMEOUT_MS: z.string().optional(),
  BASIC_AUTH_USER: z.string().optional(),
  BASIC_AUTH_PASS: z.string().optional(),
});

export const ENV = EnvSchema.parse(process.env);