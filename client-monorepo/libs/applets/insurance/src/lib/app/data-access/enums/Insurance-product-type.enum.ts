export enum InsuranceProductTypeEnum {
  ThirdParty = 'ThirdParty',
  Body = 'Body',
  Equipment = 'Equipment',
  HouseIncidents = 'HouseIncidents',
  ThirdPartyMotor = 'ThirdPartyMotor',
}

export const InsuranceProductTypeLabelEnum: Record<InsuranceProductTypeEnum, string> = {
  [InsuranceProductTypeEnum.ThirdParty]: 'شخص ثالث خودرو',
  [InsuranceProductTypeEnum.Body]: 'بدنه',
  [InsuranceProductTypeEnum.Equipment]: 'تجهیزات دیجیتال',
  [InsuranceProductTypeEnum.HouseIncidents]: 'خانه',
  [InsuranceProductTypeEnum.ThirdPartyMotor]: 'شخص ثالث موتور',
};
