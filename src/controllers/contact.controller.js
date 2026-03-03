// src/controllers/contact.controller.js
import prisma from '../config/prisma.js';
import { ContactSchema } from '../schemas/Validator.js';

export const submitContact = async (c) => {
  try {
    const body = await c.req.json();
    const parsed = ContactSchema.safeParse(body);
    if (!parsed.success) return c.json({ success: false, errors: parsed.error.flatten() }, 400);
    const contact = await prisma.contact.create({ data: parsed.data });
    return c.json({ success: true, data: contact, message: 'Message sent successfully!' }, 201);
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
};

export const getAllContacts = async (c) => {
  try {
    const contacts = await prisma.contact.findMany({ orderBy: { createdAt: 'desc' } });
    return c.json({ success: true, data: contacts });
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
};

export const markContactRead = async (c) => {
  try {
const id = parseInt(c.req.param('id'));
if (isNaN(id)) return c.json({ success: false, error: 'Invalid ID' }, 400);
    const contact = await prisma.contact.update({ where: { id }, data: { read: true } });
    return c.json({ success: true, data: contact });
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
};
