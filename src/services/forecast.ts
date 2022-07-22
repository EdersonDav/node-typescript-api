import { ForecastPoint, StormGlass } from '@src/clients/StormGlass';
import { InternalError } from '../util/errors/internal-error';

export enum BeachPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N'
}

export interface Beach {
  lat: number;
  name: string;
  position: BeachPosition;
  lng: number;
  user: string;
}

export interface TimeForecast {
  time: string;
  forecast: BeachForecast[];
}

export class ForecastProcessingInternalError extends InternalError {
  constructor(message: string) {
    super(`Unespected error during the forecast processing: ${message}`)
  }
}

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint { }

export class Forecast {
  constructor(protected stormGlass = new StormGlass()) { }

  public async processForecastForBeaches(beaches: Beach[]): Promise<TimeForecast[]> {
    const pointsWithCorretSources: BeachForecast[] = [];
    try {
      for (const beach of beaches) {
        const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);

        const enrichedBeachData = this.enrichedBeachData(points, beach);

        pointsWithCorretSources.push(...enrichedBeachData);
      }
      return this.mapForecastByTime(pointsWithCorretSources)
    } catch (error) {
      throw new ForecastProcessingInternalError((error as Error).message);
    }

  }

  private mapForecastByTime(forecast: BeachForecast[]): TimeForecast[] {
    const forecastBytime: TimeForecast[] = [];

    forecast.forEach(point => {
      const timePoint = forecastBytime.find(f => f.time === point.time);

      if (timePoint) {
        timePoint.forecast.push(point)
      } else {
        forecastBytime.push({
          time: point.time,
          forecast: [point]
        })
      }

    })

    return forecastBytime;
  }

  private enrichedBeachData(points: ForecastPoint[], beach: Beach): BeachForecast[] {
    return points.map(e => ({
      ...{},
      ...{
        lat: beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: 1
      },
      ...e
    }))
  }
}