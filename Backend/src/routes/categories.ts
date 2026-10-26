import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { prisma } from '../config/prisma.js';

const router = Router();

router.get('/', async (_req, res) => {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  });

  res.json(categories);
});

router.get('/:idOrSlug', async (req, res) => {
  const id = Number(req.params.idOrSlug);
  const category = await prisma.category.findFirst({
    where: Number.isInteger(id) && id > 0 ? { id } : { slug: req.params.idOrSlug },
  });

  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  res.json(category);
});

router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  const { name, slug, description } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ message: 'Name and slug are required' });
  }

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      description,
    },
  });

  res.status(201).json(category);
});

router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { name, slug, description } = req.body;
  const id = Number(req.params.id);

  const existingCategory = await prisma.category.findUnique({ where: { id } });

  if (!existingCategory) {
    return res.status(404).json({ message: 'Category not found' });
  }

  const category = await prisma.category.update({
    where: { id },
    data: {
      name,
      slug,
      description,
    },
  });

  res.json(category);
});

router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);

  const existingCategory = await prisma.category.findUnique({ where: { id } });

  if (!existingCategory) {
    return res.status(404).json({ message: 'Category not found' });
  }

  await prisma.category.delete({ where: { id } });

  res.json({ message: 'Category deleted successfully' });
});

export default router;
