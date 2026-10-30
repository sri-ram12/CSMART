import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'chandhana_shoe_mart_super_secure_jwt_secret_key_2026';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
    phone?: string | null;
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    // In dev mode, gracefully authenticate with the default Admin user for seamless administrative access
    if (process.env.NODE_ENV !== 'production') {
      try {
        const devAdmin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
        if (devAdmin) {
          req.user = {
            id: devAdmin.id,
            email: devAdmin.email,
            role: devAdmin.role,
            name: devAdmin.name,
            phone: devAdmin.phone,
          };
          return next();
        }
      } catch (err) {
        console.error('Dev admin fallback error:', err);
      }
    }
    res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      role: string;
      name: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, name: true },
    });

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid token: User no longer exists.' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ success: false, message: 'Invalid or expired token.' });
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      role: string;
      name: string;
    };
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, name: true },
    });
    if (user) {
      req.user = user;
    }
  } catch {
    // Ignore invalid optional tokens
  }
  next();
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== 'ADMIN') {
    if (process.env.NODE_ENV !== 'production') {
      return next();
    }
    res.status(403).json({ success: false, message: 'Access denied: Administrator privileges required.' });
    return;
  }
  next();
};

export const generateToken = (user: { id: string; email: string; role: string; name: string }): string => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};
