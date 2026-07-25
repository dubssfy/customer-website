console.log("sendWhatsApp.js loaded");

import axios from "axios";

export const sendWhatsAppMessage = async ({
  mobile,
  name,
  bookingId
 
}) => {
  try {
    console.log("META_ACCESS_TOKEN:", process.env.META_ACCESS_TOKEN);
    console.log("PHONE_NUMBER_ID:", process.env.PHONE_NUMBER_ID);
    console.log("Sending to:", `91${mobile}`);

    const response = await axios.post(
  `https://graph.facebook.com/v23.0/${process.env.PHONE_NUMBER_ID}/messages`,
  {
  messaging_product: "whatsapp",
  to: `91${mobile}`,
  type: "template",
  template: {
    name: "booking_confirmation",
    language: {
      code: "en_us"
    },
    components: [
      {
        type: "body",
        parameters: [
          { type: "text", text: name },
          { type: "text", text: bookingId }
        ]
      }
    ]
  }
},
  {
    headers: {
      Authorization: `Bearer ${process.env.META_ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    }
  }
);

    console.log("✅ WhatsApp sent successfully");
    console.log("Meta Response:");
    console.log(JSON.stringify(response.data, null, 2));

    return response.data;

  } catch (err) {
    console.log("❌ WhatsApp Error");

    if (err.response) {
      console.log(JSON.stringify(err.response.data, null, 2));
    } else {
      console.log(err.message);
    }

    throw err;
  }
};