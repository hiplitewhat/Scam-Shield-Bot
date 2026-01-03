import { z } from 'zod';
import { scamLogs, settings } from './schema';

export const errorSchemas = {
  internal: z.object({ message: z.string() }),
  validation: z.object({ message: z.string() }),
};

export const api = {
  logs: {
    list: {
      method: 'GET' as const,
      path: '/api/logs',
      responses: {
        200: z.array(z.custom<typeof scamLogs.$inferSelect>()),
      },
    },
    stats: {
        method: 'GET' as const,
        path: '/api/stats',
        responses: {
            200: z.object({
                totalScams: z.number(),
                last24h: z.number(),
                recentLogs: z.array(z.custom<typeof scamLogs.$inferSelect>())
            })
        }
    }
  },
  settings: {
    list: {
        method: 'GET' as const,
        path: '/api/settings',
        responses: {
            200: z.array(z.custom<typeof settings.$inferSelect>())
        }
    },
    update: {
        method: 'POST' as const,
        path: '/api/settings',
        input: z.object({ key: z.string(), value: z.string() }),
        responses: {
            200: z.custom<typeof settings.$inferSelect>()
        }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
