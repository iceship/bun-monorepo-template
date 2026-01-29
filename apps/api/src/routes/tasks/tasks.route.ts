// src/routes/tasks/tasks.route.ts

import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";
import {
  insertTasksSchema,
  patchTasksSchema,
  selectTasksSchema,
} from "@/db/schema";
import { notFoundSchema } from "@/lib/constants";

const tags = ["Tasks"];

export const list = createRoute({
  method: "get",
  path: "/tasks",
  tags,
  summary: "List Tasks",
  description: "Retrieve a list of tasks.",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectTasksSchema),
      "List of Tasks",
    ),
  },
});

export const create = createRoute({
  method: "post",
  path: "/tasks",
  tags,
  summary: "Create Task",
  description: "Create a new task.",
  request: {
    body: jsonContentRequired(insertTasksSchema, "Task to Create"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(selectTasksSchema, "Created Task"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertTasksSchema),
      "Validation Error(s)",
    ),
  },
});

export const getOne = createRoute({
  method: "get",
  path: "/tasks/{id}",
  tags,
  summary: "Get One Task",
  description: "Retrieve a single task by ID.",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectTasksSchema, "Requested Task"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Task not found"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export const patch = createRoute({
  method: "patch",
  path: "/tasks/{id}",
  tags,
  summary: "Update Task",
  description: "Update an existing task by ID.",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(patchTasksSchema, "Task to Update"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectTasksSchema, "Updated Task"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Task not found"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchTasksSchema).or(createErrorSchema(IdParamsSchema)),
      "Invalid error(s)",
    ),
  },
});

export const remove = createRoute({
  method: "delete",
  path: "/tasks/{id}",
  tags,
  summary: "Delete Task",
  description: "Delete a task by ID.",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Task deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Task not found"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
