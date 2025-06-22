// routes/tasks.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');

// GET: Dashboard
router.get('/dashboard', async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  let user = req.session.user;
  if (!user) {
    const userFromDB = await User.findById(req.session.userId);
    req.session.user = {
      _id: userFromDB._id,
      name: userFromDB.name,
      email: userFromDB.email
    };
    user = req.session.user;
  }
  res.render('dashboard', {
  title: 'Dashboard',
  user: req.session.user,
  success: req.flash('success'),
  error: req.flash('error')
});
});

// GET: My Tasks (AJAX)
router.get('/mytasks', async (req, res) => {
  if (!req.session.userId) return res.status(401).send('Unauthorized');
  try {
    const tasks = await Task.find({ userId: req.session.userId });
    res.render('actions', { tasks, noFooter: true });
  } catch (err) {
    console.error('Error loading tasks:', err);
    res.status(500).send('Could not load tasks');
  }
});

// GET: Account Info (AJAX)
router.get('/account', (req, res) => {
  if (!req.session.user) return res.status(401).send('Unauthorized');
  res.render('accounts', { user: req.session.user, noFooter: true });
});

// GET: Tasks Page (full)
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
    console.error('Error loading tasks page:', err);
    req.flash('error', 'Unable to load tasks.');
    res.redirect('/dashboard');
  }
});

// POST: Add Task
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

// POST: Delete Task
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