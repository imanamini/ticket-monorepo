export interface UserInfoModel {
  firstName: string;
  lastName: string;
  nationalCode: string;
  birthDate: number;
  email?: string;
  mobile: string;
}

export interface UserInfoMotorModel extends UserInfoModel {
  license: string;
}
