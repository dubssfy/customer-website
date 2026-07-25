import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendContactMail = async ({
  name,
  phone,
  email,
  message,
}) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,

    to: "support@swacchamlaundry.com",

    subject: "New Contact Form Submission",

    html: `
      <h2>New Contact Request</h2>

      <table border="1" cellpadding="8" cellspacing="0">

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
};