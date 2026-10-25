import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { prisma } from '../config/prisma.js';

const router = Router();

router.get('/', authenticateToken, requireAdmin, async (_req, res) => {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  res.json(products);
});

router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: Number(req.params.id) },
    include: { category: true },
  });

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json(product);
});

router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  const {
    name,
    slug,
    description,
    price,
    stock,
    imageUrl,
    images,
    specifications,
    features,
    capacity,
    energyRating,
    warranty,
    isFeatured,
    categoryId,
  } = req.body;

  if (!name || !slug || price === undefined) {
    return res.status(400).json({ message: 'Name, slug, and price are required' });
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description,
      price: Number(price),
      stock: Number(stock || 0),
      imageUrl,
      images: Array.isArray(images) ? images : [],
      specifications: Array.isArray(specifications) ? specifications : [],
      features: Array.isArray(features) ? features : [],
      capacity,
      energyRating,
      warranty,
      isFeatured: Boolean(isFeatured),
      categoryId: categoryId ? Number(categoryId) : null,
    },
    include: { category: true },
  });

  res.status(201).json(product);
});

router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const {
    name,
    slug,
    description,
    price,
    stock,
    imageUrl,
    images,
    specifications,
    features,
    capacity,
    energyRating,
    warranty,
    isFeatured,
    categoryId,
  } = req.body;
  const id = Number(req.params.id);

  const existingProduct = await prisma.product.findUnique({ where: { id } });

  if (!existingProduct) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      slug,
      description,
      price: price !== undefined ? Number(price) : undefined,
      stock: stock !== undefined ? Number(stock) : undefined,
      imageUrl,
      images: images !== undefined ? (Array.isArray(images) ? images : []) : undefined,
      specifications: specifications !== undefined ? (Array.isArray(specifications) ? specifications : []) : undefined,
      features: features !== undefined ? (Array.isArray(features) ? features : []) : undefined,
      capacity,
      energyRating,
      warranty,
      isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : undefined,
      categoryId: categoryId !== undefined ? (categoryId ? Number(categoryId) : null) : undefined,
    },
    include: { category: true },
  });

  res.json(product);
});

router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);

  const existingProduct = await prisma.product.findUnique({ where: { id } });

  if (!existingProduct) {
    return res.status(404).json({ message: 'Product not found' });
  }

  await prisma.product.delete({ where: { id } });

  res.json({ message: 'Product deleted successfully' });
});

export default router;
