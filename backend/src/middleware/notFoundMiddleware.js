import { ApiResponse } from '../utils/apiResponse.js';

export const notFound = (req, res) => {
  return ApiResponse.error(res, `API route not found: [${req.method}] ${req.originalUrl}`, 404);
};
