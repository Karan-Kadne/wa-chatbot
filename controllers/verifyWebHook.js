import { VERIFY_TOKEN } from "../config/config.js";

// Verify Webhook Callback URL
export const verifyWebHook = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
    console.log("Webhook verified successfully!");
  } else {
    res.sendStatus(403);
  }
};
