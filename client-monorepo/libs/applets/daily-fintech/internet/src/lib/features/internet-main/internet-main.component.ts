import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import {
  cellNumberFormatter,
  getCellNumberPrefix,
  isPrePaidCellNumber,
  MessageService,
  MobileOperator,
  OperatorSimTypeConfig,
  ServiceType,
} from '@client-monorepo/common/utilities';
import { NgxFormValidator } from '@digipay/ngx-form-validator';

import { ShowError, UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { InternetApiService } from '../../data-access/services/internet-api-service';
import { map } from 'rxjs';
import { convertNonEnglishDigits } from '@digipay/strings';
import { ProfileInterface, UserDataService } from '@client-monorepo/common/user';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { SimTypePickerComponent } from '@client-monorepo/common/cellular-operator';
import { state } from '@angular/animations';
import { InternetPurchaseResponse } from '../../data-access/models/internet-purchase.response';
import { InternetService } from '@client-monorepo/applets/internet';
import { ButtonToggleInterface, DailyFintechButtonToggleComponent } from '@client-monorepo/daily-fintech/button-toggle';
import {
  CellNumberType,
  DailyFintechRecommendationListComponent,
  RECOMMENDATION_TYPES,
  RecommendationData,
} from '@client-monorepo/daily-fintech/recommendation';
import { NgxHybridService } from '@digipay/ngx-hybrid-service';
import { AssetTypes } from '@client-monorepo/common/user-assets';
import { DailyFintechTouchPointComponent } from '@client-monorepo/shared/daily-fintech/touch-point';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OperatorEnum } from '@client-monorepo/payment/transactions';
import { InternetMainSkeletonComponent } from '../../components/internet-main-skeleton/internet-main-skeleton.component';

@Component({
  selector: 'internet-applet-internet-main',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    DailyFintechButtonToggleComponent,
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    DpIconComponent,
    DailyFintechTouchPointComponent,
    NgxButtonComponent,
    DailyFintechRecommendationListComponent,
    InternetMainSkeletonComponent,
  ],
  templateUrl: './internet-main.component.html',
  styleUrl: './internet-main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternetMainComponent implements OnInit {
  // Injects
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(UntypedFormBuilder);
  private ms = inject(MessageService);
  private internetApiService = inject(InternetApiService);
  private bottomSheetService = inject(NgxBottomSheetService);
  private hybridService = inject(NgxHybridService);
  private userDataService = inject(UserDataService);
  private internetService = inject(InternetService);
  private destroyRef = inject(DestroyRef);

  // Signals
  internetForm = signal<FormGroup>(this.createForm());
  simType = signal<CellNumberType | null>(null);
  selectedOperator = signal<MobileOperator>({} as MobileOperator);
  operatorTypes = computed(() => {
    const operator = this.selectedOperator();
    return OperatorSimTypeConfig[operator.operatorId as OperatorEnum]?.[ServiceType.internet];
  });
  operatorSwitchOptions = signal<ButtonToggleInterface[]>([]);
  operators = signal<MobileOperator[]>([]);
  isSupportContact = signal(false);
  contactName = signal('');
  recentlyUsedNumberSpinner = signal('');
  userCellNumber = signal('');
  prevCellNumber = signal('');
  isLoaded = signal(false);
  isSubmitting = signal(false);
  errorMessageMapper = signal({
    cellNumber: 'شماره وارد شده پشتیبانی نمی‌شود.',
    mustPrePaid: 'شماره وارد شده پشتیبانی نمی‌شود.',
  });
  errorStatus = signal<ShowError>('auto');

  ngOnInit(): void {
    this.checkHybridMode();
    this.internetApiService
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
          this.operatorSwitchOptions.set([...this.operatorSwitchOptions()]);

          this.internetForm().controls['cellNumber'].updateValueAndValidity();

          this.checkRouteState();
          this.isLoaded.set(true);
        },
        error: (e) => {
          this.isLoaded.set(false);
          if (e.result?.message) {
            this.ms.showErrorOfErrorResponse(e);
          }
        },
      });

    this.internetForm()
      .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((changes) => {
        if (changes.cellNumber && changes.cellNumber !== this.prevCellNumber()) {
          const cellNumber = convertNonEnglishDigits(changes?.cellNumber);
          this.prevCellNumber.set(cellNumber);
          this.internetForm().controls['cellNumber'].setValue(cellNumber, {
            emitEvent: false,
          });

          this.cellNumberChanged(cellNumber);
        }
      });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      cellNumber: ['', [Validators.required, NgxFormValidator.cellNumberValidator()]],
    });
  }

  private checkHybridMode(): void {
    if (this.hybridService.isHybrid()) {
      this.isSupportContact.set(true);
    }
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
   * Check validness of the entered cell number
   */
  checkValidness(): void {
    let value = this.internetForm().controls['cellNumber'].value;
    if (value.length > 3) {
      value = getCellNumberPrefix(value);
      const operator = this.operators().filter((o) => o.prefixes.some((p) => p.value === value))[0];
      if (operator) {
        this.selectedOperator.set(operator);
      }
      if (!operator) {
        this.internetForm().controls['cellNumber'].setErrors({
          mustPrePaid: true,
        });
      } else {
        this.internetForm().markAsPristine();
        this.internetForm().markAsUntouched();
        this.internetForm().updateValueAndValidity();
      }
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

  private setUserCellNumber(user: ProfileInterface) {
    this.userCellNumber.set(user.cellNumber);

    if (isPrePaidCellNumber(this.userCellNumber(), this.operators())) {
      this.internetForm().controls['cellNumber'].setValue(this.userCellNumber());
    }
  }

  onSetNumberClicked() {
    this.internetForm().controls['cellNumber'].setValue(this.userCellNumber());
    this.errorStatus.set('show');
  }

  /**
   * If the route state includes data, it means
   * user is coming back from next steps.
   * Check route state data and fill the form by
   * the previously entered values.
   */
  checkRouteState() {
    this.route.paramMap.pipe(map(() => window.history.state)).subscribe((routeState) => {
      if (routeState?.cellNumber) {
        this.internetForm().controls['cellNumber'].setValue(routeState.cellNumber, {
          emitEvent: false,
        });
        this.selectedOperator.set(this.operators().filter((op) => op.operatorId === routeState.operatorId)[0]);
      }
    });
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
   * Makes SwitchOption object based
   * on the current value of
   * the selectedOperator
   */
  getSelectedOperatorOption() {
    const operator = this.selectedOperator();
    if (operator) {
      return {
        value: operator.name,
        title: operator.description,
        imageId: operator.imageId,
      };
    }
    return null;
  }

  /**
   * Returns true when the operator switch should be enabled
   */
  shouldSwitchBeEnabled() {
    if (this.internetForm().controls['cellNumber']?.value?.length < 4) {
      return false;
    }

    if (this.internetForm().controls['cellNumber'].hasError('mustPrePaid')) {
      return false;
    }

    return !this.internetForm().controls['cellNumber'].hasError('required');
  }

  onSetContactClicked() {
    this.hybridService.getContactInfo().then((result) => {
      this.internetForm().controls['cellNumber'].setValue(cellNumberFormatter(result.phoneNumber));
      this.contactName.set(result.contactName + ' از لیست مخاطبان');
    });
    this.errorStatus.set('show');
  }

  getBundles(operatorId: string, cellNumber: string, cellNumberType: string): Promise<InternetPurchaseResponse> {
    return new Promise((resolve, reject) => {
      this.internetApiService
        .getBundles(operatorId, {
          cellNumber,
          cellNumberType,
        })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (result) => {
            this.isSubmitting.set(false);
            resolve(result);
          },
          error: (e) => {
            reject(new Error('getBundles failed'));
            this.isSubmitting.set(false);
            if (e && e.result && e.result.message) {
              this.ms.showErrorOfErrorResponse(e);
            }
          },
        });
    });
  }

  onSubmit(): void {
    const cellNumber = convertNonEnglishDigits(this.internetForm().controls['cellNumber']?.value);
    const operator = this.selectedOperator();
    if (this.isSubmitting()) {
      return;
    }
    this.isSubmitting.set(true);

    this.setSimType({}).then(() => {
      this.getBundles(operator.operatorId, cellNumber, this.simType()?.toString() ?? '').then(
        async (response: InternetPurchaseResponse) => {
          if (response) {
            await this.goToNextStep({
              cellNumber: cellNumber,
              operator: operator,
              simType: this.simType()?.toString() || '',
              response: response,
            });
          }
        },
      );
    });
  }

  /**
   * Set SimType
   */
  async setSimType({ type }: { type?: CellNumberType }) {
    if (type) {
      this.simType.set(type);
      return;
    }
    await this.askUserSimType().then((simType) => {
      this.simType.set(simType);
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
      this.isSubmitting.set(false);
      const sheetSub = this.bottomSheetService.onClose.subscribe(() => {
        sheetSub.unsubscribe();
        const result = this.bottomSheetService.outputData();
        if (result?.simType) {
          resolve(result?.simType);
        } else {
          this.recentlyUsedNumberSpinner.set('');
        }
      });
    });
  }

  /**
   * Click handler of the recently used numbers
   */
  recentlyUsedNumberClick(recentNumberData: RecommendationData) {
    if (this.isSubmitting()) return;

    this.internetForm().controls['cellNumber'].setValue(recentNumberData.id, {
      emitEvent: false,
    });

    this.cellNumberChanged(recentNumberData.id);

    const operator = this.operators().filter((o) => parseInt(o.operatorId) === recentNumberData.operator)[0];
    if (operator) {
      this.recentlyUsedNumberSpinner.set(recentNumberData.id);
      this.isSubmitting.set(true);
      const cellNumberTypeString = recentNumberData.cellNumberType ? recentNumberData.cellNumberType.toString() : '';

      this.getBundles(operator.operatorId, recentNumberData.id, cellNumberTypeString).then(async (response: InternetPurchaseResponse) => {
        if (response) {
          this.goToNextStep({
            cellNumber: recentNumberData.id,
            operator: operator,
            simType: cellNumberTypeString,
            response: response,
          });
          this.navigateToPurchase(response);
        }
      });
    }
  }

  private navigateToPurchase(response: InternetPurchaseResponse) {
    this.router
      .navigate(['internet', 'purchase'], {
        state: {
          ...state,
          response: response,
        },
      })
      .then();
  }

  private goToNextStep({
    cellNumber,
    operator,
    simType,
    response,
  }: {
    cellNumber: string;
    operator: MobileOperator;
    simType: string;
    response: InternetPurchaseResponse;
  }) {
    this.internetService.setConfirmData({
      simType,
      cellNumber,
      operatorId: operator.operatorId,
      operatorName: operator.name,
      operator: operator,
    });
    this.navigateToPurchase(response);
  }

  protected readonly AssetTypes = AssetTypes;
  protected readonly RECOMMENDATION_TYPES = RECOMMENDATION_TYPES;
}
