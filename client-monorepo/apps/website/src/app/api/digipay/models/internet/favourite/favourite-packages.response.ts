import { BaseApiResponse } from '../../base-api.response';
import { FavouritePackagesGroup } from './favourite-packages-group';
import { SimType } from '../../common/sim-type';
import { OperatorIds } from '../../carrier/operator-ids';

export interface FavouritePackagesResponse extends BaseApiResponse {
  bundles: FavouritePackagesGroup[];
  // LOCAL KEYS ...
  cellNumber: string; // LOCAL
  simType: SimType; // LOCAL
  operatorId: OperatorIds; // LOCAL
}
