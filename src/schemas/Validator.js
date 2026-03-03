// src/schemas/index.js
import { z } from 'zod';

export const ProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().min(1, 'Description is required').max(500),
  longDesc: z.string().optional(),
  tags: z.array(z.string()).default([]),
  githubUrl: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
});

export const ProjectUpdateSchema = ProjectSchema.partial();

export const SkillSchema = z.object({
  name: z.string().min(1, 'Name required').max(50),
  level: z.number().int().min(0).max(100),
  category: z.enum(['frontend', 'backend', 'tools', 'design', 'database', 'devops', 'other']),
  icon: z.string().optional(),
});

export const ExperienceSchema = z.object({
  company: z.string().min(1).max(100),
  role: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  startDate: z.string().datetime().or(z.string().pipe(z.coerce.date()).transform(d => d.toISOString())),
  endDate: z.string().datetime().optional().or(z.string().pipe(z.coerce.date()).transform(d => d.toISOString())).optional(),
  current: z.boolean().default(false),
  location: z.string().optional(),
});

export const ContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  subject: z.string().max(200).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

export const ProfileSchema = z.object({
  name: z.string().min(1).max(100),
  title: z.string().min(1).max(150),
  bio: z.string().min(1).max(2000),
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string().optional(),
  github: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  cvUrl: z.string().url().optional().or(z.literal('')),
});
