// src/controllers/contact.controller.js
import prisma from '../config/prisma.js';
import nodemailer from 'nodemailer';
import { ContactSchema } from '../schemas/Validator.js';

// Configuration du transporteur Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS, 
  },
});

export const submitContact = async (c) => {
  try {
    const body = await c.req.json();
    const parsed = ContactSchema.safeParse(body);
    if (!parsed.success) return c.json({ success: false, errors: parsed.error.flatten() }, 400);

    // 1. Enregistre en base
    const contact = await prisma.contact.create({ data: parsed.data });

    // 2. Envoie l'email avec Nodemailer
    try {
      const mailOptions = {
        from: `"Portfolio" <${process.env.MAIL_USER}>`,
        to: process.env.MAIL_USER,
        replyTo: parsed.data.email,
        subject: `📩 Nouveau message — ${parsed.data.subject || 'Contact Portfolio'}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:2rem;background:#f9f9f9;border-radius:8px">
            <h2 style="color:#1a1a1a;margin-bottom:1.5rem">✉️ Nouveau message de ton portfolio</h2>
            <table style="width:100%;border-collapse:collapse">
              <tr>
                <td style="padding:0.75rem;font-weight:bold;color:#555;width:120px">Nom</td>
                <td style="padding:0.75rem;color:#1a1a1a">${parsed.data.name}</td>
              </tr>
              <tr style="background:#fff">
                <td style="padding:0.75rem;font-weight:bold;color:#555">Email</td>
                <td style="padding:0.75rem;color:#1a1a1a">${parsed.data.email}</td>
              </tr>
              <tr>
                <td style="padding:0.75rem;font-weight:bold;color:#555">Sujet</td>
                <td style="padding:0.75rem;color:#1a1a1a">${parsed.data.subject || '—'}</td>
              </tr>
              <tr style="background:#fff">
                <td style="padding:0.75rem;font-weight:bold;color:#555;vertical-align:top">Message</td>
                <td style="padding:0.75rem;color:#1a1a1a;line-height:1.6">${parsed.data.message}</td>
              </tr>
            </table>
            <p style="margin-top:1.5rem;font-size:0.8rem;color:#999">
              Réponds directement à cet email pour contacter ${parsed.data.name}.
            </p>
          </div>
        `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email envoyé avec succès:', info.messageId);
      
    } catch (emailError) {
      console.error('Erreur envoi email:', emailError);
    }

    return c.json({ success: true, data: contact, message: 'Message sent successfully!' }, 201);
  } catch (err) {
    console.error('Contact error:', err);
    return c.json({ success: false, error: err.message }, 500);
  }
};