const jwt = require('jsonwebtoken');
const { AppDataSource } = require('../data-source');
const { User } = require('../entities/User');

// Middleware to authenticate using JWT token in Authorization header: Bearer <token>
async function authMiddleware(req, res, next) {
  const header = req.headers['authorization'];

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or invalid' });
  }

  const token = header.substring('Bearer '.length).trim();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');

    const userRepository = AppDataSource.getRepository('User');
    const user = await userRepository.findOne({
      where: { id: payload.id }
    });

    if (!user) {
      return res.status(401).json({ message: 'User associated with token not found' });
    }

    req.user = {
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = {
  authMiddleware
};

