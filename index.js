const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

const TOKEN = process.env.PRIVATE_APP_TOKEN;
const HEADERS = {
  Authorization: `Bearer ${TOKEN}`,
  'Content-Type': 'application/json'
};

const OBJECT_ID = '2-66270962';
const PROPERTIES = 'name,species,bio';

// ROUTE 1: Homepage - GET all records and show them in a table
app.get('/', async (req, res) => {
  const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_ID}?properties=${PROPERTIES}`;
  try {
    const response = await axios.get(url, { headers: HEADERS });
    const records = response.data.results;
    res.render('homepage', {
      title: 'Homepage | Integrating With HubSpot I Practicum',
      records: records
    });
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).send('Error fetching records');
  }
});

// ROUTE 2: Show the form
app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
  });
});

// ROUTE 3: Handle the form submission - POST a new record, then redirect home
app.post('/update-cobj', async (req, res) => {
  const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_ID}`;
  const newRecord = {
    properties: {
      name: req.body.name,
      species: req.body.species,
      bio: req.body.bio
    }
  };
  try {
    await axios.post(url, newRecord, { headers: HEADERS });
    res.redirect('/');
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).send('Error creating record');
  }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));