import express from "express";
import { sendContactMail } from "../utils/contactMail.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    await sendContactMail(req.body);

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
});

export default router;