import { WritableSignal } from '@angular/core';

export type InstallmentsOverviewBnplList = InstallmentsOverviewBnplListItem[];

export interface InstallmentsOverviewBnplListItem {
  dueDate: number;
  installments: InstallmentsOverviewBnplInstallment[];
}

export interface InstallmentsOverviewBnplInstallment {
  checked: WritableSignal<boolean>;
  contractTrackingCode: string;
  creditId: string;
  contractTotalInstallmentsCount: number;
  isDue: boolean;
  order: number;
  amount: number;
  penalty: number;
  penaltyWaiverAmount: number;
  fee: number;
  merchantBusinessIds?: string[];
  title: string;
  billingCycleInfo?: {
    startDate: number;
    endDate: number;
  };
}

export type InstallmentsOverviewBnplInitSelected =
  | {
      type: 'Account';
      creditId: string;
    }
  | {
      type: 'XPay';
    }
  | {
      type: 'ContractFirstInstallment';
      contractTrackingCode: string;
    };

export const InstallmentsOverviewBnplHistoryStateKey = 'bnplInitSelect';
