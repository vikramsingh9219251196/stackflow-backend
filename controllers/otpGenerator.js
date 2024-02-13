import users from "../models/auth.js"
import { sendEmail } from "../utility/sendEmail.js";

export const generateOTP = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await users.findOneAndUpdate({ email }, { email, otp }, { upsert: true });
    await sendEmail(email, 'Your OTP for verification', `Your OTP is: ${otp}`);
  
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const verifyOTP = async (req, res) => {
  const { otp } = req.body;

  try {
    const user = await users.findOne({ otp });
    if (user) {
      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Invalid OTP' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};