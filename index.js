import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import questionRoutes from "./routes/Questions.js";
import answerRoutes from "./routes/Answers.js";
import weatherRoutes from "./routes/weatherroute.js"
import connectDB from "./connectMongoDb.js";
import subscriptionRoutes from "./routes/subscriptionroute.js";
import otpRoutes from "./routes/otpRoute.js"
dotenv.config();
connectDB();
const app = express();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors({
  origin: 'https://stackflow-frontend.vercel.app',
}));
app.use("/user", userRoutes);
app.use("/questions", questionRoutes);
app.use("/answer", answerRoutes);
app.use("/api",weatherRoutes);
app.use("/subscription", subscriptionRoutes);
app.use("/otp",otpRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
