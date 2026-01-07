import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { PreRegistrationService } from '../../services/pre-registration.service';
import { PlanGroup } from '../../../data-access/models/credit/pre-registration/credit-plan-group';
import { CreditCollateralInfoModel } from './credit-collateral-info.model';
import { ChequeConfirmBottomSheetComponent } from './confirm-messages/collateral-new-cheque-confirm/cheque-confirm-bottom-sheet.component';
import { CreditCollateralStepsPreviewBottomSheetComponent } from '../../components/credit-collateral-steps-preview-bottom-sheet/credit-collateral-steps-preview-bottom-sheet.component';
import { CreditCollateralOptionModel } from './credit-collateral-option.model';
import { PRE_REGISTRATION_STEP_TYPE } from '../../services/pre-registration-step';
import { PAYMENT_METHOD } from '../../../data-access/models/credit/pre-registration/payment-method.model';
import { FormsModule } from '@angular/forms';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { PreRegistrationStepCollateralInfoComponent } from './pre-registration-step-collateral-info/pre-registration-step-collateral-info.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { SelectionBoxComponent } from '../../../components/selection-box/selection-box.component';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { CreditScrollableViewComponent } from '../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-pre-registration-step-collateral',
  templateUrl: './pre-registration-step-collateral.component.html',
  styleUrls: ['./pre-registration-step-collateral.component.scss'],
  imports: [
    FormsModule,
    NgxButtonComponent,
    PreRegistrationStepCollateralInfoComponent,
    SelectionBoxComponent,
    NgxTrackableIdDirective,
    CreditScrollableViewComponent,
    CreditAppBarComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreRegistrationStepCollateralComponent implements OnInit {
  loading = signal(false);
  infoMapper = signal<{ [key: string]: CreditCollateralInfoModel }>({});
  collateralOptions = signal<CreditCollateralOptionModel[]>([]);
  selectedCollateralType = signal<string | null>(null);
  selectedCollateralTypeRadio = signal<string | null>(null);
  plans!: PlanGroup[];

  private bottomSheetService = inject(NgxBottomSheetService);
  private preRegistrationService = inject(PreRegistrationService);

  ngOnInit(): void {
    this.preRegistrationService.unsetFilters(['collateralType']);
    this.plans = this.preRegistrationService.filteredPlans;
    this.initiateData();
  }

  initiateData(): void {
    const collateralOptionsObject: {
      [key: string]: {
        value: any;
        title: string;
        disabled?: boolean;
        tooltip?: string;
        registerCost?: string;
        priority?: number;
        listOption?: any;
        collateralAmount: number[];
      };
    } = {};
    this.infoMapper.set({});
    this.plans
      .sort((a, b) => {
        // Check if both objects have a priority property
        const aHasPriority = a.hasOwnProperty('priority');
        const bHasPriority = b.hasOwnProperty('priority');

        // If both have priority, sort by priority
        if (aHasPriority && bHasPriority) {
          return a.priority! - b.priority!;
        }

        // If only one has priority, it comes first
        if (aHasPriority) {
          return -1;
        }
        if (bHasPriority) {
          return 1;
        }

        // If neither has priority, sort by collateralDto.name
        if (a.collateralDto.name < b.collateralDto.name) {
          return 1;
        }
        if (a.collateralDto.name > b.collateralDto.name) {
          return -1;
        }

        // If all else is equal
        return 0;
      })
      .forEach((item) => {
        this.preRegistrationService.resetSteps();
        setTimeout(() => {
          if (item.allocationPrepaymentPercentage === 0 && item.allocationPrepaymentAmount === 0) {
            this.preRegistrationService.removeConfirmStep();
          }
        }, 0);
        const type = item.collateralDto.type;
        collateralOptionsObject[type] = {
          value: type,
          title: item.collateralDto.name,
          disabled: (!collateralOptionsObject[type] || collateralOptionsObject[type].disabled) && !item.active,
          registerCost: item.filingPaymentAmount,
          priority: item.priority,
          collateralAmount: [item.collateralAmount],
        };
        this.selectedCollateralType.set(
          !this.selectedCollateralType() && !collateralOptionsObject[type].disabled ? type : this.selectedCollateralType(),
        );
        if (!this.infoMapper()[type]) {
          this.infoMapper()[type] = {
            collateralAmount: [item.collateralAmount],
            hasCollateralAmount: !!item.collateralAmount,
            registerType: [item.planRegistrationFlowDto.name],
            registerCost: [item.filingPaymentAmount!],
            hasRegisterCost: !!item.filingPaymentAmount,
            groupId: [item.groupId],
            collateralDetailTitle: 'جزئیات طرح با ' + item.collateralDto.name,
            calloutMessage: {
              title: item.collateralDto.description.header,
              description: item.collateralDto.description.bodyList,
            },
          };
        } else {
          if (!this.infoMapper()[type].collateralAmount.includes(item.collateralAmount)) {
            this.infoMapper()[type].collateralAmount.push(item.collateralAmount);
            this.infoMapper()[type].hasCollateralAmount = this.infoMapper()[type].hasCollateralAmount || !!item.collateralAmount;
          }
          if (!this.infoMapper()[type].registerType.includes(item.planRegistrationFlowDto.name)) {
            this.infoMapper()[type].registerType.push(item.planRegistrationFlowDto.name);
          }
          if (!this.infoMapper()[type].registerCost.includes(item.filingPaymentAmount!)) {
            this.infoMapper()[type].registerCost.push(item.filingPaymentAmount!);
            this.infoMapper()[type].hasRegisterCost = this.infoMapper()[type].hasRegisterCost || !!item.filingPaymentAmount;
          }
          if (!this.infoMapper()[type].groupId.includes(item.groupId)) {
            this.infoMapper()[type].groupId.push(item.groupId);
          }
        }
      });

    this.collateralOptions.set(
      Object.values(collateralOptionsObject).map((item) => {
        if (item.disabled) {
          if (item.value === 'E_NOTE') {
            item.tooltip = 'صادرکننده سفته الکترونیکی موقتا در دسترس نیست.';
          } else {
            item.tooltip = 'در حال حاضر این نوع ضمانت فعال نیست.';
          }
        }
        item.listOption = {
          label: item.title,
          value: '',
          selected: false,
        };

        return item;
      }),
    );
    this.collateralOptions.update((collateral) =>
      collateral.filter((c) => c.value !== 'UN_PAYABLE').sort((a, b) => a.priority! - b.priority!),
    );

    const InfoMapperLength = Object.keys(this.infoMapper()).length;
    if (InfoMapperLength === 1) {
      this.onChangeCollateral(Object.keys(this.infoMapper())[0]);
    }
  }

  back(): void {
    this.preRegistrationService.prevStep();
  }

  onSubmit(): void {
    if (!this.selectedCollateralType()) {
      return;
    }
    this.loading.set(true);

    this.confirmCollateral(this.selectedCollateralType()!).then((confirmed) => {
      if (confirmed) {
        // this.planIntrack.PageStep = 'Purple cheque';
        // this.eventService.sendEvent({
        //   eventName: 'PreRegisterStep',
        //   eventData: this.planIntrack,
        // });
        this.preRegistrationService.setFilters({
          collateralType: this.selectedCollateralType()!,
        });
        this.preRegistrationService.setCollateralType(this.selectedCollateralType()!);
        if (this.plans[0].paymentMethod === PAYMENT_METHOD.SUBSCRIPTION) {
          this.preRegistrationService.changeSkipInNextStepByType(PRE_REGISTRATION_STEP_TYPE.SUBSCRIPTION, false);
          this.preRegistrationService.changeSkipInPrevStepByType(PRE_REGISTRATION_STEP_TYPE.SUBSCRIPTION, false);
          this.preRegistrationService.changeSkipInNextStepByType(PRE_REGISTRATION_STEP_TYPE.PRE_SUBSCRIPTION, false);
          this.preRegistrationService.changeSkipInPrevStepByType(PRE_REGISTRATION_STEP_TYPE.PRE_SUBSCRIPTION, false);
          this.preRegistrationService.changeSkipInPrevStepByType(PRE_REGISTRATION_STEP_TYPE.CONFIRM_PLAN, true);
          this.preRegistrationService.changeSkipInNextStepByType(PRE_REGISTRATION_STEP_TYPE.CONFIRM_PLAN, true);
        }
        this.preRegistrationService.nextStep();
      }
    });
  }

  confirmCollateral(type: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      if (type === 'NEW_CHEQUE') {
        this.bottomSheetService.openBottomSheet(
          ChequeConfirmBottomSheetComponent,
          {},
          {
            noPadding: true,
            disableClose: true,
          },
        );
        const onCloseBottomSheet = this.bottomSheetService.onClose.subscribe(() => {
          onCloseBottomSheet.unsubscribe();
          const result: any = this.bottomSheetService.outputData();
          if (result && result.confirmed) {
            return resolve(true);
          }
          return resolve(false);
        });
        return;
      }
      return resolve(true);
    });
  }

  onChangeCollateral(collateralType: any) {
    this.selectedCollateralType.set(collateralType);
    this.selectedCollateralTypeRadio.set(collateralType);

    this.collateralOptions.update((items) =>
      items.map((item) => {
        item.listOption = { ...item.listOption, selected: item.value === collateralType };
        return item;
      }),
    );
  }

  previewSteps(collateral: { value: string; title: string }) {
    this.bottomSheetService.openBottomSheet(CreditCollateralStepsPreviewBottomSheetComponent, collateral, {
      noPadding: true,
    });
  }
}
