import { Router, Request, Response } from 'express';
import { prisma } from '../models';
import { validateAmount } from '../utils';
import { auditService } from '../services/auditService';

const router = Router();

// GET /api/transactions
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const accountId = req.query.accountId as string;
    const categoryId = req.query.categoryId as string;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    const status = req.query.status as string;

    const where: any = {};
    if (accountId) where.accountId = accountId;
    if (categoryId) where.categoryId = categoryId;
    if (status) where.status = status;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const total = await prisma.transaction.count({ where });

    // BUG: off-by-one in pagination — skip should be (page - 1) * limit
    // This skips one too many records on page 1
    const skip = page * limit;
    const items = await prisma.transaction.findMany({
      where,
      skip,
      take: limit,
      include: { account: true, category: true },
      orderBy: { date: 'desc' },
    });

    res.json({
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// GET /api/transactions/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: req.params.id },
      include: { account: true, category: true },
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (err) {
    // Missing error handling here — should log the error
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

// POST /api/transactions
router.post('/', async (req: Request, res: Response) => {
  try {
    const { accountId, amount, description, categoryId, merchant, status, date } = req.body;

    if (!accountId || !amount || !description) {
      return res.status(400).json({ error: 'Missing required fields: accountId, amount, description' });
    }

    // TODO: Validate amount is integer cents
    if (!validateAmount(Math.abs(amount))) {
      return res.status(400).json({ error: 'Amount must be a positive integer (in cents)' });
    }

    // Verify account exists
    const account = await prisma.account.findUnique({ where: { id: accountId } });
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const transaction = await prisma.transaction.create({
      data: {
        accountId,
        amount,
        description,
        categoryId: categoryId || null,
        merchant: merchant || null,
        status: status || 'completed',
        date: date ? new Date(date) : new Date(),
      },
      include: { account: true, category: true },
    });

    // Update account balance
    await prisma.account.update({
      where: { id: accountId },
      data: { balance: { increment: amount } },
    });

    await auditService.log({
      action: 'transaction.create',
      entity: 'transaction',
      entityId: transaction.id,
      metadata: JSON.stringify({ accountId, amount, description }),
    });

    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// PUT /api/transactions/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { description, categoryId, merchant, status } = req.body;

    const transaction = await prisma.transaction.update({
      where: { id: req.params.id },
      data: {
        ...(description && { description }),
        ...(categoryId !== undefined && { categoryId }),
        ...(merchant !== undefined && { merchant }),
        ...(status && { status }),
      },
      include: { account: true, category: true },
    });

    res.json(transaction);
  } catch (err: any) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

// DELETE /api/transactions/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const transaction = await prisma.transaction.findUnique({ where: { id: req.params.id } });
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Reverse the balance effect
    await prisma.account.update({
      where: { id: transaction.accountId },
      data: { balance: { decrement: transaction.amount } },
    });

    await prisma.transaction.delete({ where: { id: req.params.id } });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

export { router as transactionsRouter };
