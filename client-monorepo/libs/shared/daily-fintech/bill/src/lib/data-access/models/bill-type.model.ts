export interface BillTypeModel {
  title: string;
  imageId: string;
  type: number;
  inquiryMethods: Array<number>;
  badgeTitle: string;
  pageTitle: string;
  badge: BadgeModel;
  active: boolean;
  payUrl: string;
  payMethods: Array<number>;
}

export interface BadgeModel {
  value: string;
  message: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
}
