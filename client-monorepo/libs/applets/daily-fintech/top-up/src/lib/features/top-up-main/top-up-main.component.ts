import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShowError, UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { convertNonEnglishDigits } from '@digipay/strings';
import { NgxFormValidator } from '@digipay/ngx-form-validator';
import { TopUpApiService } from '../../data-access/services/top-up-api.service';
import {
  cellNumberFormatter,
  getCellNumberPrefix,
  isPrePaidCellNumber,
  MessageService,
  MobileOperator,
  OperatorSimTypeConfig,
  ServiceType
} from '@client-monorepo/common/utilities';
import { Type } from '../../data-access/models/type';
import { ProfileInterface, UserDataService } from '@client-monorepo/common/user';
import { TopUpPackageResponse } from '@client-monorepo/applets/top-up';
import { SimTypePickerComponent } from '@client-monorepo/common/cellular-operator';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { ButtonToggleInterface } from '../../data-access/models/button-toggle.interface';
import { TopUpTypePickerComponent } from '../../components/top-up-type-picker/top-up-type-picker.component';
import {
  CellNumberType,
  DailyFintechRecommendationListComponent,
  RECOMMENDATION_TYPES,
  RecommendationData
} from '@client-monorepo/daily-fintech/recommendation';
import { DailyFintechButtonToggleComponent } from '@client-monorepo/daily-fintech/button-toggle';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
import { NgxHybridService } from '@digipay/ngx-hybrid-service';
import { AssetTypes } from '@client-monorepo/common/user-assets';
import { DailyFintechTouchPointComponent } from '@client-monorepo/shared/daily-fintech/touch-point';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TopUpMainSkeletonComponent } from '../../components/top-up-main-skeleton/top-up-main-skeleton.component';
import { OperatorEnum } from '@client-monorepo/payment/transactions';

@Component({
  selector: 'top-up-applet-top-up-main',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    FormsModule,
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    DailyFintechRecommendationListComponent,
    ApiImageModule,
    DpIconComponent,
    DailyFintechButtonToggleComponent,
    DailyFintechRecommendationListComponent,
    DailyFintechTouchPointComponent,
    NgxButtonComponent,
    TopUpMainSkeletonComponent,
  ],
  templateUrl: './top-up-main.component.html',
  styleUrl: './top-up-main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopUpMainComponent implements OnInit {
  // Injects
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private ms = inject(MessageService);
  private bottomSheetService = inject(NgxBottomSheetService);
  private topUpApiService = inject(TopUpApiService);
  private hybridService = inject(NgxHybridService);
  private userDataService = inject(UserDataService);
  private bottomNavigationService = inject(NgxBottomNavigationService);
  private destroyRef = inject(DestroyRef);

  // Signals
  operators = signal<MobileOperator[]>([]);
  selectedOperator = signal<MobileOperator>({} as MobileOperator);
  operatorSwitchOptions = signal<ButtonToggleInterface[]>([]);
  topUpForm = signal<FormGroup>(this.createForm());
  userCellNumber = signal('');

  isSubmitting = signal(false);

  isLoaded = signal(false);

  prevCellNumber = signal('');

  recentlyUsedNumberSpinner = signal('');

  recommendationType = signal<RECOMMENDATION_TYPES>(RECOMMENDATION_TYPES.TOP_UP);

  simType = signal<CellNumberType>({} as CellNumberType);
  operatorTypes = computed(() => {
    const operator = this.selectedOperator();
    return OperatorSimTypeConfig[operator.operatorId as OperatorEnum]?.[ServiceType.charge];
  });
  isSupportContact = signal(false);
  contactName = signal('');

  errorMessageMapper = signal({
    cellNumber: 'شماره وارد شده پشتیبانی نمی‌شود.',
    mustPrePaid: 'شماره وارد شده پشتیبانی نمی‌شود.',
  });
  errorStatus = signal<ShowError>('auto');

  ngOnInit() {
    this.bottomNavigationService.hide();
    this.checkHybridMode();
    this.getOperators();
    this.checkFormValueChange();
  }
  private createForm(): FormGroup {
    return this.formBuilder.group({
      cellNumber: ['', [Validators.required, NgxFormValidator.cellNumberValidator()]],
    });
  }
  private checkFormValueChange(): void {
    this.topUpForm()
      .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((changes) => {
        if (this.contactName().length > 1) {
          this.contactName.set('');
        }
        if (changes.cellNumber && changes.cellNumber !== this.prevCellNumber()) {
          const cellNumber = convertNonEnglishDigits(changes?.cellNumber);
          this.prevCellNumber.set(cellNumber);
          this.topUpForm().controls['cellNumber'].setValue(cellNumber, {
            emitEvent: false,
          });

          this.cellNumberChanged(cellNumber);
        }
      });
  }

  private getOperators(): void {
    this.topUpApiService
      .getOperators()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.operators.set(result.topUpOperators);
          this.userDataService.getUserDetail().then((userDetail) => {
            this.setUserCellNumber(userDetail);
          });

          this.operators().forEach((op) => {
            this.operatorSwitchOptions().push({
              title: op.description,
              value: op.name,
              isActive: true,
              imageId: op.imageId,
            });
          });

          this.topUpForm().controls['cellNumber'].updateValueAndValidity();

          this.checkRouteState();
          this.isLoaded.set(true);
        },
        error: (err) => {
          this.isLoaded.set(false);
          this.ms.showErrorOfErrorResponse(err);
        },
      });
  }

  private checkHybridMode(): void {
    if (this.hybridService.isHybrid()) {
      this.isSupportContact.set(true);
    }
  }

  private setUserCellNumber(user: ProfileInterface) {
    this.userCellNumber.set(user.cellNumber);

    if (isPrePaidCellNumber(this.userCellNumber(), this.operators())) {
      this.topUpForm().controls['cellNumber'].setValue(this.userCellNumber());
    }
  }

  /**
   * If the route state includes data, it means
   * user is coming back from next steps.
   * Check route state data and fill the form by
   * the previously entered values.
   */
  checkRouteState() {
    this.route.paramMap
      .pipe(map(() => window.history.state))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((routeState) => {
        if (routeState?.cellNumber) {
          this.topUpForm().controls['cellNumber'].setValue(routeState.cellNumber, {
            emitEvent: false,
          });
          this.selectedOperator.set(this.operators().filter((op) => op.operatorId === routeState.operatorId)[0]);
        }
      });
  }

  /**
   * Number changed callback
   * @param cellNumber
   */
  cellNumberChanged(cellNumber: string) {
    this.findSelectedOperator(cellNumber);
    this.checkValidness();
  }

  /**
   * Switch change callback
   * @param option
   */
  operatorSwitchChange(option: ButtonToggleInterface) {
    if (option) {
      this.selectedOperator.set(this.operators().filter((operator) => option.value === operator.name)[0]);
    }
  }

  /**
   * Find selected operator
   * @param cellNumber
   */
  private findSelectedOperator(cellNumber: string) {
    if (cellNumber.length < 4) {
      return;
    }

    const numberPrefix = getCellNumberPrefix(cellNumber);
    const operator = this.operators().filter((o) => o.prefixes.some((p) => p.value == numberPrefix))[0];

    if (operator) {
      this.selectedOperator.set(operator);
    }
  }

  /**
   * Makes SwitchOption object based
   * on the current value of
   * the selectedOperator
   */
  getSelectedOperatorOption() {
    if (this.selectedOperator()) {
      return {
        value: this.selectedOperator().name,
        title: this.selectedOperator().description,
        imageId: this.selectedOperator().imageId,
      };
    }
    return null;
  }

  /**
   * Check validness of the entered cell number
   */
  checkValidness(): void {
    let value = this.topUpForm().controls['cellNumber'].value;
    if (value.length > 3) {
      value = getCellNumberPrefix(value);
      const operator = this.operators().filter((o) => o.prefixes.some((p) => p.value === value))[0];
      if (operator) {
        this.selectedOperator.set(operator);
      }

      const items = this.operators().filter((o) =>
        o.prefixes.some((p) => p.value === value && p.types.length > 0 && p.types.indexOf(2) >= 0),
      );

      if (items.length === 0) {
        this.topUpForm().controls['cellNumber'].setErrors({
          mustPrePaid: true,
        });
      } else {
        this.topUpForm().markAsPristine();
        this.topUpForm().markAsUntouched();
        this.topUpForm().updateValueAndValidity();
      }
    }
  }

  /**
   * Get Top-Up packages from the API
   * @param operatorId
   */
  getTopUpPackages(operatorId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.topUpApiService
        .getTopUpPackage(operatorId, Type.TOP_UP)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (result) => {
            this.isSubmitting.set(false);
            resolve(result);
          },
          error: (e) => {
            reject(new Error('getTopUpPackages failed'));
            this.isSubmitting.set(false);
            this.ms.showErrorOfErrorResponse(e);
          },
        });
    });
  }

  /**
   * Make state parameters
   */
  getPurchasePageState(
    topUpInfoResponse: TopUpPackageResponse,
    operator: MobileOperator,
    cellNumber: string | null = null,
    simType: CellNumberType,
  ) {
    return {
      packages: topUpInfoResponse.topUpInfos,
      cellNumber: cellNumber ? cellNumber : convertNonEnglishDigits(this.topUpForm().controls['cellNumber'].value),
      operatorName: operator.description,
      operatorCode: operator.name,
      operatorId: operator.operatorId,
      defaultAmount: topUpInfoResponse.defaultChargePackage ? topUpInfoResponse.defaultChargePackage : null,
      amountFactor: topUpInfoResponse.amountFactor ? topUpInfoResponse.amountFactor : 0,
      maxAmount: topUpInfoResponse.maxAmount ? topUpInfoResponse.maxAmount : 0,
      minAmount: topUpInfoResponse.minAmount ? topUpInfoResponse.minAmount : 0,
      simType,
    };
  }

  /**
   *
   */
  onSubmit(): void {
    const operator = this.selectedOperator();
    if (this.isSubmitting()) return;
    this.isSubmitting.set(true);
    this.getTopUpPackages(operator.operatorId).then(async (response) => {
      if (response) {
        const simTypeConfig = operator.operatorId === '4' ? CellNumberType.PRE_PAID : undefined;
        await this.setSimType(simTypeConfig);
        await this.askAmountFromUser(operator, response);
      }
    });
  }

  /**
   * Ask user to pick the sim type
   */
  private askUserSimType(): Promise<CellNumberType> {
    return new Promise((resolve) => {
      this.bottomSheetService.openBottomSheet(SimTypePickerComponent, {
        currentOperatorTypes: this.operatorTypes(),
      });
      const sheetSub = this.bottomSheetService.onClose.subscribe(() => {
        sheetSub.unsubscribe();
        const result = this.bottomSheetService.outputData();
        if (result?.simType) {
          resolve(this.bottomSheetService.outputData()?.simType);
        } else {
          this.recentlyUsedNumberSpinner.set('');
        }
      });
    });
  }

  /**
   * Displays a bottom sheet for picking the sim-cards type
   * and the amount
   */
  private askAmountFromUser(operator: MobileOperator, response: TopUpPackageResponse, cellNumber: string | null = null) {
    const state = this.getPurchasePageState(response, operator, cellNumber, this.simType());
    this.recentlyUsedNumberSpinner.set('');

    this.bottomSheetService.openBottomSheet(
      TopUpTypePickerComponent,
      {
        state,
      },
      { noPadding: true },
    );
    const sheetSub = this.bottomSheetService.onClose.subscribe(() => {
      sheetSub.unsubscribe();
      const result = this.bottomSheetService.outputData()?.result;
      if (!result) {
        return;
      }
      this.router
        .navigate(['top-up', 'confirm'], {
          state: {
            ...state,
            typePickerResult: result,
            operator,
          },
        })
        .then();
    });
  }

  /**
   * Click handler of the recently used numbers
   */
  recentlyUsedNumberClick(recentNumberData: RecommendationData) {
    if (this.isSubmitting()) {
      return;
    }
    this.topUpForm().controls['cellNumber'].setValue(recentNumberData.id, {
      emitEvent: false,
    });

    this.cellNumberChanged(recentNumberData.id);

    const operator = this.operators().filter((o) => parseInt(o.operatorId) === recentNumberData.operator)[0];
    if (operator) {
      this.recentlyUsedNumberSpinner.set(recentNumberData.id);
      this.isSubmitting.set(true);
      this.getTopUpPackages(operator.operatorId).then(async (response) => {
        await this.setSimType(recentNumberData.cellNumberType);
        await this.askAmountFromUser(operator, response, recentNumberData.id);
      });
    }
  }

  /**
   * Set SimType
   */
  async setSimType(type?: CellNumberType) {
    if (type) {
      this.simType.set(type);
      return;
    }
    await this.askUserSimType().then((simType) => {
      this.simType.set(simType);
    });
  }

  onSetNumberClicked() {
    this.topUpForm().controls['cellNumber'].setValue(this.userCellNumber());
    this.errorStatus.set('show');
  }

  onSetContactClicked() {
    this.hybridService.getContactInfo().then((result) => {
      this.topUpForm().controls['cellNumber'].setValue(cellNumberFormatter(result.phoneNumber));
      this.contactName.set(result.contactName + ' از لیست مخاطبان');
    });
    this.errorStatus.set('show');
  }

  /**
   * Returns true when the operator switch should be enabled
   */
  shouldSwitchBeEnabled() {
    if (this.topUpForm().controls['cellNumber']?.value?.length < 4) {
      return false;
    }

    if (this.topUpForm().controls['cellNumber'].hasError('mustPrePaid')) {
      return false;
    }

    return !this.topUpForm().controls['cellNumber'].hasError('required');
  }

  protected readonly AssetTypes = AssetTypes;
}
