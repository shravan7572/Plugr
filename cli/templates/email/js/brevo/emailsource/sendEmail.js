import { apiInstance } from "../transporter/transporter.js";
import * as sibSdk from "@getbrevo/brevo";

export const sendEmail = async ({ to, subject, textContent, htmlContent, senderName, senderEmail }) => {
  const sendSmtpEmail = new sibSdk.SendSmtpEmail();
  
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = htmlContent || textContent;
  sendSmtpEmail.textContent = textContent;
  sendSmtpEmail.sender = { 
    name: senderName || process.env.BREVO_SENDER_NAME || "Plugr App", 
    email: senderEmail || process.env.BREVO_SENDER_EMAIL || "noreply@example.com" 
  };
  sendSmtpEmail.to = [{ email: to }];

  return apiInstance.sendTransacEmail(sendSmtpEmail);
};

/*
// Example Express router testing endpoint:
//
// const express = require("express");
// const { sendEmail } = require("./emailsource/sendEmail.js");
//
// const router = express.Router();
//
// router.post("/send-test-email", async (req, res) => {
//   const { to, subject, textContent, htmlContent } = req.body;
//   try {
//     const response = await sendEmail({ to, subject, textContent, htmlContent });
//     res.status(200).json({ success: true, messageId: response.body.messageId });
//   } catch (error) {
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
//     textContent: `New contact message from ${name} (${email}): ${message}`,
//     htmlContent: `
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
