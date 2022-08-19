import { Post, Controller } from '@overnightjs/core';
import { Request, Response } from 'express';
import { BaseController } from '.';
import { User } from '../models/User';
import AuthService from '@src/services/auth';


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

  @Post('authenticate')
  public async authenticate(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).send({
        code: 401,
        error: 'User not found'
      })
    }

    const passwordAuthenticate = await AuthService.comparePassword(password, user.password)

    if (!passwordAuthenticate) {
      return res.status(401).send({
        code: 401,
        error: 'Password dos not match!'
      })
    }

    const token = AuthService.generateToken(user.toJSON())
    return res.status(200).send({ token })
  }
}
