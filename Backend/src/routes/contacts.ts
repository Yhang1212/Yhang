import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { prisma } from '../config/prisma.js';

const router = Router();

router.post('/', async (req, res) => {
  const body = req.body || {};
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : undefined;
  const subject = typeof body.subject === 'string' ? body.subject.trim() : undefined;
  const message = typeof body.message === 'string' ? body.message : '';

  if (body.phone != null && typeof body.phone !== 'string') {
    return res.status(400).json({ message: 'Enter a valid phone number.' });
  }
  if (body.subject != null && typeof body.subject !== 'string') {
    return res.status(400).json({ message: 'Enter a valid subject.' });
  }
  if (!name || name.length > 120) {
    return res.status(400).json({ message: 'Name is required and must be 120 characters or fewer.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return res.status(400).json({ message: 'Enter a valid email address.' });
  }
  if (phone !== undefined) {
    const digits = phone.replace(/\D/g, '');
    if (phone.length > 40 || (phone && (!/^\+?[0-9().\s-]+$/.test(phone) || digits.length < 7 || digits.length > 15))) {
      return res.status(400).json({ message: 'Enter a valid phone number.' });
    }
  }
  if (subject && subject.length > 180) {
    return res.status(400).json({ message: 'Subject must be 180 characters or fewer.' });
  }
  if (!message.trim() || message.length > 4000) {
    return res.status(400).json({ message: 'Message is required and must be 4,000 characters or fewer.' });
  }

  const contactMessage = await prisma.contactMessage.create({
    data: {
      name,
      email,
      phone,
      subject,
      message,
    },
  });

  res.status(201).json(contactMessage);
});

router.get('/', authenticateToken, requireAdmin, async (_req, res) => {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });

  res.json(messages);
});

router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);

  const existingMessage = await prisma.contactMessage.findUnique({ where: { id } });

  if (!existingMessage) {
    return res.status(404).json({ message: 'Message not found' });
  }

  await prisma.contactMessage.delete({ where: { id } });

  res.json({ message: 'Message deleted successfully' });
});

router.patch('/:id/read', authenticateToken, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);

  const existingMessage = await prisma.contactMessage.findUnique({ where: { id } });

  if (!existingMessage) {
    return res.status(404).json({ message: 'Message not found' });
  }

  const updatedMessage = await prisma.contactMessage.update({
    where: { id },
    data: { isRead: true },
  });

  res.json(updatedMessage);
});

export default router;
