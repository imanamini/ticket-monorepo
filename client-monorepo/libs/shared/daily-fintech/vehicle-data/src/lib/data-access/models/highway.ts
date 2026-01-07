import { HighwayStation } from './highway-station';

export interface Highway {
  highwayId: string;
  highwayCode: string;
  highwayName: string;
  stationDetails: HighwayStation[];
}
