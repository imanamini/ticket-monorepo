export enum VEHICLE_POLICY_STATE_ENUM {
  PENDING_PAYMENT = 'PendingPayment',
  PENDING_INFORMATION = 'PendingInformation',
  ISSUING = 'Issuing',
  ISSUED = 'Issued',
  REFUSED = 'Refused',
  EXPIRING = 'Expiring',
  EXPIRED = 'Expired',
  PRICE_CONFLICT_RESOLVE_PENDING = 'PriceConflictResolvePending',
  DOCUMENTS_CONFLICT_RESOLVE_PENDING = 'DocumentsConflictResolvePending',
  WAITING_FOR_ADDRESS_REGISTRATION = 'WaitingForAddressRegistration',
  VERIFY_ADDRESS_REGISTRATION = 'VerifyAddressRegistration',
  CANCELLED = 'Cancelled'
}
