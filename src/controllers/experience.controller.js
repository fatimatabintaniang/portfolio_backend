// src/controllers/experience.controller.js
import prisma from '../config/prisma.js';
import { ExperienceSchema } from '../schemas/Validator.js';

export const getAllExperiences = async (c) => {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: [{ current: 'desc' }, { startDate: 'desc' }],
    });
    return c.json({ success: true, data: experiences });
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
};

export const createExperience = async (c) => {
  try {
    const body = await c.req.json();
    const parsed = ExperienceSchema.safeParse(body);
    if (!parsed.success) return c.json({ success: false, errors: parsed.error.flatten() }, 400);
    const exp = await prisma.experience.create({ data: parsed.data });
    return c.json({ success: true, data: exp }, 201);
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
};  



export const updateExperience = async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
if (isNaN(id)) return c.json({ success: false, error: 'Invalid ID' }, 400);
    const body = await c.req.json();
    const parsed = ExperienceSchema.partial().safeParse(body);
    if (!parsed.success) return c.json({ success: false, errors: parsed.error.flatten() }, 400);
    const exp = await prisma.experience.update({ where: { id }, data: parsed.data });
    return c.json({ success: true, data: exp });
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
};

export const deleteExperience = async (c) => {
  try {
   const id = parseInt(c.req.param('id'));
if (isNaN(id)) return c.json({ success: false, error: 'Invalid ID' }, 400);
    await prisma.experience.delete({ where: { id } });
    return c.json({ success: true, message: 'Experience deleted' });
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
};
