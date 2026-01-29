import { pinoLogger as logger } from "hono-pino";
import env from "../env";

export function pinoLogger() {
  return logger({
    pino: {
      level: env.LOG_LEVEL,
      serializers:
        env.LOG_LEVEL === "debug"
          ? undefined
          : {
              req: (req) => ({
                method: req.method,
                url: req.url,
              }),
              res: (res) => ({
                status: res.status,
              }),
            },
      transport:
        env.NODE_ENV === "production"
          ? undefined
          : {
              target: "pino-pretty",
              options: {
                colorize: true,
                ignore: "pid,hostname",
                translateTime: "SYS:standard",
              },
            },
    },
  });
}
