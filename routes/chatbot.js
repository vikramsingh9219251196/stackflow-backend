import express from "express";
import { chatbotConfig } from "../controllers/chatbot";

const router = express.Router();

router.get('/config', (req, res) => {
    res.json(chatbotConfig);
  });


export default router;
