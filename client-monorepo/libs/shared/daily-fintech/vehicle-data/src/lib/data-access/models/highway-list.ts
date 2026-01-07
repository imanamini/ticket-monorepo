import { Highway } from './highway';

export interface HighwayList {
  tollDetails: Highway[];
  vehicleCode: number;
  imageId: string;
  colorRange: number[];
}
