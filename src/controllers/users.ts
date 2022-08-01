import { Post, Controller } from '@overnightjs/core';
import { Request, Response } from 'express';
import { User } from '../models/User';


@Controller('users')
export class UserController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    const user = new User(req.body);

    const newUser = await user.save();

    res.status(201).send(newUser)
  }
}
