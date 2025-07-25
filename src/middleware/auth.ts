import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Ensure JWT_SECRET is available
    const jwtSecret: string = process.env.JWT_SECRET as string;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is required');
    }

    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: req.t('auth.token_required') 
      });
    }

    const decoded = jwt.verify(token, jwtSecret) as any;
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: req.t('auth.invalid_token') 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: req.t('auth.invalid_token') 
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: req.t('auth.unauthorized') 
      });
    }

    if (!roles.some(role => req.user.roles.includes(role))) {
      return res.status(403).json({ 
        success: false, 
        message: req.t('auth.insufficient_permissions') 
      });
    }

    next();
  };
};