import './util/module-alias';
import { Server } from '@overnightjs/core';
import bodyparser from 'body-parser';
import { ForecastController } from './controllers/forecast';
import { BeachesController } from './controllers/beaches';
import { UserController } from './controllers/users';
import { Application } from 'express';

import * as database from '@src/database'

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  private setupExpress(): void {
    this.app.use(bodyparser.json());
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();
    const beachesController = new BeachesController();
    const usersController = new UserController();
    this.addControllers([forecastController, beachesController, usersController]);
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.databaseSetup()
  }

  public getApp(): Application {
    return this.app;
  }

  private async databaseSetup(): Promise<void> {
    await database.connect()
  }

  public async close(): Promise<void> {
    await database.close()
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.info(`Server runing port ${this.port}`)
    })
  }
}
