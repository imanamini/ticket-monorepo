import {Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID} from '@angular/core';
import {
  CreditFundProviderGroupCardModel,
  PAYMENT_METHOD
} from '../../../../models/credit/credit-fund-provider-group-card.model';
import {DialogBottomSheetService} from '../../../../../core/services/dialog-bottom-sheet.service';
import {UiDialogSimpleComponent} from '../../../ui-dialogs/ui-dialog-simple/ui-dialog-simple.component';
import {StyledSwitchOption} from '../../../../models/switch-option.model';
import {ScreenSize} from '../../../../../api/digipay/models/common/screen-size';
import {LayoutService} from '../../../../../website/services/layout.service';
import {CreditCalculatorService} from '../../../../../api/clients/credit/credit-calculator/credit-calculator.service';
import {Router} from '@angular/router';
import {
  UiDialogSubscriptionDetailsComponent
} from '../../../ui-dialogs/ui-dialog-subscription-details/ui-dialog-subscription-details.component';
import {SubscriptionType} from '../../../../models/credit/subscription-detail.model';
import {CurrencyPipe} from '../../../../ui-pipes/currency.pipe';
import {UiButtonComponent} from '../../../ui-button/ui-button/ui-button.component';
import {UiAnimatedSwitchComponent} from '../../../ui-switch/ui-animated-switch/ui-animated-switch.component';
import {ApiImageModule} from '@digipay/ng-ui-api-image';
import {isPlatformBrowser, NgClass, NgIf, NgStyle} from '@angular/common';
import {UiIconDirective} from '../../../../ui-directive/ui-icon.directive';
import {PlanRuleEnum} from '../../../../models/credit/credit-plan-detail.response';
import {NumberToStringPipe} from '../../../../ui-pipes/number-to-string.pipe';
import {IranianRialsPipe} from '../../../../ui-pipes/iranian-rials.pipe';

@Component({
  selector: 'app-credit-fund-provider-groups-card',
  templateUrl: './credit-fund-provider-groups-card.component.html',
  styleUrls: ['./credit-fund-provider-groups-card.component.scss'],
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    NgStyle,
    ApiImageModule,
    UiIconDirective,
    UiAnimatedSwitchComponent,
    UiButtonComponent,
    CurrencyPipe,
    NumberToStringPipe,
    IranianRialsPipe,
  ],
})
export class CreditFundProviderGroupsCardComponent implements OnInit {
  @Input() data: CreditFundProviderGroupCardModel;

  @Input() certainPlan: boolean;

  @Input() certainFundProviderCode = null;

  @Input() showFundProviderIcon = true;

  @Input() showInterestPercentage = true;

  @Output() ctaClick = new EventEmitter<void>();

  @Output() selectCollateral = new EventEmitter<string>();

  animatedHeight: number;

  animatedOptions: Array<StyledSwitchOption> = [];

  selectedCollateral: StyledSwitchOption;

  infrastructureDescription =
    'مجموع هزینه‌های (تشکیل پرونده، آماده سازی زیرساخت، مالیات و ...) که با عنوان  هزینه خدمات و زیرساخت، ' +
    'در آخرین مرحله ثبت‌نام قبل از تخصیص اعتبار به صورت نقدی دریافت می‌گردد.';

  totalPayableDescription: string = null;

  fundProviderLink: string = null;

  @Input()
  isDetailPageCtaDisplayed = true;

  collateralTitle: string;
  protected readonly PAYMENT_METHOD = PAYMENT_METHOD;

  constructor(
    private dialogBottomSheet: DialogBottomSheetService,
    private layoutService: LayoutService,
    private creditCalculatorService: CreditCalculatorService,
    private router: Router,
    private dialog: DialogBottomSheetService,
    @Inject(PLATFORM_ID) protected platformId: string,
  ) {
  }

  ngOnInit(): void {
    if (this.data.fundProviderName == 'دیجی‌پی') {
      this.totalPayableDescription =
        'این مبلغ شامل هزینه های تسهیل‌گری خدمات خرید اقساطی' +
        ' (ایجاد و توسسعه زیرساخت‌ها، انجام فرایند‌ها، عملیاات پشتیبانی، توسعه و نگه‌داری محصول و ...) می‌باشد.';
    }

    this.initializeAnimatedSwitch();

    this.fundProviderLink = this.createLinkToFundProviderPage(this.data.fundProviderCode);
    this.layoutService.screenSizeChanged.subscribe((value) => {
      if (value === ScreenSize.isDesktop) {
        this.animatedHeight = 51;
      } else if (value === ScreenSize.isTablet) {
        this.animatedHeight = 45;
      } else {
        this.animatedHeight = 42;
      }
    });
    this.collateralTitle = this.data.collaterals.map((item) => item.name).join(' یا ');
  }

  onCtaClick(): void {
    this.ctaClick.emit();
  }

  openDialog(type: string) {
    this.dialogBottomSheet.open(UiDialogSimpleComponent, {
      width: '650px',
      templateData: {
        title: type == 'infrastructure' ? 'هزینه‌های خدمات و زیرساخت' : 'کل مبلغ باز پرداخت',
        description: type == 'infrastructure' ? this.infrastructureDescription : this.totalPayableDescription,
      },
    });
  }

  changeTab(selectedOption: StyledSwitchOption) {
    this.selectedCollateral = selectedOption;
    let collateralType = '';
    if (selectedOption.label === 'سفته الکترونیک') {
      collateralType = 'E_NOTE';
    } else if (selectedOption.label === 'چک صیادی بنفش رنگ') {
      collateralType = 'NEW_CHEQUE';
    }
    this.selectCollateral.emit(collateralType);
  }

  convertToStyledSwitchOption(title: string, value: number) {
    return {
      label: title,
      value: value,
      backgroundColor: '#F0F5FF',
      borderColor: '#0040FF',
    };
  }

  initializeAnimatedSwitch() {
    for (let item = 0; item < this.data.collaterals.length; item++) {
      this.animatedOptions.push(this.convertToStyledSwitchOption(this.data.collaterals[item].name, item));
    }
    this.selectedCollateral = this.animatedOptions[0];
  }

  createLinkToFundProviderPage(fundProviderCode: number) {
    const fpName = this.findFundProviderName(fundProviderCode);
    this.emptyParams();
    const currentRoute = this.router.url.slice(0, this.router.url.lastIndexOf('/') + 1);
    if (this.areWeOnFundProviderPage(fpName)) {
      return currentRoute;
    }
    return currentRoute + fpName;
  }

  emptyParams() {
    this.router.navigate([], {
      queryParams: {
        selectedRegisterPath: null,
      },
      queryParamsHandling: 'merge',
    });
  }

  onClickFundProvider(funProviderPageLink: string) {
    if (funProviderPageLink) {
      if (isPlatformBrowser(this.platformId)) {
        window.location.href = this.fundProviderLink;
      }
    }
  }

  findFundProviderName(fundProviderCode: number) {
    return this.creditCalculatorService.getFundProviderNameByCode(fundProviderCode);
  }

  areWeOnFundProviderPage(fundProviderName: string) {
    return this.router.url.includes(fundProviderName);
  }

  showSubscriptionInfo(subscriptionTitle: string, subscriptionType: SubscriptionType) {
    this.dialog.open(UiDialogSubscriptionDetailsComponent, {
      width: '588px',
      templateData: {
        subscriptionType: subscriptionType,
        subscriptionTitle: subscriptionTitle,
        title: 'اشتراک ' + subscriptionTitle + ' دیجی‌پی',
      },
    });
  }

  protected readonly isPlatformBrowser = isPlatformBrowser;
  protected readonly PlanRuleEnum = PlanRuleEnum;
}
