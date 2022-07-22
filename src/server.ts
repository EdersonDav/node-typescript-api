import './util/module-alias';
import { Server } from '@overnightjs/core';
import bodyparser from 'body-parser';
import { ForecastController } from './controllers/forecast';
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
    this.addControllers([forecastController]);
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
}
