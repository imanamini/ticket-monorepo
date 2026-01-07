import { CarDataModel } from '../data-access/models/third-party/constant-all/car-data.model';

export function getDefaultItemId(data: CarDataModel[]): number {
  return data.find(item => item.defaultValue)?.id;
}
