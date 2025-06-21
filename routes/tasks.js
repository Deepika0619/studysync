const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET: Dashboard with tasks
router.get('/dashboard', async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  const tasks = await Task.find({ userId: req.session.userId });
  res.render('dashboard', { title: 'Dashboard', tasks });
});

// POST: Add new task
router.post('/tasks', async (req, res) => {
  const { title } = req.body;
  await Task.create({ title, userId: req.session.userId });
  res.redirect('/dashboard');
});

req.flash('success', 'Task added!');
res.redirect('/dashboard');

// POST: Delete task
router.post('/tasks/delete/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.redirect('/dashboard');
});

module.exports = router;