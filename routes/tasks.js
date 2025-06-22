const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User'); // Import User model if not already

// GET: Dashboard page
router.get('/dashboard', async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  try {
    const user = req.session.user;

    // Safety check if session doesn't have user
    if (!user) {
      const userFromDB = await User.findById(req.session.userId);
      req.session.user = {
        _id: userFromDB._id,
        name: userFromDB.name,
        email: userFromDB.email
      };
    }

    res.render('dashboard', {
      title: 'Dashboard',
      user: req.session.user,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (err) {
    console.error('Error loading dashboard:', err);
    req.flash('error', 'Error loading dashboard.');
    res.redirect('/login');
  }
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
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Error adding task:', err);
    req.flash('error', 'Could not add task');
    res.redirect('/dashboard');
  }
});

// POST: Delete a task
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
