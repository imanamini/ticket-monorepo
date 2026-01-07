import { UserAddressModel } from './user-address.model';
import { UserInfoModel } from './user-info.model';

export interface InsuredPartyModel {
  insuredPartyDetail?: UserInfoModel;
  requesterPartyDetail?: UserInfoModel;
  address?: UserAddressModel;
  license: string;
}
