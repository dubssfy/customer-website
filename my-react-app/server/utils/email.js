import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify SMTP connection when the server starts
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Verification Failed:");
    console.error(error);
  } else {
    console.log("SMTP Server is ready.");
  }
});

export const sendConfirmationEmail = async (toEmail, bookingDetails) => {
  try {
    console.log("================================");
    console.log("Sending email to:", toEmail);
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
    console.log("================================");

    const {
      name,
      bookingId,
      orderType,
      service,
      city,
      estimatedPickup,
    } = bookingDetails;

    const info = await transporter.sendMail({
      from: `"Swaccham Laundry" <${process.env.EMAIL_USER}>`,
      to: toEmail,
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

    console.log("Email Sent Successfully");
    console.log(info);

  } catch (err) {
    console.error("EMAIL ERROR");
    console.error(err);
  }
};