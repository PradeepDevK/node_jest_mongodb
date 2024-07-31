const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
});

router.get('/users', async (req, res) => {
    const users = await User.find();
    res.send(users);
});

router.get('/users/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send();
    res.send(user);
});

router.put('/users/:id', async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!user) return res.status(404).send();
    res.send(user);
});

router.delete('/users/:id', async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send();
    res.send(user);
});

module.exports = router;