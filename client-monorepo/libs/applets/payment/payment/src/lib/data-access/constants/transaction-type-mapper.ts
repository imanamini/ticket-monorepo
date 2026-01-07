import { Action, ActionType } from '@client-monorepo/common/action-handler';

export const TransactionTypeMapper: Record<string, Action> = {
  subscription: {
    type: ActionType.REDIRECT,
    payload: {
      url: 'subscription',
    },
  },
  bill: {
    type: ActionType.REDIRECT,
    payload: {
      url: 'bill',
    },
  },
  internet: {
    type: ActionType.REDIRECT,
    payload: {
      url: 'internet',
    },
  },
  c2c: {
    type: ActionType.REDIRECT,
    payload: {
      url: 'service/c2c',
    },
  },
  donation: {
    type: ActionType.REDIRECT,
    payload: {
      url: 'donation',
    },
  },
  'driving-fine': {
    type: ActionType.REDIRECT,
    payload: {
      url: 'fine',
    },
  },
  'highway-toll': {
    type: ActionType.REDIRECT,
    payload: {
      url: 'toll',
    },
  },
  'top-up': {
    type: ActionType.REDIRECT,
    payload: {
      url: 'top-up',
    },
  },
  'cash-in': {
    type: ActionType.REDIRECT,
    payload: {
      url: 'wallet-management',
    },
  },
  'taxi-pay': {
    type: ActionType.REDIRECT,
    payload: {
      url: 'qr',
    },
  },
  'offline-payment': {
    type: ActionType.REDIRECT,
    payload: {
      url: '',
    },
  },
  wallet: {
    type: ActionType.REDIRECT,
    payload: {
      url: 'wallet-management',
    },
  },
};
