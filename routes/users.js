import express from "express";

import { login, signup } from "../controllers/auth.js";
import { getAllUsers, updateProfile } from "../controllers/users.js";
import auth from "../middleware/auth.js";
// import { generateOTP, verifyOTP } from "../utility/otpGenerator.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/getAllUsers", getAllUsers);
router.patch("/update/:id", auth, updateProfile);
// router.post("/generate-otp", generateOTP);
// router.post("/verify-otp", verifyOTP);

export default router;
