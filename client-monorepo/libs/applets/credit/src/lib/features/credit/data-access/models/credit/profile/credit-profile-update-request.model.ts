export interface CreditProfileUpdateRequest {
  nationalCode?: string;
  address?: string;
  birthCertificate?: string;
  gender?: 1 | 2;
  surname?: string;
  postalCode?: string;
  name?: string;
  birthDate?: number;
  cityUid?: string;
  birthPlace?: string;
  provinceUid?: string;
  addressNo?: string;
  addressUnit?: string;
  phoneNumber?: string;
  iban?: string;
  educationUid?: string;
  jobUid?: string;
}
