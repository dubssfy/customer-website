import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

console.log(`📧 Resend Email Integration initialized. API Key set: ${!!process.env.RESEND_API_KEY}`);

export const sendConfirmationEmail = async (toEmail, bookingDetails) => {
  try {
    console.log("================================");
    console.log("Sending email via Resend to:", toEmail);
    console.log("================================");

    const {
      name,
      bookingId,
      orderType,
      service,
      city,
      estimatedPickup,
    } = bookingDetails;

    // Use EMAIL_FROM env var if domain is verified in Resend (e.g. hello@swachham.co.in)
    // If not verified, fallback to Resend's default sender for sandboxed accounts
    const senderEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";

    const { data, error } = await resend.emails.send({
      from: `Swaccham Laundry <${senderEmail}>`,
      to: [toEmail],
      subject: "Pickup Scheduled Successfully - Swaccham Laundry",
      html: `
      <h2>Thank You ${name}</h2>
      <p>Your booking has been confirmed.</p>
      <ul>
        <li><b>Booking ID:</b> ${bookingId}</li>
        <li><b>Service:</b> ${service}</li>
        <li><b>Order Type:</b> ${orderType}</li>
        <li><b>City:</b> ${city}</li>
        <li><b>Pickup:</b> ${estimatedPickup}</li>
      </ul>
      `,
    });

    if (error) {
      console.error("❌ Resend Email Error details:", error);
    } else {
      console.log("✅ Email Sent Successfully via Resend. ID:", data.id);
    }

  } catch (err) {
    console.error("❌ EMAIL ERROR");
    console.error(err);
  }
};