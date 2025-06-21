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
  try {
    const { title } = req.body;
    await Task.create({ title, userId: req.session.userId });

    // ✅ Flash message inside route
    req.flash('success', 'Task added!');
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Error adding task:', err);
    req.flash('error', 'Could not add task');
    res.redirect('/dashboard');
  }
});

// POST: Delete task
router.post('/tasks/delete/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    req.flash('success', 'Task deleted!');
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Error deleting task:', err);
    req.flash('error', 'Could not delete task');
    res.redirect('/dashboard');
  }
});

module.exports = router;