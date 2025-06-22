const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET: Dashboard page (welcome only)
router.get('/dashboard', (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  res.render('dashboard', { title: 'Dashboard' });
});

// GET: My Tasks page
router.get('/tasks', async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  try {
    const tasks = await Task.find({ userId: req.session.userId });
    res.render('tasks', {
      title: 'My Tasks',
      tasks,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (err) {
    console.error('Error loading tasks:', err);
    req.flash('error', 'Unable to load tasks.');
    res.redirect('/dashboard');
  }
});

// POST: Add new task
router.post('/tasks', async (req, res) => {
  try {
    const { title } = req.body;
    await Task.create({ title, userId: req.session.userId });

    req.flash('success', 'Task added!');
    res.redirect('/tasks');
  } catch (err) {
    console.error('Error adding task:', err);
    req.flash('error', 'Could not add task');
    res.redirect('/tasks');
  }
});

// POST: Delete a task
router.post('/tasks/delete/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    req.flash('success', 'Task deleted!');
    res.redirect('/tasks');
  } catch (err) {
    console.error('Error deleting task:', err);
    req.flash('error', 'Could not delete task');
    res.redirect('/tasks');
  }
});

module.exports = router;
