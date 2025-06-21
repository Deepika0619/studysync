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
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('signup', { title: 'Sign Up', error: 'Email already registered!' });
    }

    const user = new User({ name, email, password });
    await user.save();

    req.session.userId = user._id;
    req.flash('success', 'Signup successful!'); 
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
      req.flash('error', 'Invalid email or password'); 
      return res.redirect('/login');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash('error', 'Invalid email or password'); 
      return res.redirect('/login');
    }

    req.session.userId = user._id;
    req.flash('success', 'Login successful!');
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Login error:', err);
    res.render('login', { title: 'Login', error: 'Something went wrong. Please try again.' });
  }
});

// GET: Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
