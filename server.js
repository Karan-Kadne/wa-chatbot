import express from "express";
import webhookRoutes from "./routes/routes.js";
import { PORT, VERIFY_TOKEN } from "./config/config.js";

import { SECRET_TOKEN } from "./config/config.js";

const app = express();
console.log(SECRET_TOKEN, PORT);

console.log(VERIFY_TOKEN, PORT);
app.use(express.json());

// Route to handle GET requests to the root URL (/)
app.get("/", (req, res) => {
  res.send("Webhook Started");
});

// Route /api requests to webhook-related routes
app.use("/api", webhookRoutes);

app.listen(PORT, () => {
  console.log(`Webhook is listening`);
});
