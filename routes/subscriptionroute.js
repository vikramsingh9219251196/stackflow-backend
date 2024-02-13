import express from "express";
import { createSubscription, updateSubscription } from "../controllers/subscription.js";
import auth from "../middleware/auth.js";
const router = express.Router();
router.post('/create-subscription',auth,createSubscription);
router.post('/update-subscription',auth,updateSubscription);
export default router;