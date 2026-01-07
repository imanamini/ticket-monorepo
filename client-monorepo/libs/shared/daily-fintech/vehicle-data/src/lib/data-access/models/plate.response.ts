import { GenericApiResponse } from '@client-monorepo/common/network';
import { StoredPlate } from './stored-plate';

export interface PlateResponse extends GenericApiResponse {
  plates: StoredPlate[];
}
