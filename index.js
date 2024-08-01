// app.js
const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();
const port = process.env.PORT | 3000;

require('dotenv').config();

// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Environment variables
const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;

// Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Weather & Tourist Places Explorer' });
});

app.post('/search', async (req, res) => {
    const { city } = req.body;
    try {
      // Fetch weather data
      const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`);
      const weatherData = weatherResponse.data;
  
      // Determine place category based on weather
      let category = '10000'; // Default category (General Entertainment)
      if (weatherData.weather[0].main === 'Rain' || weatherData.weather[0].main === 'Snow') {
        category = '10056'; // Indoor Activities
      } else if (weatherData.weather[0].main === 'Clear' || weatherData.weather[0].main === 'Clouds') {
        category = '16000'; // Outdoor Activities
      }
  
      // Fetch tourist places data based on weather
      const placesResponse = await axios.get(`https://api.foursquare.com/v3/places/search?near=${city}&limit=10&categories=${category}`, {
        headers: {
          Authorization: FOURSQUARE_API_KEY
        }
      });
      const placesData = placesResponse.data.results;
  
      res.render('results', { 
        title: `Results for ${city}`,
        weather: weatherData,
        places: placesData
      });
    } catch (error) {
      console.error('Detailed error:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
      }
      res.render('error', { message: 'An error occurred while fetching data. Please check the server logs for more details.' });
    }
  });

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
