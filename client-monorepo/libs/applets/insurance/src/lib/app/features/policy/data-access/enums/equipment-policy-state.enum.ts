export enum EQUIPMENT_POLICY_STATE_ENUM {
  PAID_POLICY = 'PaidPolicy',
  ACTIVE = 'Active',
  PENDING = 'Pending',
  CANCELLED = 'Cancelled',
  Expired = 'Expired',
  Terminated = 'Terminated',
  Broken = 'Broken',
  EffectiveActive = 'EffectiveActive',
  SubscriptionOffline = 'SubscriptionOffline',
  Renewal = 'Renewal',
  NewForRenewal = 'NewForRenewal',
  PAID_POLICY_PENDING = 'PaidPolicyPending',
  OfflineSerialComplete = 'OfflineSerialComplete',
  OfflineImageUploaded = 'OfflineImageUploaded',
}

export const EQUIPMENT_POLICY_STATE_ENUM_TRANSLATION = {
  [EQUIPMENT_POLICY_STATE_ENUM.PAID_POLICY]: 'پرداخت شده',
  [EQUIPMENT_POLICY_STATE_ENUM.ACTIVE]: 'صادر شده ',
  [EQUIPMENT_POLICY_STATE_ENUM.PENDING]: 'در انتظار پرداخت',
  [EQUIPMENT_POLICY_STATE_ENUM.CANCELLED]: 'لغو شده',
  [EQUIPMENT_POLICY_STATE_ENUM.Expired]: 'منقضی شده',
  [EQUIPMENT_POLICY_STATE_ENUM.Terminated]: 'منقضی شده',
  [EQUIPMENT_POLICY_STATE_ENUM.Broken]: 'خراب',
  [EQUIPMENT_POLICY_STATE_ENUM.EffectiveActive]: 'صادر شده - فعال',
  [EQUIPMENT_POLICY_STATE_ENUM.SubscriptionOffline]: 'پرداخت شده',
  [EQUIPMENT_POLICY_STATE_ENUM.Renewal]: 'در انتظار تمدید',
  [EQUIPMENT_POLICY_STATE_ENUM.NewForRenewal]: 'در انتظار تمدید',
  [EQUIPMENT_POLICY_STATE_ENUM.PAID_POLICY_PENDING]: 'در انتظار تکمیل اطلاعات',
  [EQUIPMENT_POLICY_STATE_ENUM.OfflineSerialComplete]: 'پرداخت شده',
  [EQUIPMENT_POLICY_STATE_ENUM.OfflineImageUploaded]: 'پرداخت شده',

};
