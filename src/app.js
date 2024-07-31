const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');

const app = express();

app.use(express.json());

app.use('/api', userRoutes);

app.use((req, res, next) => {
    const err = new Error('Not Found')
    console.log(err)
    err.status = 404
    res.send('Route not found')
    next(err)
});

module.exports = app;