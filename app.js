// app.js

const express = require('express');
const sqlite3 = require('sqlite3');

const app = express();
const port = 3000;

// Database setup
const db = new sqlite3.Database('./covid19India.db');

// Middleware to parse JSON in the request body
app.use(express.json());

// API 1: Get all states
app.get('/states/', (req, res) => {
  db.all('SELECT * FROM state', (err, rows) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.json(rows);
    }
  });
});

// API 2: Get a specific state by ID
app.get('/states/:stateId/', (req, res) => {
  const stateId = req.params.stateId;
  db.get('SELECT * FROM state WHERE state_id = ?', [stateId], (err, row) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else if (row) {
      res.json(row);
    } else {
      res.status(404).send('State not found');
    }
  });
});

// API 3: Create a district
app.post('/districts/', (req, res) => {
  const { districtName, stateId, cases, cured, active, deaths } = req.body;
  db.run(
    'INSERT INTO district (district_name, state_id, cases, cured, active, deaths) VALUES (?, ?, ?, ?, ?, ?)',
    [districtName, stateId, cases, cured, active, deaths],
    function (err) {
      if (err) {
        res.status(500).send('Internal Server Error');
      } else {
        res.send('District Successfully Added');
      }
    }
  );
});

// API 4: Get a specific district by ID
app.get('/districts/:districtId/', (req, res) => {
  const districtId = req.params.districtId;
  db.get('SELECT * FROM district WHERE district_id = ?', [districtId], (err, row) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else if (row) {
      res.json(row);
    } else {
      res.status(404).send('District not found');
    }
  });
});

// API 5: Delete a district by ID
app.delete('/districts/:districtId/', (req, res) => {
  const districtId = req.params.districtId;
  db.run('DELETE FROM district WHERE district_id = ?', [districtId], (err) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.send('District Removed');
    }
  });
});

// API 6: Update district details by ID
app.put('/districts/:districtId/', (req, res) => {
  const districtId = req.params.districtId;
  const { cases, cured, active, deaths } = req.body;
  db.run(
    'UPDATE district SET cases = ?, cured = ?, active = ?, deaths = ? WHERE district_id = ?',
    [cases, cured, active, deaths, districtId],
    (err) => {
      if (err) {
        res.status(500).send('Internal Server Error');
      } else {
        res.send('District Details Updated');
      }
    }
  );
});

// API 7: Get statistics of a specific state by ID
app.get('/states/:stateId/stats/', (req, res) => {
  const stateId = req.params.stateId;
  db.get('SELECT SUM(cases) as totalCases, SUM(cured) as totalCured, SUM(active) as totalActive, SUM(deaths) as totalDea

