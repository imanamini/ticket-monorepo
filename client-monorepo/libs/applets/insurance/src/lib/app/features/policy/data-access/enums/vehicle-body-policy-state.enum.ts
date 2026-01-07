// These states are formatted according to their relative states in provider
export enum VEHICLE_BODY_POLICY_STATE_ENUM {
  INQUIRY = 'inquiry',
  DEBTOR = 'debtor',
  DOCUMENTDEFECT = 'documentdefect',
  PENDING = 'pending',
  ISSUED = 'issued',
  CANCELED = 'canceled',
  REJECTED = 'rejected',
  VISITDOCUMENTDEFECT = 'visitdocumentdefect',
  WAITINGFORADDRESSREGISTRATION = 'waitingforaddressregistration',
  REVIEWADDRESS = 'reviewaddress',
  REVIEWFAILEDADDRESS = 'reviewfailedaddress',
}

export const VEHICLE_BODY_POLICY_STATE_ENUM_TRANSLATION = {
  [VEHICLE_BODY_POLICY_STATE_ENUM.INQUIRY]: 'تکمیل اطلاعات',
  [VEHICLE_BODY_POLICY_STATE_ENUM.DEBTOR]: 'در انتظار پرداخت ما به تفاوت',
  [VEHICLE_BODY_POLICY_STATE_ENUM.DOCUMENTDEFECT]: 'در انتظار تکمیل مدارک',
  [VEHICLE_BODY_POLICY_STATE_ENUM.PENDING]: 'در حال صدور',
  [VEHICLE_BODY_POLICY_STATE_ENUM.ISSUED]: 'صادر شده',
  [VEHICLE_BODY_POLICY_STATE_ENUM.CANCELED]: 'فسخ شده',
  [VEHICLE_BODY_POLICY_STATE_ENUM.REJECTED]: 'رد شده',
  [VEHICLE_BODY_POLICY_STATE_ENUM.VISITDOCUMENTDEFECT]: 'در انتظار بازدید کارشناس',
  [VEHICLE_BODY_POLICY_STATE_ENUM.WAITINGFORADDRESSREGISTRATION]: 'در انتظار ثبت آدرس',
};
