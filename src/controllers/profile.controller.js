// src/controllers/profile.controller.js
import prisma from '../config/prisma.js';
import { uploadImage, deleteImage } from '../config/cloudinary.js';
import { ProfileSchema } from '../schemas/Validator.js';

export const getProfile = async (c) => {
  try {
    const profile = await prisma.profile.findFirst();
    if (!profile) return c.json({ success: false, error: 'Profile not found' }, 404);
    return c.json({ success: true, data: profile });
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
};

export const upsertProfile = async (c) => {
  try {
    const body = await c.req.json();
    const parsed = ProfileSchema.safeParse(body);
    if (!parsed.success) return c.json({ success: false, errors: parsed.error.flatten() }, 400);
    
    const existing = await prisma.profile.findFirst();
    let profile;
    if (existing) {
      profile = await prisma.profile.update({ where: { id: existing.id }, data: parsed.data });
    } else {
      profile = await prisma.profile.create({ data: parsed.data });
    }
    return c.json({ success: true, data: profile });
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
};

export const uploadProfileImage = async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body['image'];
    if (!file) return c.json({ success: false, error: 'No image provided' }, 400);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    const existing = await prisma.profile.findFirst();
    if (existing?.imagePublicId) await deleteImage(existing.imagePublicId);

    const { url, publicId } = await uploadImage(base64, 'portfolio/profile');
    
    let profile;
    if (existing) {
      profile = await prisma.profile.update({
        where: { id: existing.id },
        data: { imageUrl: url, imagePublicId: publicId },
      });
    } else {
      profile = await prisma.profile.create({
        data: { name: 'My Portfolio', title: 'Developer', bio: '', email: '', imageUrl: url, imagePublicId: publicId }
      });
    }
    return c.json({ success: true, data: profile });
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
};
