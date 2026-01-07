export const WalletStatuses: { [key: number]: string } = {
  0: 'INACTIVE',
  1: 'ACTIVE',
  2: 'INCOMPLETE_DOCUMENTS',
  3: 'EXPIRED',
  4: 'OPERATIONAL_INPROGRESS',
  5: 'OPERATIONAL_REJECTION',
  6: 'COMPLETED',
  8: 'READY_TO_CLOSE',
  9: 'CLOSE',
  10: 'CLOSE_REJECTED',
  11: 'CLOSE_CONTRADICTED',
};

export const transformWalletStatus = (statusCode: number) => {
  return WalletStatuses[statusCode];
};
