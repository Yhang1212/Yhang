import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { prisma } from '../config/prisma.js';

const router = Router();

router.get('/stats', authenticateToken, requireAdmin, async (_req, res) => {
  const [totalProducts, totalCategories, totalMessages, totalUsers, featuredProducts] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.contactMessage.count(),
    prisma.user.count(),
    prisma.product.count({ where: { isFeatured: true } }),
  ]);

  res.json({
    totalProducts,
    totalCategories,
    totalMessages,
    totalUsers,
    featuredProducts,
  });
});

export default router;
