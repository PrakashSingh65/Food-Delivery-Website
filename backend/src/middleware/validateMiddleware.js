import { ApiResponse } from '../utils/apiResponse.js';

/**
 * Zod validation middleware factory
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @param {'body' | 'query' | 'params'} source - Request attribute to validate
 */
export const validate = (schema, source = 'body') => {
  return async (req, res, next) => {
    try {
      const parsed = await schema.parseAsync(req[source]);
      req[source] = parsed;
      next();
    } catch (error) {
      if (error.errors && Array.isArray(error.errors)) {
        const structuredErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return ApiResponse.error(res, 'Validation failed', 400, structuredErrors);
      }
      return ApiResponse.error(res, error.message || 'Validation error', 400);
    }
  };
};
