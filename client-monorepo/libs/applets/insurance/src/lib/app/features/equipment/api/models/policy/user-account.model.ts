export interface UserAccountBodyModel {
  mobile: string;
  firstName: string;
  lastName: string;
  address: string;
  nationalCode: string;
}

export interface UserAccountModel {
  level: string;
  title: string;
  status: string;
  address: string;
  nationalCode: string;
  traceId: string;
  errors: string;
}
