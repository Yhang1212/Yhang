import { Router } from 'express';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth.js';
import { prisma } from '../config/prisma.js';
import bcrypt from 'bcryptjs';

const router = Router();
const publicUser = { id: true, email: true, name: true, role: true, createdAt: true } as const;
const validRole = (role: unknown) => role === undefined || role === 'ADMIN' || role === 'USER';

router.get('/', authenticateToken, requireAdmin, async (_req, res) => {
  res.json(await prisma.user.findMany({ select: publicUser, orderBy: { createdAt: 'desc' } }));
});
router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: Number(req.params.id) }, select: publicUser });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  const { email, name, password, role } = req.body;
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ message: 'A valid email and a password of at least 8 characters are required' });
  }
  if (!validRole(role)) return res.status(400).json({ message: 'Role must be USER or ADMIN' });
  const normalizedEmail = email.trim().toLowerCase();
  if (await prisma.user.findUnique({ where: { email: normalizedEmail } })) return res.status(409).json({ message: 'User already exists' });
  const user = await prisma.user.create({ data: { email: normalizedEmail, name, passwordHash: await bcrypt.hash(password, 12), role: role || 'USER' }, select: publicUser });
  res.status(201).json(user);
});
router.put('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ message: 'Invalid user id' });
  const { email, name, password, role } = req.body;
  if (!validRole(role)) return res.status(400).json({ message: 'Role must be USER or ADMIN' });
  if (id === req.user?.id && role === 'USER') return res.status(400).json({ message: 'You cannot remove your own administrator access' });
  if (email !== undefined && (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return res.status(400).json({ message: 'Enter a valid email address' });
  if (password !== undefined && password !== '' && (typeof password !== 'string' || password.length < 8)) return res.status(400).json({ message: 'Password must be at least 8 characters' });
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ message: 'User not found' });
  if (email && email.trim().toLowerCase() !== existing.email && await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } })) return res.status(409).json({ message: 'Email already exists' });
  const user = await prisma.user.update({ where: { id }, data: { ...(email !== undefined ? { email: email.trim().toLowerCase() } : {}), ...(name !== undefined ? { name } : {}), ...(role !== undefined ? { role } : {}), ...(password ? { passwordHash: await bcrypt.hash(password, 12) } : {}) }, select: publicUser });
  res.json(user);
});
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ message: 'Invalid user id' });
  if (id === req.user?.id) return res.status(400).json({ message: 'You cannot delete your own administrator account' });
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ message: 'User not found' });
  await prisma.user.delete({ where: { id } });
  res.json({ message: 'User deleted successfully' });
});
export default router;
