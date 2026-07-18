import { Router, Request, Response } from 'express';
import { prisma } from '../models';

const router = Router();

// GET /api/categories
router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { transactions: true, budgets: true } } },
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /api/categories/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: req.params.id },
      include: { transactions: true, budgets: true },
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

// POST /api/categories
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, icon, color } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Missing required field: name' });
    }

    const category = await prisma.category.create({
      data: { name, icon, color },
    });

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// PUT /api/categories/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, icon, color } = req.body;

    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(icon !== undefined && { icon }),
        ...(color !== undefined && { color }),
      },
    });

    res.json(category);
  } catch (err: any) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// DELETE /api/categories/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err: any) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Category not found' });
    }
    // FIXME: Should handle P2003 (foreign key constraint) when category has transactions
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export { router as categoriesRouter };
