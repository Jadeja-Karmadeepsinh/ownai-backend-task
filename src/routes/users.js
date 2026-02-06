const express = require('express');
const { AppDataSource } = require('../data-source');
const { authMiddleware } = require('../middleware/auth');
const { requireAdmin, requireSelfOrAdmin } = require('../middleware/roles');

const router = express.Router();

// GET /api/users
// Admin-only. Supports:
// - ?search=... (partial match on name or email)
// - ?country=... (exact match on country)
router.get('/', authMiddleware, requireAdmin, async (req, res) => {
  const { search, country } = req.query;

  try {
    const userRepository = AppDataSource.getRepository('User');
    const qb = userRepository.createQueryBuilder('user');

    if (search) {
      qb.andWhere('(user.name LIKE :search OR user.email LIKE :search)', {
        search: `%${search}%`
      });
    }

    if (country) {
      qb.andWhere('user.country = :country', { country });
    }

    const users = await qb.orderBy('user.id', 'ASC').getMany();

    const sanitized = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      phone: u.phone,
      city: u.city,
      country: u.country,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt
    }));

    return res.json(sanitized);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to list users' });
  }
});

// GET /api/users/:id
// - admin can view any user
// - non-admin can view only their own details
router.get('/:id', authMiddleware, requireSelfOrAdmin, async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (Number.isNaN(id)) {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  try {
    const userRepository = AppDataSource.getRepository('User');
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      city: user.city,
      country: user.country,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to get user details' });
  }
});

module.exports = router;

