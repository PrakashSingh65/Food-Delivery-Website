/**
 * Standardized API Response Contract
 * Format: { success: boolean, data: any, message: string, errors?: any[] }
 */
export class ApiResponse {
  static success(res, data = null, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      data,
      message,
    });
  }

  static created(res, data = null, message = 'Resource created successfully') {
    return this.success(res, data, message, 201);
  }

  static error(res, message = 'Internal Server Error', statusCode = 500, errors = null) {
    const payload = {
      success: false,
      data: null,
      message,
    };
    if (errors && errors.length > 0) {
      payload.errors = errors;
    }
    return res.status(statusCode).json(payload);
  }
}
