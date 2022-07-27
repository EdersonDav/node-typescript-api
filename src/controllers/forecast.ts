import { Get, Controller } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Forecast } from '../services/forecast';
import { Beach } from '../models/Beach';

const forecast = new Forecast()

@Controller('forecast')
export class ForecastController {
  @Get('')
  public async getForecastForLoggedUser(_: Request, res: Response): Promise<void> {
    try {
      const beaches = await Beach.find({});
      const forecastData = await forecast.processForecastForBeaches(beaches);
      res.status(200).send(forecastData);
    } catch (error) {
      console.log(error);

      res.status(500).send({ error: 'Somenthing went wrong' })
    }
  }
}
