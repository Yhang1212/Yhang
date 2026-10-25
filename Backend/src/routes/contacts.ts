import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { prisma } from '../config/prisma.js';

const router = Router();

router.post('/', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required' });
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
