export interface InformationBodyModel {
  key: string;
  firstName: string;
  lastName: string;
  customerMobile: string;
  hasDifferentHolder: boolean;
  nationalCode: string;
  address?: string;
  serial: string;
}
