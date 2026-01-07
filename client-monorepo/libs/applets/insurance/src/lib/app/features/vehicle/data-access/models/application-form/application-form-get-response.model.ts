import {
  ThirdPartyJourneyTypeEnum
} from '../../../features/third-party/data-access/enums/third-party-journey-type.enum';
import { AppFormInsuranceCompanyModel } from './app-form-insurance-company.model';
import { InsuranceDetailModel } from './insurance-detail.model';
import { PriceOptionModel } from './price-option.model';
import { VehicleInfoModel } from './vehicle-info.model';
import { PolicyStateModel } from '../../../../policy/data-access/models/policy-state.model';
import { VEHICLE_POLICY_STATE_ENUM } from '../../../../policy/data-access/enums/vehicle-policy-state.enum';
import { VEHICLE_ORDER_STATE_ENUM } from '../../../../../data-access/enums/vehicle-order-state.enum';
import { UploadedDocumentModel } from '../third-party/upload-document/uploaded-document.model';
import { Price } from '../third-party/policy/price.model';
import { UserAddressModel } from './user-address.model';
import { UserInfoModel } from './user-info.model';
import { PolicyEndorsementModel } from './policy-endorsement.model';

export interface ApplicationFormGetResponseModel {
  applicationFormId: string;
  license: string;
  trackingCode: number;
  price: Price;
  nationalCode: string;
  vehicleInfo: VehicleInfoModel;
  previousInsuranceDetail: InsuranceDetailModel;
  currentInsurerParty: AppFormInsuranceCompanyModel;
  durationId: number;
  duration: string;
  coverageRateId: number;
  coverageRate: string;
  priceOptions: PriceOptionModel[];
  journeyType: ThirdPartyJourneyTypeEnum;
  state: PolicyStateModel<VEHICLE_POLICY_STATE_ENUM, VEHICLE_ORDER_STATE_ENUM>;
  address: UserAddressModel;
  insuredParty: UserInfoModel;
  requesterParty: UserInfoModel;
  documents: UploadedDocumentModel[];
  requiredDocuments: UploadedDocumentModel[];
  endorsements?: PolicyEndorsementModel[];
}
