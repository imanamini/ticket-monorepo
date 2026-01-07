export interface PreviousInsuranceCompany {
  id: number;
  name: string;
  logo: string;
  deadline: number;
  thirdPartyDiscount: string;
  driverDiscount: string;
  driverDamage: string;
  propertyDamage: string;
  healthDamage: string;
  vehicleOwnerChanged: boolean;
}
