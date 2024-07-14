const express = require('express');
const router = express.Router();
const Flight = require('../models/Flight');

router.post('/create', async (req, res) => {
  try {
    const flightData = {
      ...req.body,
      baggage: {
        smallBaggage: req.body.smallBaggage,
        largeBaggage: req.body.largeBaggage
      }
    };

    const flight = new Flight(flightData);
    await flight.save();
    res.status(201).json({ message: 'Flight created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const flights = await Flight.find();
    res.status(200).json(flights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
