import express from "express";
import { verifyWebHook } from "../controllers/verifyWebHook.js";
import { webHookController } from "../controllers/webHookController.js";

const router = express.Router();

/**
 * GET /webhook
 *
 * Verifies the webhook subscription by responding to verification requests
 * from the external service.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object to confirm verification.
 */
router.get("/webhook", verifyWebHook);

/**
 * POST /webhook
 *
 * Handles incoming webhook events, processes text and interactive messages,
 * and sends responses using the WhatsApp API.
 *
 * @param {Object} req - The request object containing webhook event data.
 * @param {Object} res - The response object to send HTTP responses.
 */
router.post("/webhook", webHookController);

export default router;
