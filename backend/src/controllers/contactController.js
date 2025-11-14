import nodemailer from "nodemailer";

export default async function sendContactMessage(req, res) {
  const { name, email, subject, message } = req.body;

  const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    const Sendmessage = {
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      replyTo: email,
      subject: `📩 New Contact Message: ${subject}`,
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>New Message from Contact Form</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong><br>${message}</p>
        </div>
      `,
    };

    await transport.sendMail(Sendmessage);

    const replyMail = {
      from: process.env.EMAIL,
      to: email,
      subject: "Thank You for Contacting Edu-Bridge 💙",
      html: `
        <div style="font-family: Arial; padding: 20px; background: #f7f7fc;">
          <h2 style="color:#4f46e5;">Thank You for Reaching Out!</h2>
          <p>Hi ${name},</p>
          <p>We received your message and our team will get back to you shortly.</p>
          <p><strong>Your message:</strong></p>
          <blockquote style="border-left: 4px solid #4f46e5; padding-left: 12px; color: #555;">
            ${message}
          </blockquote>
          <br/>
          <p style="font-size: 13px; color: #555;">Best Regards,<br/>Edu-Bridge Support Team</p>
        </div>
      `,
    };

    await transport.sendMail(replyMail);

    return res.status(200).json({
      message: "Messages sent successfully.",
    });
  } catch (error) {
    console.error("Error sending contact message:", error);

    return res.status(500).json({
      error: "Failed to send messages.",
    });
  }
}
