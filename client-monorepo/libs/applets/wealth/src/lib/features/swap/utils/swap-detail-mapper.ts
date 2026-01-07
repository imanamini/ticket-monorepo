import { ISwapChangeDetail } from '../models';

export type BalanceGroup<K extends 'withdrawableBalance' | 'uncollectibleBalance'> = {
  total: number;
  detail: Array<Pick<ISwapChangeDetail, 'walletName' | 'walletTitle'> & Record<K, number>>;
};

export type WalletBalancesOutput = {
  current: {
    withdrawableBalance: BalanceGroup<'withdrawableBalance'>;
    uncollectibleBalance: BalanceGroup<'uncollectibleBalance'>;
  };
};

export class WalletBalancesMapper {
  static toSummary(input: ISwapChangeDetail[]): WalletBalancesOutput {
    const current = input ?? [];

    const withdrawableBalance: BalanceGroup<'withdrawableBalance'> = {
      total: current.reduce((sum, x) => sum + (x.withdrawableBalance ?? 0), 0),
      detail: current.map(({ walletName, walletTitle, withdrawableBalance }) => ({
        walletName,
        walletTitle,
        withdrawableBalance: withdrawableBalance ?? 0,
      })),
    };

    const uncollectibleBalance: BalanceGroup<'uncollectibleBalance'> = {
      total: current.reduce((sum, x) => sum + (x.uncollectibleBalance ?? 0), 0),
      detail: current.map(({ walletName, walletTitle, uncollectibleBalance }) => ({
        walletName,
        walletTitle,
        uncollectibleBalance: uncollectibleBalance ?? 0,
      })),
    };

    return {
      current: {
        withdrawableBalance,
        uncollectibleBalance,
      },
    };
  }
}
