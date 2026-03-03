// src/routes/index.js
import { Hono } from 'hono';
import { getAllProjects, getProjectById, createProject, updateProject, deleteProject, uploadProjectImage } from '../controllers/projects.controller.js';
import { getAllSkills, createSkill, updateSkill, deleteSkill } from '../controllers/skills.controller.js';
import { getAllExperiences, createExperience, updateExperience, deleteExperience } from '../controllers/experience.controller.js';
import { submitContact, getAllContacts, markContactRead } from '../controllers/contact.controller.js';
import { getProfile, upsertProfile, uploadProfileImage } from '../controllers/profile.controller.js';

const api = new Hono();

// ============ PROJECTS ============
api.get('/projects', getAllProjects);
api.get('/projects/:id', getProjectById);
api.post('/projects', createProject);
api.put('/projects/:id', updateProject);
api.delete('/projects/:id', deleteProject);
api.post('/projects/:id/image', uploadProjectImage);

// ============ SKILLS ============
api.get('/skills', getAllSkills);
api.post('/skills', createSkill);
api.put('/skills/:id', updateSkill);
api.delete('/skills/:id', deleteSkill);

// ============ EXPERIENCE ============
api.get('/experiences', getAllExperiences);
api.post('/experiences', createExperience);
api.put('/experiences/:id', updateExperience);
api.delete('/experiences/:id', deleteExperience);

// ============ CONTACT ============
api.post('/contact', submitContact);
api.get('/contact', getAllContacts);
api.patch('/contact/:id/read', markContactRead);

// ============ PROFILE ============
api.get('/profile', getProfile);
api.put('/profile', upsertProfile);
api.post('/profile/image', uploadProfileImage);

export default api;
