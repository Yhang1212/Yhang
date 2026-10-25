import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../config/prisma.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { sendPasswordResetEmail, sendVerificationEmail } from '../utils/mail.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'dev-refresh-secret';

const createAccessToken = (user: { id: number; email: string; role: string }) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '15m' });

const createRefreshToken = (user: { id: number; email: string; role: string }) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role }, REFRESH_SECRET, { expiresIn: '7d' });

const issueTokens = async (user: { id: number; email: string; role: string }) => {
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);
  return { accessToken, refreshToken };
};

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

  const user = await prisma.user.create({
    data: {
      email,
      name: name || email.split('@')[0],
      passwordHash,
      role: 'USER',
      provider: 'EMAIL',
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: expiresAt,
    },
  });

  await sendVerificationEmail(email, verificationToken);

  const { accessToken, refreshToken } = await issueTokens({ id: user.id, email: user.email, role: user.role });

  res.status(201).json({
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, role: user.role, isEmailVerified: false },
  });
});

router.post('/verify-email', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Verification token is required' });
  }

  const user = await prisma.user.findFirst({ where: { emailVerificationToken: token } });
  if (!user) {
    return res.status(404).json({ message: 'Invalid verification token' });
  }

  if (user.emailVerificationExpires && user.emailVerificationExpires < new Date()) {
    return res.status(410).json({ message: 'Verification token expired' });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
    },
  });

  res.json({ message: 'Email verified successfully' });
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 2);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken: resetToken,
      passwordResetExpires: expiresAt,
    },
  });

  await sendPasswordResetEmail(email, resetToken);

  res.json({ message: 'Password reset email sent' });
});

router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: 'Token and password are required' });
  }

  const user = await prisma.user.findFirst({ where: { passwordResetToken: token } });
  if (!user) {
    return res.status(404).json({ message: 'Invalid reset token' });
  }

  if (user.passwordResetExpires && user.passwordResetExpires < new Date()) {
    return res.status(410).json({ message: 'Reset token expired' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  });

  res.json({ message: 'Password reset successfully' });
});

router.post('/social-login', (_req, res) => {
  res.status(501).json({ message: 'Social sign-in is not configured' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const { accessToken, refreshToken } = await issueTokens({ id: user.id, email: user.email, role: user.role });

  res.json({ accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role, isEmailVerified: user.isEmailVerified } });
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET) as { id: number; email: string; role: string };
    const accessToken = createAccessToken(payload);
    res.json({ accessToken });
  } catch {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
});

router.post('/logout', authenticateToken, (req: AuthRequest, res) => {
  res.json({ message: 'Logged out successfully' });
});

router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({ user: { id: user.id, email: user.email, role: user.role, name: user.name, phone: user.phone, isEmailVerified: user.isEmailVerified } });
});

router.put('/profile', authenticateToken, async (req: AuthRequest, res) => {
  const { name, phone } = req.body;

  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: { name, phone },
  });

  res.json({ user: { id: user.id, email: user.email, role: user.role, name: user.name, phone: user.phone, isEmailVerified: user.isEmailVerified } });
});

router.put('/change-password', authenticateToken, async (req: AuthRequest, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new password are required' });
  }

  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValidPassword) {
    return res.status(401).json({ message: 'Current password is incorrect' });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

  res.json({ message: 'Password changed successfully' });
});

export default router;


