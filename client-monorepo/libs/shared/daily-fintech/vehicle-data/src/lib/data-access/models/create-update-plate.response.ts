import { GenericApiResponse } from '@client-monorepo/common/network';
import { StoredPlate } from '@client-monorepo/daily-fintech/vehicle-data';

export interface CreateUpdatePlateResponse extends GenericApiResponse {
  plate: StoredPlate;
}
