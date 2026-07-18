import { Router, Request, Response } from 'express';
import { auditService } from '../services/auditService';

const router = Router();

// GET /api/audit-logs
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await auditService.list(page, limit);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// GET /api/audit-logs/:id
router.get('/:id', async (req: Request, res: Response) => {
  // TODO: Implement get single audit log
  res.status(501).json({ error: 'Not implemented' });
});

export { router as auditLogsRouter };
