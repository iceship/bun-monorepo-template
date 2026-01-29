import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { $ } from "bun";
import { testClient } from "hono/testing";
import env from "@/env";
import { createTestApp } from "@/lib/create-app";
import router from "./tasks.index";

if (env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

const client = testClient(createTestApp(router));

describe("Tasks API Integration Test", () => {
  // 1. Docker & Migration
  beforeAll(async () => {
    console.log("🐳 Starting Test DB...");
    // DB 실행
    await $`docker compose -f docker-compose.test.yml up -d --wait`;
    await Bun.sleep(2000);

    console.log("🚀 Running Migrations...");
    await $`DATABASE_URL=${env.DATABASE_URL} bun run db:migrate`;
    console.log("✅ Ready to Test!");
  });

  // 2. 종료 시 Docker 삭제 (데이터도 이때 같이 날아감)
  afterAll(async () => {
    console.log("🧹 Cleaning up...");
    await $`docker compose -f docker-compose.test.yml down -v`;
  });

  // =========================================
  // 3. 테스트 케이스
  // =========================================

  test("POST /tasks - 유효성 검사 실패 (Body)", async () => {
    const response = await client.tasks.$post({
      json: {
        name: "",
        done: false,
      },
    });
    expect(response.status).toBe(422);

    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues?.[0]?.path?.[0]).toBe("name");
    }
  });

  test("POST /tasks - 정상 생성", async () => {
    const name = "Learn Bun Test";
    const response = await client.tasks.$post({
      json: { name, done: false },
    });

    expect(response.status).toBe(201);

    if (response.status === 201) {
      const json = await response.json();
      expect(json.name).toBe(name);
      expect(json.done).toBe(false);
      expect(typeof json.id).toBe("number");
    }
  });

  test("GET /tasks - 전체 목록 조회", async () => {
    // 조회
    const response = await client.tasks.$get();
    expect(response.status).toBe(200);

    if (response.status === 200) {
      const json = await response.json();
      expect(Array.isArray(json)).toBe(true);
      expect(json.length).toBeGreaterThanOrEqual(0);
    }
  });

  test("GET /tasks/{id} - ID 파라미터 유효성 검사", async () => {
    const response = await client.tasks[":id"].$get({
      param: { id: "wat" },
    });

    expect(response.status).toBe(422);

    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues?.[0]?.path?.[0]).toBe("id");
    }
  });

  test("GET /tasks/{id} - 404 Not Found", async () => {
    const response = await client.tasks[":id"].$get({
      param: { id: 9999999 },
    });

    expect(response.status).toBe(404);
  });

  test("GET /tasks/{id} - 단건 조회 성공", async () => {
    // 테스트 간 의존성을 줄이기 위해, 조회할 데이터를 직접 만들고 시작합니다.
    const createRes = await client.tasks.$post({
      json: { name: "Target Task" },
    });

    // 생성 성공 확인 (200 또는 201)
    if (!createRes.ok) throw new Error("Create failed inside GET test");
    const created = await createRes.json();

    // 생성된 ID로 조회
    const response = await client.tasks[":id"].$get({
      param: { id: created.id },
    });

    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expect(json.name).toBe("Target Task");
    }
  });

  test("PATCH /tasks/{id} - 수정 시 Body 유효성 검사", async () => {
    const response = await client.tasks[":id"].$patch({
      param: { id: 1 }, // ID가 있든 없든 Body 검사가 먼저 돕니다.
      json: { name: "" },
    });

    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues?.[0]?.path?.[0]).toBe("name");
    }
  });

  test("PATCH /tasks/{id} - 단건 수정 성공", async () => {
    const createRes = await client.tasks.$post({ json: { name: "Old Name" } });
    if (!createRes.ok) throw new Error("Create failed");
    const created = await createRes.json();

    const response = await client.tasks[":id"].$patch({
      param: { id: created.id },
      json: { done: true },
    });

    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expect(json.done).toBe(true);
      expect(json.name).toBe("Old Name");
    }
  });

  test("DELETE /tasks/{id} - 삭제 성공", async () => {
    const createRes = await client.tasks.$post({ json: { name: "To Delete" } });
    if (!createRes.ok) throw new Error("Create failed");
    const created = await createRes.json();

    const response = await client.tasks[":id"].$delete({
      param: { id: created.id },
    });

    expect(response.status).toBe(204);
  });
});
