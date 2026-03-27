import { Router } from "express";
import { chatWithAI, getChatHistory, clearChatHistory } from "../controllers/chatController.js";
import { protect } from "../lib/auth.js";

const router = Router();

router.post("/", protect, chatWithAI);
router.get("/history", protect, getChatHistory);
router.delete("/clear", protect, clearChatHistory);

export default router;
