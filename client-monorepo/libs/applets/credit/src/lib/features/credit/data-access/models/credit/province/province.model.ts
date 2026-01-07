import { City } from './city.model';

export interface Province {
  uuid: string;
  name: string;
  order?: number;
  cities: Array<City>;
}
