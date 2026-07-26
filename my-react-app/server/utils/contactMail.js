import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const sendContactMail = async ({
  name,
  phone,
  email,
  message,
}) => {
  try {
    const senderEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";
    
    // Send form notifications to support email (usually admin's email)
    const adminReceiver = process.env.ADMIN_RECEIVER_EMAIL || "support@swacchamlaundry.com";

    if (!resend) {
      console.warn("⚠️ Resend API key is not set. Skipping contact form notification email.");
      return;
    }

    const { data, error } = await resend.emails.send({
      from: `Swaccham Contact Form <${senderEmail}>`,
      to: [adminReceiver],
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Request</h2>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
          <tr>
            <td><b>Name</b></td>
            <td>${name}</td>
          </tr>
          <tr>
            <td><b>Phone</b></td>
            <td>${phone}</td>
          </tr>
          <tr>
            <td><b>Email</b></td>
            <td>${email}</td>
          </tr>
          <tr>
            <td><b>Message</b></td>
            <td>${message}</td>
          </tr>
        </table>
      `,
    });

    if (error) {
      console.error("❌ Resend Contact Email Error details:", error);
    } else {
      console.log("✅ Contact email sent successfully via Resend. ID:", data.id);
    }
  } catch (err) {
    console.error("❌ CONTACT MAIL ERROR");
    console.error(err);
  }
};