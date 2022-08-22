import { Request, Response, NextFunction } from 'express';
import AuthService from '@src/services/auth';
import { DecodedUser } from '../services/auth';

export const authMiddleware = (req: Partial<Request>, res: Partial<Response>, next: NextFunction) => {
  const token = req.headers?.['x-access-token'];

  try {
    const decoded = AuthService.decoderToken(token as string);

    req.decoded = decoded as DecodedUser;

    next();
  } catch (error) {
    res.status?.(401).send({
      code: 401,
      error: (error as Error).message
    })
  }

}