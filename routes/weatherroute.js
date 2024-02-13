import express from "express";
import { fetchWeather } from "../utility/fetchWeather.js";

const router = express.Router();


router.get("/weather/:latitude/:longitude",fetchWeather);

export default router;