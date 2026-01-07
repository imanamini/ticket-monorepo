import { Plate } from './plate';
import { Vehicle } from './vehicle';

export interface StoredPlate {
  plateNo: string;
  plateId: string;
  title: string;
  plainPlateNo: string;
  plateDetail?: Plate;
  vehicleDetail: Vehicle;
  beforeLetterNumbers: string;
  afterLetterNumbers: string;
  provinceNumber: string;
  type: Plate;
}
