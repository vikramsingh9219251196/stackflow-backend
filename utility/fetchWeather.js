// weatherController.js
import axios from "axios";

export const fetchWeather = async (req,res) => {
  const { latitude, longitude } = req.params;
  const apiKey = process.env.apiKey;
  try {
    // Replace 'YOUR_WEATHER_API_KEY' with your actual API key
  
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

    const response = await axios.get(apiUrl);
    // const data = await response.json();

    // Extract relevant weather information from the API response
    const weatherData = {
      temperature: response.data.main.temp,
      conditions: response.data.weather[0].description,
    };
    return res.json(weatherData);
  } catch (error) {
    // Handle errors, log them, or return a default weather data
    console.error('Error fetching weather data:', error);
    return { temperature: 20, conditions: 'Clear' }; // Default data in case of an error
  }
};

