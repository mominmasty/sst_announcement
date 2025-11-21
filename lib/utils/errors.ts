export class ApiError extends Error {
  statusCode: number;
  code?: string;
  details?: unknown;

  constructor(statusCode: number, message: string, code?: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string, id?: string | number) {
    super(404, `${resource}${id ? ` with id ${id}` : ''} not found`, 'NOT_FOUND');
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string, details?: unknown) {
    super(400, message, 'BAD_REQUEST', details);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(401, message, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden') {
    super(403, message, 'FORBIDDEN');
  }
}

export class ConflictError extends ApiError {
  constructor(message: string, details?: unknown) {
    super(409, message, 'CONFLICT', details);
  }
}

export class InternalServerError extends ApiError {
  constructor(message = 'Internal server error', details?: unknown) {
    super(500, message, 'INTERNAL_SERVER_ERROR', details);
  }
}

export function formatErrorResponse(error: unknown) {
  if (error instanceof ApiError) {
    return {
      success: false,
      error: error.message,
      message: error.message,
      code: error.code,
      details: error.details,
    } as const;
  }

  if (error instanceof Error) {
    return {
      success: false,
      error: error.message,
      message: error.message,
    } as const;
  }

  return {
    success: false,
    error: 'An unexpected error occurred',
    message: 'An unexpected error occurred',
  } as const;
}
