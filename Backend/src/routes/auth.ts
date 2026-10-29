import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { OAuth2Client } from 'google-auth-library';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth as getFirebaseAdminAuth } from 'firebase-admin/auth';
import { prisma } from '../config/prisma.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'dev-refresh-secret';
const googleClient = new OAuth2Client();
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false, message: { message: 'Too many attempts. Please wait and try again.' } });
const providerLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false, message: { message: 'Too many verification attempts. Please wait before trying again.' } });

type SessionUser = { id: number; email: string | null; role: string; name?: string | null; isEmailVerified?: boolean; provider?: string; phone?: string | null };
const createAccessToken = (user: SessionUser) => jwt.sign({ id: user.id, ...(user.email ? { email: user.email } : {}), role: user.role }, JWT_SECRET, { expiresIn: '15m' });
const createRefreshToken = (user: SessionUser) => jwt.sign({ id: user.id, ...(user.email ? { email: user.email } : {}), role: user.role }, REFRESH_SECRET, { expiresIn: '7d' });
const issueTokens = (user: SessionUser) => ({ accessToken: createAccessToken(user), refreshToken: createRefreshToken(user) });
const sessionFor = (user: SessionUser) => ({ ...issueTokens(user), user: { id: user.id, email: user.email, role: user.role, name: user.name || null, provider: user.provider, phone: user.phone || null, isEmailVerified: Boolean(user.isEmailVerified) } });
const isDuplicate = (error: unknown) => typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002';

function firebaseAdminAuth() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (!projectId || !clientEmail || !privateKey) return null;
  const appName = 'hailang-phone-auth';
  const app = getApps().find((item) => item.name === appName) || initializeApp({ credential: cert({ projectId, clientEmail, privateKey }), projectId }, appName);
  return getFirebaseAdminAuth(app);
}

router.get('/providers', (_req, res) => res.set('Cache-Control', 'no-store').json({ google: Boolean(process.env.GOOGLE_CLIENT_ID), phone: Boolean(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) }));

router.post('/register', authLimiter, async (req, res) => {
  const { email: rawEmail, password, name: rawName } = req.body || {};
  const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';
  const name = typeof rawName === 'string' ? rawName.trim() : '';
  if (!name || name.length < 2 || name.length > 100) return res.status(400).json({ message: 'Enter your name (2 to 100 characters).' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return res.status(400).json({ message: 'Enter a valid email address.' });
  if (typeof password !== 'string' || password.length < 8 || password.length > 128) return res.status(400).json({ message: 'Password must be at least 8 characters.' });
  if (await prisma.user.findUnique({ where: { email } })) return res.status(409).json({ message: 'An account with this email already exists.' });
  try {
    const user = await prisma.user.create({ data: { email, name, passwordHash: await bcrypt.hash(password, 12), role: 'USER', provider: 'EMAIL', isEmailVerified: false } });
    return res.status(201).json(sessionFor(user));
  } catch (error) {
    if (isDuplicate(error)) return res.status(409).json({ message: 'An account with this email already exists.' });
    throw error;
  }
});

router.post('/google', providerLimiter, async (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) return res.status(503).json({ message: 'Google sign-in is not configured on this server.' });
  const idToken = req.body?.credential;
  if (typeof idToken !== 'string' || idToken.length > 10000) return res.status(400).json({ message: 'Google sign-in did not return a valid credential.' });
  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({ idToken, audience: clientId });
    payload = ticket.getPayload();
  } catch {
    return res.status(401).json({ message: 'Google could not verify this sign-in. Please try again.' });
  }
  const email = payload?.email?.trim().toLowerCase();
  const subject = payload?.sub;
  if (!email || !subject || payload?.email_verified !== true) return res.status(401).json({ message: 'Google must provide a verified email address.' });
  try {
    let user = await prisma.user.findUnique({ where: { provider_providerId: { provider: 'GOOGLE', providerId: subject } } });
    if (!user) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        if (existing.provider === 'GOOGLE' && existing.providerId && existing.providerId !== subject) return res.status(409).json({ message: 'This email is linked to a different Google identity.' });
        user = await prisma.user.update({ where: { id: existing.id }, data: { provider: 'GOOGLE', providerId: subject, isEmailVerified: true, name: existing.name || payload?.name || null } });
      } else {
        user = await prisma.user.create({ data: { email, name: payload?.name || null, passwordHash: '', role: 'USER', provider: 'GOOGLE', providerId: subject, isEmailVerified: true } });
      }
    }
    return res.json(sessionFor(user));
  } catch (error) {
    if (isDuplicate(error)) return res.status(409).json({ message: 'This Google account is already linked to another HAILANG account.' });
    throw error;
  }
});

router.post('/phone', providerLimiter, async (req, res) => {
  const firebase = firebaseAdminAuth();
  if (!firebase) return res.status(503).json({ message: 'Phone sign-in is not configured on this server.' });
  const idToken = req.body?.idToken;
  if (typeof idToken !== 'string' || idToken.length > 10000) return res.status(400).json({ message: 'Phone verification did not return a valid credential.' });
  let decoded;
  try { decoded = await firebase.verifyIdToken(idToken, true); }
  catch { return res.status(401).json({ message: 'Phone verification expired or could not be confirmed. Request a new code.' }); }
  const phone = decoded.phone_number;
  if (!decoded.uid || !phone || !/^\+855[1-9][0-9]{7,8}$/.test(phone)) return res.status(400).json({ message: 'Use a verified Cambodia phone number beginning with +855.' });
  try {
    let user = await prisma.user.findUnique({ where: { provider_providerId: { provider: 'PHONE', providerId: decoded.uid } } });
    if (user && user.phone !== phone) user = await prisma.user.update({ where: { id: user.id }, data: { phone } });
    if (!user) {
      const numberOwner = await prisma.user.findUnique({ where: { phone } });
      if (numberOwner) return res.status(409).json({ message: 'This phone number is linked to another account. Contact HAILANG support to update it.' });
      user = await prisma.user.create({ data: { email: null, name: null, passwordHash: '', role: 'USER', provider: 'PHONE', providerId: decoded.uid, phone, isEmailVerified: false } });
    }
    return res.json(sessionFor(user));
  } catch (error) {
    if (isDuplicate(error)) return res.status(409).json({ message: 'This phone number is already linked to an account.' });
    throw error;
  }
});

router.post('/verify-email', async (req, res) => {
  const token = req.body?.token;
  if (!token) return res.status(400).json({ message: 'Verification token is required' });
  const user = await prisma.user.findFirst({ where: { emailVerificationToken: token } });
  if (!user) return res.status(404).json({ message: 'Invalid verification token' });
  if (user.emailVerificationExpires && user.emailVerificationExpires < new Date()) return res.status(410).json({ message: 'Verification token expired' });
  await prisma.user.update({ where: { id: user.id }, data: { isEmailVerified: true, emailVerificationToken: null, emailVerificationExpires: null } });
  res.json({ message: 'Email verified successfully' });
});

router.post('/forgot-password', (_req, res) => {
  res.status(503).json({ message: 'Password recovery is unavailable because email delivery is not configured.' });
});

router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body || {};
  if (!token || typeof password !== 'string' || password.length < 8) return res.status(400).json({ message: 'A reset token and a password of at least 8 characters are required' });
  const user = await prisma.user.findFirst({ where: { passwordResetToken: token } });
  if (!user) return res.status(404).json({ message: 'Invalid reset token' });
  if (user.passwordResetExpires && user.passwordResetExpires < new Date()) return res.status(410).json({ message: 'Reset token expired' });
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(password, 12), passwordResetToken: null, passwordResetExpires: null } });
  res.json({ message: 'Password reset successfully' });
});

router.post('/social-login', (_req, res) => res.status(410).json({ message: 'Use the configured Google or phone sign-in endpoint.' }));

router.post('/login', authLimiter, async (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = req.body?.password;
  if (!email || typeof password !== 'string') return res.status(400).json({ message: 'Email and password are required' });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.passwordHash) return res.status(401).json({ message: 'Invalid credentials' });
  if (!await bcrypt.compare(password, user.passwordHash)) return res.status(401).json({ message: 'Invalid credentials' });
  res.json(sessionFor(user));
});

router.post('/refresh', async (req, res) => {
  const refreshToken = req.body?.refreshToken;
  if (typeof refreshToken !== 'string') return res.status(401).json({ message: 'Refresh token required' });
  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET) as { id: number };
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) return res.status(401).json({ message: 'Account no longer exists' });
    res.json({ accessToken: createAccessToken(user) });
  } catch {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
});

router.post('/logout', authenticateToken, (_req: AuthRequest, res) => res.json({ message: 'Logged out successfully' }));

router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user: { id: user.id, email: user.email, role: user.role, name: user.name, phone: user.phone, provider: user.provider, isEmailVerified: user.isEmailVerified } });
});

router.put('/profile', authenticateToken, async (req: AuthRequest, res) => {
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : undefined;
  const phone = typeof req.body?.phone === 'string' ? req.body.phone.trim() : undefined;
  if (phone !== undefined) return res.status(400).json({ message: 'Phone number changes require Firebase verification.' });
  const user = await prisma.user.update({ where: { id: req.user!.id }, data: { ...(name !== undefined ? { name } : {}), ...(phone !== undefined ? { phone } : {}) } });
  res.json({ user: { id: user.id, email: user.email, role: user.role, name: user.name, phone: user.phone, provider: user.provider, isEmailVerified: user.isEmailVerified } });
});

router.put('/change-password', authenticateToken, async (req: AuthRequest, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (typeof currentPassword !== 'string' || typeof newPassword !== 'string' || newPassword.length < 8) return res.status(400).json({ message: 'Current password and a new password of at least 8 characters are required' });
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (!user.passwordHash || !await bcrypt.compare(currentPassword, user.passwordHash)) return res.status(401).json({ message: 'Current password is incorrect' });
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(newPassword, 12) } });
  res.json({ message: 'Password changed successfully' });
});

export default router;
