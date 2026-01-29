// drizzle.config.ts
import { defineConfig } from "drizzle-kit";
import env from "./src/env";

export default defineConfig({
  schema: "./src/db/schema.ts", // 스키마 파일 위치
  out: "./src/db/migrations", // 마이그레이션 파일 저장 위치
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
