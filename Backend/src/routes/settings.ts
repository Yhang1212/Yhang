import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { prisma } from '../config/prisma.js';

const router = Router();

router.get('/', async (_req, res) => {
  const settings = await prisma.companySetting.findFirst();

  if (!settings) {
    const created = await prisma.companySetting.create({ data: {} });
    return res.json(created);
  }

  res.json(settings);
});

router.put('/', authenticateToken, requireAdmin, async (req, res) => {
  const {
    companyName,
    logoUrl,
    phone,
    email,
    address,
    facebookUrl,
    instagramUrl,
    linkedinUrl,
    youtubeUrl,
    homepageBannerTitle,
    homepageBannerSubtitle,
    homepageBannerImageUrl,
  } = req.body;

  const existing = await prisma.companySetting.findFirst();

  if (existing) {
    const updated = await prisma.companySetting.update({
      where: { id: existing.id },
      data: {
        companyName,
        logoUrl,
        phone,
        email,
        address,
        facebookUrl,
        instagramUrl,
        linkedinUrl,
        youtubeUrl,
        homepageBannerTitle,
        homepageBannerSubtitle,
        homepageBannerImageUrl,
      },
    });

    return res.json(updated);
  }

  const created = await prisma.companySetting.create({
    data: {
      companyName,
      logoUrl,
      phone,
      email,
      address,
      facebookUrl,
      instagramUrl,
      linkedinUrl,
      youtubeUrl,
      homepageBannerTitle,
      homepageBannerSubtitle,
      homepageBannerImageUrl,
    },
  });

  res.status(201).json(created);
});

export default router;
