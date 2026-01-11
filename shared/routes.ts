import { z } from 'zod';
import { 
  insertProjectSchema, 
  insertFeatureSchema, 
  insertBugSchema, 
  insertImprovementSchema,
  projects,
  features,
  bugs,
  improvements
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  projects: {
    list: {
      method: 'GET' as const,
      path: '/api/projects',
      responses: {
        200: z.array(z.custom<typeof projects.$inferSelect & {
          features: typeof features.$inferSelect[];
          bugs: typeof bugs.$inferSelect[];
          improvements: typeof improvements.$inferSelect[];
        }>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/projects/:id',
      responses: {
        200: z.custom<typeof projects.$inferSelect & {
          features: typeof features.$inferSelect[];
          bugs: typeof bugs.$inferSelect[];
          improvements: typeof improvements.$inferSelect[];
        }>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/projects',
      input: insertProjectSchema,
      responses: {
        201: z.custom<typeof projects.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/projects/:id',
      input: insertProjectSchema.partial(),
      responses: {
        200: z.custom<typeof projects.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/projects/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  features: {
    create: {
      method: 'POST' as const,
      path: '/api/projects/:projectId/features',
      input: insertFeatureSchema.omit({ projectId: true }),
      responses: {
        201: z.custom<typeof features.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/features/:id',
      input: insertFeatureSchema.partial(),
      responses: {
        200: z.custom<typeof features.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/features/:id',
      responses: {
        204: z.void(),
      },
    },
  },
  bugs: {
    create: {
      method: 'POST' as const,
      path: '/api/projects/:projectId/bugs',
      input: insertBugSchema.omit({ projectId: true }),
      responses: {
        201: z.custom<typeof bugs.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/bugs/:id',
      input: insertBugSchema.partial(),
      responses: {
        200: z.custom<typeof bugs.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/bugs/:id',
      responses: {
        204: z.void(),
      },
    },
  },
  improvements: {
    create: {
      method: 'POST' as const,
      path: '/api/projects/:projectId/improvements',
      input: insertImprovementSchema.omit({ projectId: true }),
      responses: {
        201: z.custom<typeof improvements.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/improvements/:id',
      input: insertImprovementSchema.partial(),
      responses: {
        200: z.custom<typeof improvements.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/improvements/:id',
      responses: {
        204: z.void(),
      },
    },
  },
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
