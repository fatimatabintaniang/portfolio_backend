// src/controllers/skills.controller.js
import prisma from '../config/prisma.js';
import { SkillSchema } from '../schemas/Validator.js';

export const getAllSkills = async (c) => {
  try {
    const { category } = c.req.query();
    const where = category ? { category } : {};
    const skills = await prisma.skill.findMany({ where, orderBy: { level: 'desc' } });
    return c.json({ success: true, data: skills });
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
};

export const createSkill = async (c) => {
  try {
    const body = await c.req.json();
    const parsed = SkillSchema.safeParse(body);
    if (!parsed.success) return c.json({ success: false, errors: parsed.error.flatten() }, 400);
    const skill = await prisma.skill.create({ data: parsed.data });
    return c.json({ success: true, data: skill }, 201);
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
};

export const updateSkill = async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
if (isNaN(id)) return c.json({ success: false, error: 'Invalid ID' }, 400);
    const body = await c.req.json();
    const parsed = SkillSchema.partial().safeParse(body);
    if (!parsed.success) return c.json({ success: false, errors: parsed.error.flatten() }, 400);
    const skill = await prisma.skill.update({ where: { id }, data: parsed.data });
    return c.json({ success: true, data: skill });
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
};

export const deleteSkill = async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
if (isNaN(id)) return c.json({ success: false, error: 'Invalid ID' }, 400);
    await prisma.skill.delete({ where: { id } });
    return c.json({ success: true, message: 'Skill deleted' });
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
};
