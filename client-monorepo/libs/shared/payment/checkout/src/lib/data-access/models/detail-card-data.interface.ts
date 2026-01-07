import { DetailCardEnum } from './detail-card.enum';

export interface DetailCardDataInterface {
  title: string;
  imageId: string;
  details: Array<DetailData>;
}
export interface DetailData {
  label: string;
  value: any;
  type: DetailCardEnum;
}
