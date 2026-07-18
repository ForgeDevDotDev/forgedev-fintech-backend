import { Router, Request, Response } from 'express';
import { transferService } from '../services/transferService';

const router = Router();

// GET /api/transfers
router.get('/', async (req: Request, res: Response) => {
  try {
    const accountId = req.query.accountId as string;
    const transfers = await transferService.listTransfers(accountId);
    res.json(transfers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transfers' });
  }
});

// GET /api/transfers/:id
router.get('/:id', async (req: Request, res: Response) => {
  // TODO: Implement get single transfer
  res.status(501).json({ error: 'Not implemented' });
});

// POST /api/transfers
router.post('/', async (req: Request, res: Response) => {
  try {
    const { fromAccountId, toAccountId, amount, description } = req.body;

    if (!fromAccountId || !toAccountId || !amount) {
      return res.status(400).json({ error: 'Missing required fields: fromAccountId, toAccountId, amount' });
    }

    // FIXME: No validation on amount — should check:
    // 1. Amount is a positive integer (cents)
    // 2. Source account has sufficient balance
    // 3. Amount is within transfer limits
    // For now we just process it

    const transfer = await transferService.createTransfer(
      fromAccountId,
      toAccountId,
      amount,
      description
    );

    res.status(201).json(transfer);
  } catch (err: any) {
    // Missing proper error code handling
    const status = err.message.includes('not found') ? 404 : 400;
    res.status(status).json({ error: err.message });
  }
});

export { router as transfersRouter };
