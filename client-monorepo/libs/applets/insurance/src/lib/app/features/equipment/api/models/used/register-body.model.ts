import { RegisterTypes } from '../../../routes/used/steps/used-device-info/models/used-register-types.model';

export interface RegisterBodyModel {
  category: string;
  utmSource: string;
  productModelId: string;
  productBrandId: string;
  serial: string;
  brand: string;
  model: string;
  registerType: RegisterTypes;
}
