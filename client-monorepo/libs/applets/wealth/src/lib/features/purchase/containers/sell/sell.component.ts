import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { PurchaseService } from '../../services/purchase-service.service';
import { PriceUnitComponent } from '../../components/price-unit/price-unit.component';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { EpdfType } from '../../../../components/core/models/instruments.enum';
import { INVESTMENT_LIST_ROUTE, PROSPECTUS_ROUTE, SELL_DETAIL_ROUTE } from '../../../../data-access/constants/app-routes';
import { IProspectusRouteState } from '../../../../components/core/models/prospectus-route-state.interface';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { RouteStateService } from '@client-monorepo/common/utilities';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { IPortfolio } from '../../../../components/core/models/customer-schemas/portfolio.interface';
import { FundsService } from '../../../../components/core/services/v1/funds.service';
import { CustomerService } from '../../../../components/core/services/v1/customer.service';
import { IPriceUnitProps } from '../../models';
import { numberToString } from '@digipay/strings';
import { IFundDetail } from '../../../../components/core/models/fund-schemas';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.scss'],
  standalone: true,
  imports: [
    PriceUnitComponent,
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    NgxAppBarComponent,
    NgxButtonComponent,
    NgxCheckboxComponent,
    SpinnerComponent,
    NgxCalloutComponent,
  ],
})
export class SellComponent implements OnInit {
  state: { amount?: ''; agreementChecked?: boolean; unitCount?: number } | undefined;
  form: FormGroup;
  isLoading = signal<boolean>(true);
  availableUnits = signal<number>(0);
  assetData = signal<IPortfolio | undefined>(undefined);
  symbol = signal<string>('');
  agreementChecked = signal<boolean>(false);
  priceProps = signal<IPriceUnitProps | undefined>(undefined);
  fundProfile = signal<IFundDetail | undefined>(undefined);
  tomanValue = signal<string>('');
  formInvalid = signal<boolean>(true);
  errorMessageMapper = computed(() => ({
    unavailibleUnits: 'شما موجودی قابل برداشت ندارید',
    maxUnits: `موجودی قابل برداشت شما ${this.availableUnits()} واحد است.`,
  }));
  disabled = computed(() => !this.availableUnits() || !this.agreementChecked() || this.formInvalid());

  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private routeState = inject(RouteStateService);
  private purchaseService = inject(PurchaseService);
  private fundsService = inject(FundsService);
  private customerService = inject(CustomerService);
  private navigationService = inject(WealthNavigationService);
  readonly pdfType = EpdfType;

  ngOnInit(): void {
    this.symbol.set(this.activatedRoute.snapshot.paramMap.get('id') || '');
    this.state = this.routeState.getAll();
    this.form = this.formBuilder.group({
      count: [this.state?.unitCount || this.state?.amount || '', [Validators.required, Validators.min(1), this.availableUnitsValidator]],
    });
    this.formInvalid.set(this.form.invalid);

    this.fetchData();
  }

  private fetchData() {
    this.customerService
      .getPortfoliosBysymbol(this.symbol())
      .pipe(
        switchMap((portfolio) => {
          if (portfolio.success) {
            this.availableUnits.set(portfolio.result.quantity);
            this.form.controls['count'].updateValueAndValidity();
            this.getSellableUnits();
            this.assetData.set(portfolio.result);
          }
          return this.fundsService.getFundProfileBySymbol(this.symbol());
        }),
      )
      .subscribe((fundProfile) => {
        if (fundProfile.success) {
          this.fundProfile.set(fundProfile.result);
          this.priceProps.set({
            title: this.assetData().title,
            customerPortfolioUnit: this.assetData().quantity,
            description: '',
            purchaseNav: 0,
            sectionType: 'SELL',
            type: this.assetData().type,
            sellNav: fundProfile.result.saleNav,
          });
          if (this.state?.amount) {
            this.tomanValue.set(numberToString((this.state?.amount * this.fundProfile()?.saleNav) / 10));
          }
          if (this.state?.agreementChecked) {
            this.agreementChecked.set(this.state?.agreementChecked);
          }
        }
        this.ininForm();
        this.isLoading.set(false);
      });
  }

  private ininForm() {
    this.form.statusChanges.subscribe(() => {
      this.formInvalid.set(this.form.invalid);
    });

    this.form.controls['count'].valueChanges.subscribe((value) => {
      this.tomanValue.set(numberToString((value * this.fundProfile()?.saleNav) / 10));
    });
  }

  isValid() {
    return this.availableUnits() && this.form.value.count >= 1 && this.form.value.count <= this.availableUnits();
  }

  private verifySell() {
    if (this.isValid()) {
      this.navigationService.navigate([SELL_DETAIL_ROUTE], {
        state: {
          amount: this.fundProfile()?.saleNav * this.form.value.count,
          cardTitle: 'فروش',
          providerName: this.assetData()?.title,
          symbol: this.assetData()?.symbol,
          type: this.assetData()?.type,
          unit: +this.form.value.count,
        },
      });
    }
  }

  onShowDetail(): void {
    this.verifySell();
  }

  onBackHandler(): void {
    const queryParams = {
      referrer: this.state['referrer'],
    };
    this.navigationService.navigate([INVESTMENT_LIST_ROUTE, this.assetData()?.symbol], { queryParams: queryParams });
  }

  getSellableUnits() {
    this.purchaseService.getSellableUnits(this.symbol()).subscribe((res) => {
      this.availableUnits.set(res.result);
      this.form.controls['count'].updateValueAndValidity();
    });
  }

  agreementView(pdfType: EpdfType) {
    const state: IProspectusRouteState = {
      symbol: this.symbol(),
      backToProfile: false,
      pdfType,
      type: 'sell',
      amount: this.form.value.count,
      agreementChecked: this.agreementChecked(),
    };

    this.navigationService.navigateWithState([PROSPECTUS_ROUTE], {
      state: state,
    });
  }

  private availableUnitsValidator = (control: AbstractControl) => {
    const units = Number(control.value);

    if (!this.availableUnits()) {
      return { unavailibleUnits: true };
    }

    if (units > this.availableUnits()) {
      return { maxUnits: { max: this.availableUnits() } };
    }

    return null;
  };
}
