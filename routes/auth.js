const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// GET: Signup page
router.get('/signup', (req, res) => {
  res.render('signup', { title: 'Sign Up', error: null });
});

// POST: Handle Signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('signup', { title: 'Sign Up', error: 'Email already registered!' });
    }

    // Create new user
    const user = new User({ name, email, password });
    await user.save();

    // Store user ID in session
    req.session.userId = user._id;
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Signup error:', err);
    res.render('signup', { title: 'Sign Up', error: 'Something went wrong. Please try again.' });
  }
});

// GET: Login page
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login', error: null });
});

// POST: Handle Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('login', { title: 'Login', error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', { title: 'Login', error: 'Invalid email or password' });
    }

    req.session.userId = user._id;
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Login error:', err);
    res.render('login', { title: 'Login', error: 'Something went wrong. Please try again.' });
  }
});

req.flash('success', 'Signup successful!');
res.redirect('/dashboard');

req.flash('error', 'Invalid email or password');
res.redirect('/login');

// GET: Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
