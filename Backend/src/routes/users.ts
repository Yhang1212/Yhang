import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { prisma } from '../config/prisma.js';
import bcrypt from 'bcryptjs';

const router = Router();

router.get('/', authenticateToken, requireAdmin, async (_req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  res.json(users);
});

router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.params.id) },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
});

router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  const { email, name, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash: await bcrypt.hash(password, 10),
      role: role || 'ADMIN',
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  res.status(201).json(user);
});

router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { email, name, password, role } = req.body;
  const id = Number(req.params.id);

  const existingUser = await prisma.user.findUnique({ where: { id } });

  if (!existingUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      email,
      name,
      role,
      ...(password ? { passwordHash: await bcrypt.hash(password, 10) } : {}),
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  res.json(updatedUser);
});

router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);

  const existingUser = await prisma.user.findUnique({ where: { id } });

  if (!existingUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  await prisma.user.delete({ where: { id } });

  res.json({ message: 'User deleted successfully' });
});

export default router;
