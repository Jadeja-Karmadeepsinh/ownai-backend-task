const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { AppDataSource } = require('../data-source');
const { registerValidationRules, loginValidationRules } = require('../validators/authValidators');

const router = express.Router();

// POST /api/auth/register
router.post('/register', registerValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, role, phone, city, country } = req.body;

  try {
    const userRepository = AppDataSource.getRepository('User');

    const existing = await userRepository.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = userRepository.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      city,
      country
    });

    const saved = await userRepository.save(user);

    return res.status(201).json({
      id: saved.id,
      name: saved.name,
      email: saved.email,
      role: saved.role,
      phone: saved.phone,
      city: saved.city,
      country: saved.country,
      createdAt: saved.createdAt
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to register user' });
  }
});

// POST /api/auth/login
router.post('/login', loginValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const userRepository = AppDataSource.getRepository('User');
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const payload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'default_secret', {
      expiresIn: '1h'
    });

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to login' });
  }
});

module.exports = router;

