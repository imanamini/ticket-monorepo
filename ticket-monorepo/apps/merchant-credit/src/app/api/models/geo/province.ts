import { City } from './city';

export interface Province {
  code: string;
  value: string;
  cities: City[];
}
