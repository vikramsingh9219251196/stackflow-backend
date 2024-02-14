// weatherController.js
import axios from "axios";

export const fetchWeather = async (req,res) => {
  const { latitude, longitude } = req.params;
  const apiKey = process.env.apiKey;
  try {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
    const response = await axios.get(apiUrl);
    const weatherData = {
      temperature: response.data.main.temp,
      conditions: response.data.weather[0].description,
    };
    return res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return { temperature: 20, conditions: 'Clear' };
  }
};

