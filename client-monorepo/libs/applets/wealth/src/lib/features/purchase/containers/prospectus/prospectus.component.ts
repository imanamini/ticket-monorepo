import { Location } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { Component, computed, inject, OnInit, signal } from '@angular/core';

import { IProspectusRouteState } from '../../../../components/core/models/prospectus-route-state.interface';
import {
  CAMPAIGN_AGREEMENT_ROUTE,
  CHOICE_PAYMENT_METHOD_ROUTE,
  HOME_ROUTE,
  INVESTMENT_LIST_ROUTE,
  PURCHASE_ROUTE,
  SIGN_AGREEMENTS_ROUTE,
  WALLET_BNPL_RECHARGE,
  WALLET_BNPL_REQUEST_ROUTE,
  WALLET_CASH_IN_ROUTE,
  WALLET_CASH_OUT_ROUTE,
  WALLET_FX_BNPL,
  WALLET_FX_DEPOSIT,
  WALLET_FX_WITHDRAW,
  WALLET_GOLD_BNPL,
  WALLET_GOLD_DEPOSIT,
  WALLET_GOLD_WITHDRAW,
  WALLET_MIX_BNPL,
} from '../../../../data-access/constants/app-routes';
import { EpdfType } from '../../../../components/core/models/instruments.enum';
import { getPDFSource, SYMBOL_MAP } from '../../../../components/core/models/static-pdf-maps';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { MessageService, RouteStateService } from '@client-monorepo/common/utilities';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-prospectus',
  templateUrl: './prospectus.component.html',
  styleUrls: ['./prospectus.component.scss'],
  standalone: true,
  imports: [PdfViewerModule, NgxAppBarComponent, SpinnerComponent],
})
export class ProspectusComponent implements OnInit {
  loading = signal<boolean>(true);
  state = signal<IProspectusRouteState | undefined>(undefined);

  titleMap: Record<EpdfType, string> = {
    [EpdfType.STATUTE]: 'اساسنامه',
    [EpdfType.REGULATIONS]: 'قوانین و مقررات',
    [EpdfType.CONTRACT]: 'قرارداد دیجی‌پی',
    [EpdfType.RISKSTATEMEBT]: 'بیانیه ریسک',
    [EpdfType.PROSPECTUS]: 'امیدنامه',
  };

  pdfSrc = signal<string>('');
  pageTitle = computed(() => {
    return this.state()?.agreement ? this.state().agreementTitle : this.titleMap[this.state().pdfType];
  });
  pdfBlob = signal<Uint8Array | undefined>(undefined);

  private location = inject(Location);
  private routeState = inject(RouteStateService);
  private messageService = inject(MessageService);
  private navigationService = inject(WealthNavigationService);

  ngOnInit(): void {
    this.state.set(this.routeState.getAll());
    if (!this.state()?.symbol) {
      this.navigationService.navigate([HOME_ROUTE]);
    } else {
      this.getInfo();
    }
  }

  async getInfo() {
    const state = this.state();

    if (state?.agreement) {
      await this.convertToUint8Array();
      return;
    }
    const symbol =
      state.pdfType === EpdfType.RISKSTATEMEBT ? SYMBOL_MAP.get('CROWD') : SYMBOL_MAP.get(state.type === 'IPO' ? state.type : state.symbol);

    this.pdfSrc.set(getPDFSource(symbol, state.pdfType));
  }

  async convertToUint8Array() {
    this.pdfBlob.set(new Uint8Array(await this.state()?.pdfFile.arrayBuffer()));
  }

  onBackHandler() {
    if (this.state().type === 'campaign') {
      this.navigationService.navigateWithState([CAMPAIGN_AGREEMENT_ROUTE], {
        state: {
          campaignCode: this.state().campaignData.campaignCode,
          userInfo: this.state().campaignData.userInfo,
          agreements: this.state().campaignData.agreements,
        },
      });
    } else if (this.state().type === 'IPO') {
      this.navigationService.navigate([CHOICE_PAYMENT_METHOD_ROUTE, this.state().symbol], {
        state: this.state(),
      });
    } else {
      if (this.state().symbol === 'treasury') {
        let route = '';
        switch (this.state().type) {
          case 'WALLET_FX':
            route = WALLET_FX_DEPOSIT;
            break;
          case 'WALLET_GOLD':
            route = WALLET_GOLD_DEPOSIT;
            break;
          case 'cashin':
            route = WALLET_CASH_IN_ROUTE;
            break;
          case 'cashout':
            route = WALLET_CASH_OUT_ROUTE;
            break;
          case 'bnplRequest':
            route = WALLET_BNPL_REQUEST_ROUTE;
            break;
          case 'bnplRecharge':
            route = WALLET_BNPL_RECHARGE;
            break;
          case 'withdraw_gold':
            route = WALLET_GOLD_WITHDRAW;
            break;
          case 'withdraw_fx':
            route = WALLET_FX_WITHDRAW;
            break;
          case 'deposit_fx':
            route = WALLET_FX_DEPOSIT;
            break;
          case 'deposit_gold':
            route = WALLET_GOLD_DEPOSIT;
            break;
          case 'bnpl_fx':
            route = WALLET_FX_BNPL;
            break;
          case 'bnpl_gold':
            route = WALLET_GOLD_BNPL;
            break;
          case 'bnpl_mix':
            route = WALLET_MIX_BNPL;
            break;
        }
        this.navigationService.navigateWithState([route, this.state().symbol], {
          state: this.state(),
        });
      } else {
        if (this.state().agreement) {
          this.navigationService.navigateWithState([SIGN_AGREEMENTS_ROUTE], {
            state: this.state(),
          });
        } else if (this.state().backToProfile) {
          this.location.back();
        } else {
          if (this.state().investmentType === 'CrowdFund') {
            this.navigationService.navigateWithOptions([PURCHASE_ROUTE, this.state().symbol], {
              queryParams: { crowdFunding: true },
              state: this.state(),
            });
          } else {
            this.navigationService.navigateWithState([this.state()?.type === 'sell' ? 'sell' : 'purchase', this.state()?.symbol], {
              state: {
                amount: this.state()?.amount,
                agreementChecked: this.state()?.agreementChecked,
              },
            });
          }
        }
      }
    }
  }

  showError() {
    this.messageService.showErrorMessage('دریافت اطلاعات با خطا مواجه شد', 'لطفاً مجدد تلاش کنید');
    this.onBackHandler();
  }
}
