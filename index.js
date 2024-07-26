const express = require('express');
const path = require('path');
const { getWeather, getTouristPlaces } = require('./modules/app');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/explore', async (req, res) => {
  const { location } = req.query;
  if (!location) {
    return res.render('index', { error: 'Please provide a location' });
  }

  try {
    // Fetch weather data
    const weather = await getWeather(location);

    // Determine type of places to search for based on weather
    const weatherCondition = weather.weather[0].main.toLowerCase();
    let placeType = 'outdoor';
    if (['rain', 'snow', 'windy', 'thunderstorm'].includes(weatherCondition)) {
      placeType = 'indoor';
    }

    // Fetch tourist places data
    const places = await getTouristPlaces(location, placeType);

    res.render('explore', { weather, places });
  } catch (error) {
    console.error(error);
    res.render('index', { error: 'Error fetching data. Please try again.' });
  }
});

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});



