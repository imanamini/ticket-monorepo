const base = '/direct-debits';

export const DIRECT_DEBIT_ENDPOINT = {
  base: `${base}`,
  contracts: `${base}/contracts`,
  cancel: (contractId: string) => `${base}/contracts/cancel/${contractId}`,
  activate: (contractId: string) => `${base}/contracts/activate/${contractId}`,
  deactivate: (contractId: string) => `${base}/contracts/deactivate/${contractId}`,
  search: `${base}/contracts/in-app/search`,
  register: `${base}/contracts/in-app/register`,
  validateContract: `${base}/contracts/in-app/validate`,
  banks: `${base}/banks`,
} as const;
