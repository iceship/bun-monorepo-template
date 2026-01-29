// src/env.ts
import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),
  PORT: z.coerce.number().default(3300),
  DATABASE_URL: z.url(),
});

export type Env = z.infer<typeof EnvSchema>;
const env = EnvSchema.parse(process.env);
export default env;
