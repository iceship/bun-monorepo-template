import { hc } from "hono/client";

import type { AppType } from "@/app";

const client = hc<AppType>("http://localhost:3300");

const result = await client.tasks.$get();
console.log(await result.json());
