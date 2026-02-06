// Middleware to ensure the current user is an admin
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

// Middleware for /users/:id route so that:
// - admin can view any user
// - non-admin can view only their own record
function requireSelfOrAdmin(req, res, next) {
  const requestedId = parseInt(req.params.id, 10);

  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  if (req.user.role === 'admin') {
    return next();
  }

  if (Number.isNaN(requestedId)) {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  if (req.user.id !== requestedId) {
    return res.status(403).json({ message: 'You can only access your own details' });
  }

  next();
}

module.exports = {
  requireAdmin,
  requireSelfOrAdmin
};

