import { Response } from 'express';
import mongoose from 'mongoose';
import { CUSTON_VALIDATION } from '../models/User';
export abstract class BaseController {
  protected sendCreatedUpdatedErrorResponse(res: Response, error: mongoose.Error.ValidationError | Error): void {
    if (error instanceof mongoose.Error.ValidationError) {
      const clientErrors = this.handleClientError(error);
      res.status(clientErrors.code).send({ code: clientErrors.code, error: clientErrors.error })
    } else {
      res.status(500).send({ code: 500, error: "Something went wrong" })
    }
  }

  private handleClientError(error: mongoose.Error.ValidationError): { code: number; error: string } {
    const duplicatedKindErrors = Object.values(error.errors).
      filter(err => err.kind === CUSTON_VALIDATION.DUPLICATED)
    if (duplicatedKindErrors.length) {
      return { code: 409, error: (error as Error).message }
    } else {
      return { code: 422, error: (error as Error).message }
    }
  }
}