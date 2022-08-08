import { Post, Controller } from '@overnightjs/core';
import { Request, Response } from 'express';
import { BaseController } from '.';
import { User } from '../models/User';


@Controller('users')
export class UserController extends BaseController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const user = new User(req.body);

      const newUser = await user.save();

      res.status(201).send(newUser)
    } catch (error) {
      this.sendCreatedUpdatedErrorResponse(res, error as Error)
    }

  }
}
