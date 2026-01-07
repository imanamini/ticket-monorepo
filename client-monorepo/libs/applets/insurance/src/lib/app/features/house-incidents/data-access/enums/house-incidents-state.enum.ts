export enum HouseIncidentsStateEnum {
  New = 'New',
  PendingPayment = 'PendingPayment',
  Paid = 'Paid',
  UserInfoCompleted = 'UserInfoCompleted',
  Issued = 'Issued',
  Refused = 'Refused',
  Draft = 'Draft',
  Cancelled = 'Cancelled'
}

export const HOUSE_INCIDENTS_STATE_TRANSLATOR = {
  [HouseIncidentsStateEnum.New]: 'جدید',
  [HouseIncidentsStateEnum.PendingPayment]: 'در انتظار پرداخت',
  [HouseIncidentsStateEnum.Paid]: 'پرداخت شده',
  [HouseIncidentsStateEnum.UserInfoCompleted]: 'تکمیل اطلاعات',
  [HouseIncidentsStateEnum.Issued]: 'صادر شده',
  [HouseIncidentsStateEnum.Refused]: 'ابطال سیستمی',
  [HouseIncidentsStateEnum.Draft]: 'پیش نویس',
  [HouseIncidentsStateEnum.Cancelled]: 'کنسل شده',
};
