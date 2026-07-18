import { Router, Request, Response } from 'express';
import { prisma } from '../models';

const router = Router();

// GET /api/budgets
router.get('/', async (req: Request, res: Response) => {
  try {
    const { accountId } = req.query;
    const where: any = {};
    if (accountId) where.accountId = accountId as string;

    const budgets = await prisma.budget.findMany({
      where,
      include: { account: true, category: true },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate spent amount for each budget
    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const transactions = await prisma.transaction.findMany({
          where: {
            accountId: budget.accountId,
            categoryId: budget.categoryId,
            amount: { lt: 0 },
            date: { gte: budget.startDate },
            ...(budget.endDate && { date: { lte: budget.endDate } }),
          },
        });

        const spent = transactions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
        const remaining = budget.limit - spent;
        const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;

        return {
          ...budget,
          spent,
          remaining,
          percentage: Math.round(percentage * 100) / 100,
        };
      })
    );

    res.json(budgetsWithSpent);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
});

// GET /api/budgets/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const budget = await prisma.budget.findUnique({
      where: { id: req.params.id },
      include: { account: true, category: true },
    });

    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    res.json(budget);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch budget' });
  }
});

// POST /api/budgets
router.post('/', async (req: Request, res: Response) => {
  try {
    const { accountId, categoryId, limit, period, startDate, endDate } = req.body;

    if (!accountId || !categoryId || !limit) {
      return res.status(400).json({ error: 'Missing required fields: accountId, categoryId, limit' });
    }

    // Verify account exists
    const account = await prisma.account.findUnique({ where: { id: accountId } });
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Verify category exists
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const budget = await prisma.budget.create({
      data: {
        accountId,
        categoryId,
        limit,
        period: period || 'monthly',
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
      },
      include: { account: true, category: true },
    });

    res.status(201).json(budget);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create budget' });
  }
});

// PUT /api/budgets/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { limit, period, startDate, endDate } = req.body;

    const budget = await prisma.budget.update({
      where: { id: req.params.id },
      data: {
        ...(limit !== undefined && { limit }),
        ...(period && { period }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
      },
      include: { account: true, category: true },
    });

    res.json(budget);
  } catch (err: any) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Budget not found' });
    }
    res.status(500).json({ error: 'Failed to update budget' });
  }
});

// DELETE /api/budgets/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.budget.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err: any) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Budget not found' });
    }
    res.status(500).json({ error: 'Failed to delete budget' });
  }
});

export { router as budgetsRouter };
