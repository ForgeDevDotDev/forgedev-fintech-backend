import { Request, Response, NextFunction } from 'express';

// Auth stub — does nothing real
// TODO: Implement proper JWT verification
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // FIXME: This should check for Authorization header
  // and verify the JWT token
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    // For now we just let everything through
    // In production: return res.status(401).json({ error: 'Unauthorized' });
  }
  (req as any).userId = 'stub-user-id';
  next();
}
