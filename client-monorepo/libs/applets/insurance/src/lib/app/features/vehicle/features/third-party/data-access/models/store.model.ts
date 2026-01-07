import { ThirdPartyJourneyTypeEnum } from '../enums/third-party-journey-type.enum';
import { VehicleInfoModel } from './vehicle-info.model';
import { InsuranceModel } from './insurance.model';
import { IdTitleModel } from './id-title.model';
import {
  UploadedDocumentModel
} from '../../../../data-access/models/third-party/upload-document/uploaded-document.model';
import { UserInfoModel } from '../../../../data-access/models/application-form/user-info.model';
import { UserAddressModel } from '../../../../data-access/models/application-form/user-address.model';

export interface StoreModel {
  journeyType: ThirdPartyJourneyTypeEnum;
  vehicleInfo?: VehicleInfoModel;
  previousInsurance?: InsuranceModel;
  duration?: IdTitleModel;
  coverageRate?: IdTitleModel;
  insuredParty?: UserInfoModel;
  requesterParty?: UserInfoModel;
  license?: string;
  address?: UserAddressModel;
  documents?: UploadedDocumentModel[];
  requiredDocuments?: UploadedDocumentModel[];
}
