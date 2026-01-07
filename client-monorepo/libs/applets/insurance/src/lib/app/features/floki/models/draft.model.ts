import { FileModel } from './file.model';

export interface DraftModel {
  applicationFormId: string;
  assetPrice: number;
  productId: string;
  productName: string;
  insurerPartyId?: any;
  insurerPartyName: string;
  insuredPartyNationalCode: string;
  insuredAssetName: string;
  insuredAssetSerialNumber: string;
  commitmentDuration?: any;
  discountCode?: any;
  discountAmount: number;
  price: number;
  priceBeforeDiscount?: any;
  state: string;
  assetName?: any;
  insuredPartyFirstName?: any;
  insuredPartyLastName?: any;
  serialNumber?: any;
  imageName?: any;
  imagePath?: any;
  documents?: FileModel[];
}
