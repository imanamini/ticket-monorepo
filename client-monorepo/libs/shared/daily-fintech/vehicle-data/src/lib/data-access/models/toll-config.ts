import { Plate } from './plate';
import { Vehicle } from './vehicle';

export interface HighwayTollConfig {
  plateDetails: Array<Plate>;
  vehicleDetails: Array<Vehicle>;
  landingConfig: LandingConfig;
}

export interface LandingConfig {
  bannerImageId: string;
  title: string;
  campaignInfo: object;
  tacInfo: object;
}
