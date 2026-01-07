import { GenericApiResponse } from '@client-monorepo/common/network';

export interface TollDebt extends GenericApiResponse {
  imageId: string;
  colorRange: Array<number>;
  amount: number;
  config: Config;
  details: Array<TollDetails[]>;
  totalItems: number;
  plate: TollPlate;
}

export interface TollDetails {
  amount: number;
  billId: string;
  date: string;
  dateString: string;
  gateway: string;
  messageColor: number;
  messageText: string;
}

export interface Config {
  bottomHintColor: number;
  bottomHintMessage: string;
  calenderImageId: string;
  clockImageColor: number;
  clockImageId: string;
  colorRange: [];
  deselectedAllImageId: string;
  imageId: string;
  payHintMessage: string;
  payTitle: string;
  selectAllImageId: string;
  sortImageId: string;
  titleHintColor: number;
  titleHintMessage: string;
}

export interface TollPlate {
  plainPlateNo: string;
  plateNo: string;
  vehicleDetail: {
    code: number;
    title: string;
  };
}
