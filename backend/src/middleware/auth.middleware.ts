import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
): void | Response<any, Record<string, any>> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET!
    ) as any;

    req.user = decoded;
    next();

  } catch (error: any) {
    console.error('Auth middleware error:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

export const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Admin role required.' });
  }
};
