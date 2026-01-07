import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { ImageComponent } from '../../../../../shared/components/image/image.component';
import { LocationService } from '../../../../../shared/services/location.service';
import { BackToOriginService } from '../../../../../shared/services/back-to-origin.service';
import { HOME_ROUTE, INVESTMENT_LIST_ROUTE, TRANSACTIONS_ROUTE } from '../../../../../data-access/constants/app-routes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { RouteStateService } from '@client-monorepo/common/utilities';
import { ActivatedRoute, Params } from '@angular/router';
import { NgxBadgeStatus } from '@digipay/ngx-badge/lib/ngx-badge.type';
import { ProfileInfoCardConfig } from '../../../models/profile-config.model';
import { NgClass } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { IFundProfitDetail } from '../../models/fund-profit-detail.interface';
import { IFundDetail } from 'libs/applets/wealth/src/lib/components/core/models/fund-schemas';
import { IFundProfileInfoState } from '../../models';

@Component({
  selector: 'app-fund-profile-info-card',
  standalone: true,
  imports: [ImageComponent, NgxBadgeModule, NgClass, NgxButtonComponent, NgxDividerComponent],
  templateUrl: './fund-profile-info-card.component.html',
  styleUrl: './fund-profile-info-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FundProfileInfoCardComponent implements OnInit {
  private navigationService = inject(WealthNavigationService);
  private routeState = inject(RouteStateService);
  private location = inject(LocationService);
  private activatedRoute = inject(ActivatedRoute);
  private backToOrigin = inject(BackToOriginService);
  protected readonly BorderColorsEnum = BorderColorsEnum;

  profile = input.required<IFundDetail>();
  config = signal<ProfileInfoCardConfig>({
    hasProfitTable: true,
    statistics: [{ key: 'تقسیم سود دوره‌ای', value: '', singleLine: false }],
  });
  fundProfitDetail = signal<IFundProfitDetail[]>([]);
  state = signal<IFundProfileInfoState | undefined>(undefined);
  qParams: Params;

  riskLevel = computed(() => {
    type RiskLevel = { text: string; badge: NgxBadgeStatus };
    let riskLevel: RiskLevel;
    switch (this.profile().riskLevel) {
      case 'high':
        riskLevel = { text: 'ریسک بالا', badge: 'error' };
        break;
      case 'mediumhigh':
        riskLevel = { text: 'ریسک نسبتا زیاد', badge: 'warning' };
        break;
      case 'medium':
        riskLevel = { text: 'ریسک متوسط', badge: 'warning' };
        break;
      case 'low':
        riskLevel = { text: 'ریسک پایین', badge: 'success' };
        break;

      default:
        riskLevel = { text: 'بدون ریسک', badge: 'success' };
        break;
    }
    return riskLevel;
  });

  ngOnInit() {
    this.state.set(this.routeState.getAll());
    this.qParams = this.activatedRoute.snapshot.queryParams;
    this.configureCard();
    this.setProfitDetail();
  }

  private setProfitDetail() {
    if (this.profile().symbol === 'IRTKZARV0001') {
      if (this.profile().monthlyEfficiency) {
        this.fundProfitDetail().push({
          title: this.profile().type === 'FixedIncome' ? 'بازده ماهانه' : 'بازده ماه اخیر',
          value: `${this.profile().monthlyEfficiency}%`,
        });
      }
      if (this.profile().annualEfficiency) {
        this.fundProfitDetail().push({
          title: 'بازده از آغاز معاملات',
          value: `${this.profile().annualEfficiency}%`,
        });
      }
    } else {
      if (this.profile().annualEfficiency) {
        this.fundProfitDetail().push({
          title: this.profile().type === 'FixedIncome' ? 'بازده سالانه' : 'بازده سال اخیر ',
          value: `${this.profile().annualEfficiency}%`,
        });
      }
      if (this.profile().compoundProfit) {
        this.fundProfitDetail().push({
          title: 'بازده مرکب سالانه',
          value: `${this.profile().compoundProfit}%`,
        });
      }
      if (this.profile().monthlyEfficiency) {
        this.fundProfitDetail().push({
          title: this.profile().type === 'FixedIncome' ? 'بازده ماهانه' : 'بازده ماه اخیر',
          value: `${this.profile().monthlyEfficiency}%`,
        });
      }
    }
  }

  onBackClicked() {
    this.checkEnterMode(this.location.lastRoute);
  }

  onTransactionsClicked() {
    this.navigationService.navigate([TRANSACTIONS_ROUTE]);
  }

  checkEnterMode(mode: string) {
    const url = mode?.split('?')[0];
    const queryParams = {
      type: this.profile().type,
    };
    if (this.state()['referrer']) {
      queryParams['referrer'] = this.state()['referrer'];
    }
    if (this.qParams['referrer']) {
      this.backToOrigin.goBackToOrigin();
    } else {
      switch (url) {
        case '/home':
          this.navigationService.navigate([HOME_ROUTE]);
          break;
        case '/portfo':
        case '/all-profiles':
          window.history.back();
          break;
        case null:
        case undefined:
          this.backToOrigin.goBackToOrigin();
          break;
        case '/investments':
        case 'refresh':
        default:
          this.navigationService.navigateWithQueryParams([INVESTMENT_LIST_ROUTE], {
            queryParams: queryParams,
          });
      }
    }
  }

  configureCard() {
    switch (this.profile().symbol) {
      case 'IRT1SKDF0001':
      case 'IRT1VBAZ0001':
        this.config.set({
          hasProfitTable: true,
          statistics: [
            {
              key: 'بازده مورد انتظار',
              value: this.profile().expectedProfit,
              singleLine: true,
            },
            {
              key: 'تقسیم سود دوره‌ای',
              value: this.profile().dividendDescription,
              singleLine: true,
            },
          ],
        });
        break;
      case 'DIGIKALA':
        this.config.set({
          hasProfitTable: false,
          statistics: [
            {
              key: 'بازده از روز عرضه',
              value: '24%',
              singleLine: true,
            },
            {
              key: 'وضعیت نماد',
              value: this.profile().dividendDescription,
              singleLine: true,
            },
          ],
        });
        break;
      default:
        this.config.set({
          hasProfitTable: true,
          statistics: [
            {
              key: 'تقسیم سود دوره‌ای',
              value: this.profile().dividendDescription,
              singleLine: !this.profile().dividendPeriod,
            },
          ],
        });
        break;
    }
  }
}
