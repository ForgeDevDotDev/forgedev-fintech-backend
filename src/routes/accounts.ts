import { Router, Request, Response } from 'express';
import { prisma } from '../models';

const router = Router();

// GET /api/accounts
router.get('/', async (req: Request, res: Response) => {
  try {
    const { userId, type } = req.query;
    const where: any = {};
    if (userId) where.userId = userId as string;
    if (type) where.type = type as string;

    const accounts = await prisma.account.findMany({
      where,
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
});

// GET /api/accounts/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const account = await prisma.account.findUnique({
      where: { id: req.params.id },
      include: { user: true, transactions: true, budgets: true },
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json(account);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch account' });
  }
});

// POST /api/accounts
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, name, iban, currency, type, initialBalance } = req.body;

    if (!userId || !name || !iban) {
      return res.status(400).json({ error: 'Missing required fields: userId, name, iban' });
    }

    const account = await prisma.account.create({
      data: {
        userId,
        name,
        iban,
        currency: currency || 'EUR',
        type: type || 'checking',
        balance: initialBalance || 0,
      },
    });

    res.status(201).json(account);
  } catch (err: any) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'IBAN already exists' });
    }
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// PUT /api/accounts/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, currency, type, isActive } = req.body;

    const account = await prisma.account.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(currency && { currency }),
        ...(type && { type }),
        ...(typeof isActive === 'boolean' && { isActive }),
      },
    });

    res.json(account);
  } catch (err: any) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.status(500).json({ error: 'Failed to update account' });
  }
});

// DELETE /api/accounts/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.account.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err: any) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// GET /api/accounts/:id/balance
router.get('/:id/balance', async (req: Request, res: Response) => {
  try {
    const account = await prisma.account.findUnique({
      where: { id: req.params.id },
      select: { balance: true, currency: true },
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json({
      balance: account.balance,
      currency: account.currency,
      // FIXME: Should also return formatted amount
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

export { router as accountsRouter };
