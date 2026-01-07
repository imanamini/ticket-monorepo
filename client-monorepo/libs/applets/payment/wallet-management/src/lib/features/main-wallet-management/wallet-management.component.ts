import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DescriptionStepperSkeletonStyleConst } from '../../components/description-stepper/description-stepper-skeleton-style.const';
import { ChartLabelSkeletonStyleConst } from '../../components/chart/chart-label/chart-label-skeleton-style.const';
import {
  WalletManagementDescriptionConfig,
  WalletManagementDescriptionThemes,
} from '../../data-access/models/wallet-management-description-config';
import { DESCRIPTIONS } from '../../components/description-stepper/wallet-management-description.enum';
import { WalletManagementDescription } from '../../data-access/utiles/wallet-management-description';
import { SeparatedVoucherInterface } from '../../data-access/models/separated-voucher.interface';
import { separateVouchers } from '../../data-access/utiles/separate-vouchers';
import { BLOCK_DESCRIPTION } from '../../components/description-stepper/wallet-management-block-description';
import { WalletManagementBlockDescription } from '../../data-access/utiles/wallet-management-block-description';
import { ExpiredVouchersComponent } from '../../components/expired-vouchers/expired-vouchers.component';
import { VoucherDetail } from '../../data-access/models/voucher.response.interface';
import { BalanceInformationResponseInterface, BalancesInterface } from '../../data-access/models/balance.interface';
import { DonutChartSkeletonStyleConst } from '../../components/chart/donut-chart/donut-chart-skeleton-style.const';
import { WalletManagementApiService } from '@client-monorepo/applets/wallet-management';
import { SkeletonComponent } from '../../components/skeleton/skeleton.component';
import { DonutChartComponent } from '../../components/chart/donut-chart/donut-chart.component';
import { ChartLabelComponent } from '../../components/chart/chart-label/chart-label.component';
import { DescriptionStepperComponent } from '../../components/description-stepper/description-stepper.component';
import { GiftCardComponent } from '../../components/gift-card/gift-card.component';
import { ActionButtonsComponent } from '../../components/action-buttons/action-buttons.component';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { DescriptionComponent } from '../../components/description/description.component';
import { ReloadAlertService } from '../../data-access/services/reload-alert.service';
import { CashbackActionCardComponent } from '../../components/cashback-action-card/cashback-action-card.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { Router } from '@angular/router';
import { DirectDebitCardComponent } from '../../components/direct-debit-card/direct-debit-card.component';
import { WALLET_GTM_TAG, WalletGtmService } from '@client-monorepo/payment/wallet';
import { DirectDebitApiService } from 'libs/applets/payment/direct-debit/src/lib/data-access/services/direct-debit-api.service';
import { AbTestService } from '@client-monorepo/common/utilities';


@Component({
  selector: 'wallet-mng-applet-wallet-management',
  imports: [
    CommonModule,
    SkeletonComponent,
    DonutChartComponent,
    ChartLabelComponent,
    DescriptionStepperComponent,
    GiftCardComponent,
    ActionButtonsComponent,
    PageLayoutComponent,
    CashbackActionCardComponent,
    DirectDebitCardComponent,
  ],
  templateUrl: './wallet-management.component.html',
  styleUrl: './wallet-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class WalletManagementComponent implements OnInit {
  public descriptionsAlreadyRead = true;
  public descriptionsWasRead!: boolean;

  public balanceInformation = signal<BalanceInformationResponseInterface | null>(null);
  public unexpiredVouchers = signal<VoucherDetail[]>([]);
  public cashbackVouchers = signal<BalancesInterface[]>([]);
  public cashbackVouchersBalanceSum = signal<number>(0);

  public donutSkeletonStyle = DonutChartSkeletonStyleConst;
  public descriptionStepperSkeletonStyleConst = DescriptionStepperSkeletonStyleConst;
  public ChartLabelSkeletonStyleConst = ChartLabelSkeletonStyleConst;
  public descriptionTheme = WalletManagementDescriptionThemes;
  public descriptionConfig: WalletManagementDescriptionConfig = {
    descriptionEnum: DESCRIPTIONS,
    headerTitle: 'موجودی کیف پول',
    stateHandler: WalletManagementDescription,
    status: 'normal',
  };
  public blockDescriptionConfig!: WalletManagementDescriptionConfig;

  private readonly bottomSheet = inject(NgxBottomSheetService);
  private readonly router = inject(Router);
  private readonly walletManagementService = inject(WalletManagementApiService);
  private readonly reloadAlertService = inject(ReloadAlertService);
  private readonly gtmWallet = inject(WalletGtmService);
  public showDirectDebit = AbTestService.showDirectDebit();
  public onInit = true;
  public hasBlockBalance = false;

  ngOnInit(): void {
    this.descriptionsAlreadyRead = new this.descriptionConfig.stateHandler().getState();
    this.subscribeToReload();
    this.getBalances();
  }

  public getVouchers(): void {
    this.walletManagementService.getVouchers().subscribe((voucherDetails) => {
      if (voucherDetails) {
        const seperatedVouchers: SeparatedVoucherInterface = separateVouchers(voucherDetails);
        this.unexpiredVouchers.set(seperatedVouchers.unexpiredVouchers);
        const expiredVouchers = seperatedVouchers.expiredVouchers;
        if (expiredVouchers.length > 0 && this.onInit) {
          this.showExpiredVouchers(expiredVouchers);
          this.onInit = false;
        }
      }
    });
  }

  private getBalances() {
    this.walletManagementService.getBalances().subscribe({
      next: (data) => {
        const cashbackList = this.mapCashbackVoucher(data.balances);
        this.cashbackVouchers.set(cashbackList);

        this.cashbackVouchersBalanceSum.set(
          cashbackList.reduce((acc, curr) => {
            return acc + curr.balance;
          }, 0),
        );
      },
    });
  }

  private mapCashbackVoucher(voucherDetails: BalancesInterface[]): BalancesInterface[] {
    return voucherDetails.filter((item) => item.restriction?.businessIds?.length > 0);
  }

  public getBalanceInformation(): void {
    this.balanceInformation.set(null);
    this.walletManagementService.getBalanceInformation().subscribe((response) => {
      this.balanceInformation.set(response);
      this.setBlockDescription(response.blockedBalance);
    });
  }

  setBlockDescription(blockedBalance: number) {
    if (Number(blockedBalance) === 0) return;
    this.blockDescriptionConfig = {
      descriptionEnum: BLOCK_DESCRIPTION(blockedBalance),
      headerTitle: 'موجودی مسدود شده',
      stateHandler: WalletManagementBlockDescription,
      status: 'blocked-balance',
    };

    this.hasBlockBalance = true;
  }

  public showExpiredVouchers(expiredVouchers: VoucherDetail[]): void {
    this.bottomSheet.openBottomSheet(ExpiredVouchersComponent, {
      data: expiredVouchers,
    });
  }


  private subscribeToReload(): void {
    this.reloadAlertService.reload.subscribe(() => {
      this.getVouchers();
      this.getBalanceInformation();
    });
  }

  onBack() {
    this.router.navigate(['/']);
  }

  public onHintWasRead(): void {
    this.descriptionsWasRead = true;
  }

  public showDescription(): void {
    this.bottomSheet.openBottomSheet(DescriptionComponent, {});
    this.gtmWallet.publishEvent(WALLET_GTM_TAG.WALLET_INFO);
  }
}
