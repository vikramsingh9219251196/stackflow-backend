import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import users from "../models/auth.js";
import { sendEmail } from "../utility/sendEmail.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    console.log("Checking if user exists...");
    const existinguser = await users.findOne({ email });

    if (existinguser) {
      console.log("User already exists. Returning 404...");
      return res.status(404).json({ message: "User already exists." });
    }

    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 12);

    console.log("Creating new user...");
    const newUser = await users.create({
      name,
      email,
      password: hashedPassword,
    });

    console.log("Creating JWT token...");
    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Sending success response...");
    res.status(200).json({ result: newUser, token });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json("Something went wrong...");
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existinguser = await users.findOne({ email });
    if (!existinguser) {
      return res.status(404).json({ message: "User don't Exist." });
    }
    if (existinguser.blockedUntil && existinguser.blockedUntil > Date.now()) {
      return res.status(401).json({ message: "Account is blocked. Try again later." });
    }
    const isPasswordCrt = await bcrypt.compare(password, existinguser.password);
      if (!isPasswordCrt) {
        existinguser.failedAttempts++;
        if (existinguser.failedAttempts >= 3) {
          await sendEmail(existinguser.email, 'Failed Login Attempts', 'There have been 3 consecutive failed login attempts on your account.');
        }
        if (existinguser.failedAttempts >= 5) {
          existinguser.blockedUntil = Date.now() + 3600000;
          await sendEmail(existinguser.email, 'Account Blocked', 'Your account has been blocked due to repeated failed login attempts. It will be unblocked after 1 hour.');
        }
        await existinguser.save();
      return res.status(400).json({ message: "Invalid credentials" });
    }
    existinguser.failedAttempts = 0;
    await existinguser.save();

    const token = jwt.sign(
      { email: existinguser.email, id: existinguser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ result: existinguser, token });
  } catch (error) {
    res.status(500).json("Something went wrong...");
  }
};



