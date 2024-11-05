import { Request, Response, NextFunction } from 'express';

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const userRole = req.userRole;  

  if (userRole !== 'admin') {
    return res.status(403).json({
      status: 403,
      message: 'Forbidden. Admin access only.',
    });
  }

  next();
};

export { isAdmin };

