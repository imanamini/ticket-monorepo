import { switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute, Params } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouteStateService } from '@client-monorepo/common/utilities';
import { IFundProfileModel } from '../funds/models/fund-profile.model';
import { numberToString } from '../../components/utils/number-to-string';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { PurchaseService } from '../purchase/services/purchase-service.service';
import { FundDataService } from '../../components/core/services/fund-data.service';
import { BaseComponent } from '../../components/core/components/base/base.component';
import { HOME_ROUTE, INVESTMENT_LIST_ROUTE, SELL_DETAIL_ROUTE } from '../../data-access/constants/app-routes';
import { ImageComponent } from '../../shared/components/image/image.component';
import { PipesModule, SeparateThousandsPipe } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { NgClass } from '@angular/common';
import { NgxTooltipDirective } from '@digipay/ngx-tooltip';

@Component({
  selector: 'wealth-applet-sell-stock',
  standalone: true,
  imports: [
    NgxAppBarComponent,
    ImageComponent,
    PipesModule,
    NgxButtonComponent,
    NgxIcon,
    ReactiveFormsModule,
    SpinnerComponent,
    NgClass,
    NgxTooltipDirective,
  ],
  templateUrl: './sell-stock.component.html',
  styleUrl: './sell-stock.component.scss',
})
export class SellStockComponent extends BaseComponent implements OnInit {
  symbol: string;
  availableUnits = 0;
  assetData: IFundProfileModel;
  isLoading = true;
  showError: string;
  form: FormGroup;
  state: { amount?: ''; agreementChecked?: boolean; unitCount?: number; unit: number } | undefined;

  tomanValue: string;
  agreementChecked: boolean | undefined;

  tableInfo: any[] = [];
  inputWidth = '0px';
  convertedRialValue = '0';
  thousand = new SeparateThousandsPipe();
  sellUnits = 0;

  private formBuilder = inject(FormBuilder);
  private routeState = inject(RouteStateService);
  private activatedRoute = inject(ActivatedRoute);
  private purchaseService = inject(PurchaseService);
  private fundDataService = inject(FundDataService);
  private navigationService = inject(WealthNavigationService);

  constructor() {
    super();
  }

  ngOnInit() {
    this.state = this.routeState.getAll();
    if (this.state?.amount) {
      this.tomanValue = numberToString((this.state?.amount * this.assetData?.saleNav) / 10) || '0';
      this.showError = 'hidden';
    }
    if (this.state?.agreementChecked) {
      this.agreementChecked = this.state?.agreementChecked;
    }

    this.form = this.formBuilder.group({
      count: [this.state?.unit || '', [Validators.required, Validators.min(1)]],
    });

    if (this.state.unit > 0) {
      this.updateFormControl(this.state.unit.toString());
    }

    this.form.controls['count'].valueChanges.pipe(tap((value) => this.updateFormControl(value))).subscribe();

    this.activatedRoute.params
      .pipe(
        switchMap((params: Params) => {
          this.symbol = params['id'];
          return this.purchaseService.getSellableUnits(this.symbol);
        }),
        switchMap((sellable) => {
          if (sellable.success && sellable.result) {
            this.availableUnits = sellable.result;
          }
          return this.fundDataService.getFundBySymbol(this.symbol);
        }),
      )
      .subscribe((fund) => {
        if (fund.success) {
          this.assetData = fund.result;
          console.log(this.assetData);
          this.tableInfo = [
            {
              id: 1,
              title: 'تعداد سهم قابل فروش شما',
              value: `${this.availableUnits} `,
            },
            {
              id: 2,
              title: 'قیمت فروش هر سهم',
              value: this.assetData.purchaseNav,
            },
          ];
        }
        if (!this.availableUnits) {
          this.showError = 'show';
        }

        this.isLoading = false;
      });
  }

  private handleValueChange(res: any): void {
    if (!res) {
      this.inputWidth = '0px';
    }
    this.convertedRialValue = this.thousand.transform(res * this.assetData.saleNav);
  }

  private updateFormControl(value: string): void {
    const replacedRes = value.replaceAll('٬', '');
    const convertedValue = this.convertNumbers(replacedRes);
    if (convertedValue !== null && convertedValue !== undefined) {
      this.handleValueChange(convertedValue);
      this.sellUnits = convertedValue;
      this.form.controls['count'].setValue(this.thousand.transform(convertedValue), { emitEvent: false });
    }
  }

  isValid(): boolean {
    return this.availableUnits && this.form.value.count >= 1 && this.form.value.count <= this.availableUnits;
  }

  onShowDetail(): void {
    this.showError = 'show';

    if (this.isValid()) {
      this.navigationService.navigate([SELL_DETAIL_ROUTE], {
        state: {
          amount: this.sellUnits * this.assetData.saleNav,
          cardTitle: 'فروش',
          providerName: this.assetData.title,
          symbol: this.assetData.symbol,
          type: this.assetData.type,
          unit: this.sellUnits,
        },
      });
    }
  }

  onBackClicked(): void {
    const queryParams = {
      referrer: this.state['referrer'],
    };
    this.navigationService.navigateWithQueryParams([INVESTMENT_LIST_ROUTE, this.assetData.symbol], { queryParams: queryParams });
  }

  private convertNumbers(value: string): number {
    const persianToEnglishMap: { [key: string]: string } = {
      '۰': '0',
      '۱': '1',
      '۲': '2',
      '۳': '3',
      '۴': '4',
      '۵': '5',
      '۶': '6',
      '۷': '7',
      '۸': '8',
      '۹': '9',
    };

    const inputString = typeof value === 'string' ? value : String(value);
    this.inputWidth = inputString.length * 16 + 'px';
    if (!inputString) {
      return null;
    }
    const convertedString = inputString
      .split('')
      .map((char) => {
        if (persianToEnglishMap[char]) {
          return persianToEnglishMap[char];
        } else if (!isNaN(Number(char))) {
          return char;
        }
        return null;
      })
      .join('');
    return parseInt(convertedString, 10);
  }

  onBackHandler() {
    this.navigationService.navigate([HOME_ROUTE]);
  }

  updateValue(action: 'pluse' | 'minus') {
    const replacedRes = this.form.controls['count'].value.replaceAll('٬', '');
    if (action == 'pluse') {
      this.sellUnits++;
      this.updateFormControl(this.sellUnits.toString());
    } else {
      if (replacedRes > 0) {
        this.sellUnits--;
        this.updateFormControl(this.sellUnits.toString());
      }
    }
  }
}
