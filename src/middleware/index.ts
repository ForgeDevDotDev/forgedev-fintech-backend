import { Request, Response, NextFunction } from 'express';

// Simple error handler middleware
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
}

// Request logger
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  console.log(`${req.method} ${req.path}`);
  next();
}

// TODO: Add auth middleware
// FIXME: This is just a stub, not real authentication
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // Stub: in production this should validate JWT tokens
  // For now we just attach a fake user
  (req as any).userId = 'stub-user-id';
  next();
}
