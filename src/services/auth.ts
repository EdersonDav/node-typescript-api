import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';

import { User } from '@src/models/User';

export interface DecodedUser extends Omit<User, '_id'> {
  id: string
}

export default class AuthService {
  public static async hashPassword(password: string, salt = 10): Promise<string> {
    return await bcrypt.hash(password, salt)
  }

  public static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword)
  }

  public static generateToken(payload: object): string {
    return jwt.sign(payload, config.get('App.auth.key'), {
      expiresIn: config.get('App.auth.expiresIn')
    })
  }

  public static decoderToken(token: string): object {
    return jwt.verify(token, config.get('App.auth.key')) as DecodedUser
  }
}
