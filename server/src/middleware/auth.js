const jwt = require('jsonwebtoken');

const prisma = require('../config/database');

const authMiddleware = async (req, res, next) => {
  try {
    // Check both cookie and Authorization header
    let token = null;

    // 1. Try Cookie (Primary)
    if (req.cookies && req.cookies.auth_token) {
      token = req.cookies.auth_token;
    } 
    // 2. Try Authorization Header (Fallback for migration/legacy)
    else {
      const authHeader = req.header('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.replace('Bearer ', '');
      }
    }

    if (!token) {
      const origin = req.get('origin') || 'Unknown Origin';
      console.warn(`[AUTH_DIAGNOSTIC]: Token missing for request from ${origin}. Cookies present: ${Object.keys(req.cookies || {}).join(', ') || 'NONE'}`);
      console.warn(`[AUTH_DIAGNOSTIC]: Environment: ${process.env.NODE_ENV}, Protocol: ${req.protocol}, X-Forwarded-Proto: ${req.get('x-forwarded-proto')}`);
      return res.status(401).json({ error: 'Auth token required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error(`[AUTH_DEBUG]: Token verification failed: ${err.message}`);
      return res.status(401).json({ error: 'Invalid token' });
    }

    // --- Critical: Status Check ---
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        teacher: { select: { id: true } },
        student: { select: { id: true } },
        staff: { select: { id: true } }
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'User no longer exists' });
    }

    if (user.isActive === false) {
      return res.status(403).json({ error: 'Institutional account is currently deactivated' });
    }

    req.user = {
      ...user,
      userId: user.id,
      teacherId: user.teacher?.id,
      studentId: user.student?.id,
      staffId: user.staff?.id
    };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }

    // --- Critical: Handle Database Connectivity Errors ---
    // Avoid masking DB failures as "Invalid token" (401)
    if (error.code && (error.code.startsWith('P1') || error.code.startsWith('P2'))) {
      console.error('[AUTH_SERVICE_ERROR]: Database connection failed.');
      return res.status(500).json({ 
        success: false, 
        error: 'Database connection failed. Please ensure your database is active and reachable.' 
      });
    }

    return res.status(401).json({ error: 'Invalid token' });
  }
};

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Check both primary role and roles array for multi-role support
    const userRoles = req.user.roles || [req.user.role];
    const hasPermission = userRoles.some(role => allowedRoles.includes(role));

    if (!hasPermission) {
      return res.status(403).json({
        error: 'Insufficient permissions',
      });
    }

    next();
  };
};

module.exports = { authMiddleware, requireRole };
