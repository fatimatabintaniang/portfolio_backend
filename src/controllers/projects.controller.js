// src/controllers/projects.controller.js
import prisma from '../config/prisma.js';
import { uploadImage, deleteImage } from '../config/cloudinary.js';
import { ProjectSchema, ProjectUpdateSchema } from '../schemas/Validator.js';

export const getAllProjects = async (c) => {
  try {
    const { featured, tag } = c.req.query();
    const where = {};
    if (featured === 'true') where.featured = true;
    if (tag) where.tags = { has: tag };

    const projects = await prisma.project.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
    });
    return c.json({ success: true, data: projects });
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
};

export const getProjectById = async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
if (isNaN(id)) return c.json({ success: false, error: 'Invalid ID' }, 400);
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return c.json({ success: false, error: 'Project not found' }, 404);
    return c.json({ success: true, data: project });
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
};

export const createProject = async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body['image'];

    // Extraire l'image du reste des champs
    const { image, ...fields } = body;

    // Convertir les types (parseBody retourne tout en string)
    if (fields.featured !== undefined) fields.featured = fields.featured === 'true';
    if (fields.order    !== undefined) fields.order    = parseInt(fields.order);
    if (fields.tags) {
      try {
        fields.tags = JSON.parse(fields.tags);           // ["React","Node.js"]
      } catch {
        fields.tags = String(fields.tags).split(',').map(t => t.trim()).filter(Boolean); // "React,Node.js"
      }
    }

    const parsed = ProjectSchema.safeParse(fields);
    if (!parsed.success) {
      return c.json({ success: false, errors: parsed.error.flatten() }, 400);
    }

    // Upload image si présente
    let imageData = {};
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const base64 = `data:${file.type};base64,${Buffer.from(arrayBuffer).toString('base64')}`;
      const { url, publicId } = await uploadImage(base64, 'portfolio/projects');
      imageData = { imageUrl: url, imagePublicId: publicId };
    }

    const project = await prisma.project.create({
      data: { ...parsed.data, ...imageData },
    });

    return c.json({ success: true, data: project }, 201);
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
};

export const updateProject = async (c) => {
  try {
const id = parseInt(c.req.param('id'));
if (isNaN(id)) return c.json({ success: false, error: 'Invalid ID' }, 400);    if (isNaN(id)) return c.json({ success: false, error: 'Invalid ID' }, 400);
    const body = await c.req.json();
    const parsed = ProjectUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ success: false, errors: parsed.error.flatten() }, 400);
    }
    const project = await prisma.project.update({ where: { id }, data: parsed.data });
    return c.json({ success: true, data: project });
  } catch (err) {
    if (err.code === 'P2025') return c.json({ success: false, error: 'Project not found' }, 404);
    return c.json({ success: false, error: err.message }, 500);
  }
};

export const deleteProject = async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    if (isNaN(id)) return c.json({ success: false, error: 'Invalid ID' }, 400);
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return c.json({ success: false, error: 'Not found' }, 404);
    if (project.imagePublicId) await deleteImage(project.imagePublicId);
    await prisma.project.delete({ where: { id } });
    return c.json({ success: true, message: 'Project deleted' });
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
};

export const uploadProjectImage = async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    if (isNaN(id)) return c.json({ success: false, error: 'Invalid ID' }, 400);
    const body = await c.req.parseBody();
    const file = body['image'];
    if (!file) return c.json({ success: false, error: 'No image provided' }, 400);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (existing?.imagePublicId) await deleteImage(existing.imagePublicId);

    const { url, publicId } = await uploadImage(base64, 'portfolio/projects');
    const project = await prisma.project.update({
      where: { id },
      data: { imageUrl: url, imagePublicId: publicId },
    });
    return c.json({ success: true, data: project });
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
};
