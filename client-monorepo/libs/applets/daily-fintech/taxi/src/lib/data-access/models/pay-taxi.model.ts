export interface PayTaxiModel {
  title: string;
  description: string;
  status: number;
  driverInfo: DriverInfo;
  carInfo: TaxiCarInfo;
  amountDetails: TaxiAmountDetails[];
  configs: TaxiPayConfigs;
}

export interface DriverInfo {
  name: string;
  image: null | string;
  lineDescription: string;
}

export interface TaxiBodyData {
  terminalId: string;
  institutionId: string;
}

export interface TaxiDetectData {
  featureName: string;
  detail: TaxiDetectDetailData;
}

export interface TaxiDetectDetailData {
  className: string;
  terminalId: string;
  institutionId: string;
}

export interface TaxiCarInfo {
  name: string;
  icon: string;
  plateDetail: PlateDetail;
  maxPassengerCount: number;
}

export interface PlateDetail {
  title: string;
  platePlainText: string;
  code: string;
  imageId: string;
  color: string;
  fontColor: string;
}

export interface TaxiAmountDetails {
  amount: number;
  highlighted: boolean;
}

export interface TaxiPayConfigs {
  maxPaymentAmount: number;
  minPaymentAmount: number;
  amountPlaceHolder: string;
  paymentCard: TaxiPaymentCard;
}

export interface TaxiPaymentCard {
  icon: string;
  title: string;
  colors: number[];
  carTitle: string;
  lineTitle: string;
}

export interface TaxiPayInfo {
  amount: number;
  passengersCount: number;
}

export interface TaxiApiError {
  title: string;
  description: string;
  errorImageClass: string;
}
