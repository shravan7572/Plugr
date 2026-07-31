import { transporter } from "../transporter/transporter.js";

interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export const sendEmail = async ({ to, subject, text, html }: SendEmailOptions) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Plugr App" <noreply@example.com>',
    to,
    subject,
    text,
    html,
  };

  return transporter.sendMail(mailOptions);
};

/*
// Example Express router testing endpoint:
//
// import express from "express";
// import { sendEmail } from "./emailsource/sendEmail.js";
//
// const router = express.Router();
//
// router.post("/send-test-email", async (req, res) => {
//   const { to, subject, text, html } = req.body;
//   try {
//     const info = await sendEmail({ to, subject, text, html });
//     res.status(200).json({ success: true, messageId: info.messageId });
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Example Contact Form background notification:
//
// app.post("/api/contact", async (req, res) => {
//   const { name, email, message } = req.body;
//
//   // Send confirmation back to user immediately
//   res.status(200).json({ success: true, message: "Message received" });
//
//   // Dispatch notification email in background
//   sendEmail({
//     to: "admin@example.com", // profile owner email
//     subject: `New message from ${name}`,
//     text: `New contact message from ${name} (${email}): ${message}`,
//     html: `
//       <h2>New Contact Message</h2>
//       <p><strong>Name:</strong> ${name}</p>
//       <p><strong>Email:</strong> ${email}</p>
//       <hr />
//       <p><strong>Message:</strong></p>
//       <p>${message}</p>
//     `,
//   }).catch(err => {
//     console.error("Failed to send contact email in background:", err);
//   });
// });
*/
