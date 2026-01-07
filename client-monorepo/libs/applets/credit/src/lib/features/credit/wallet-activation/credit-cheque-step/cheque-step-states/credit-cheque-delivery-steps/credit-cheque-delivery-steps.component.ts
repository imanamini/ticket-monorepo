import { ChangeDetectionStrategy, Component, inject, input, model, OnInit, output, signal } from '@angular/core';
import { ChequeStatus } from '../../../../data-access/models/credit/activation/cheque-step/cheque-status-response';
import { CreditPageLoadingComponent } from '../../../../components/credit-page-loading/credit-page-loading.component';
import { CreditChequeDeliveryLocationComponent } from './credit-cheque-delivery-location/credit-cheque-delivery-location.component';
import { CreditChequeDeliveryPostInfoComponent } from './credit-cheque-delivery-post-info/credit-cheque-delivery-post-info.component';
import { CreditChequeDeliveryReservedInfoComponent } from './credit-cheque-delivery-reserved-info/credit-cheque-delivery-reserved-info.component';
import { CreditChequeDeliveryInPersonAddressesComponent } from './credit-cheque-delivery-in-person-addresses/credit-cheque-delivery-in-person-addresses.component';
import { CreditChequeDeliverySelectedAddressDetailComponent } from './credit-cheque-delivery-selected-address-detail/credit-cheque-delivery-selected-address-detail.component';
import {
  ChequeDeliveryData,
  ChequeDeliverySteps,
} from '../../../../data-access/models/credit/activation/cheque-step/cheque-step-delivery.model';
import { CreditChequeStepService } from '../../services/credit-cheque-step.service';
import { CreditChequeDeliveryFullCapacityErrorComponent } from './credit-cheque-delivery-full-capacity-error/credit-cheque-delivery-full-capacity-error.component';

@Component({
  selector: 'app-credit-cheque-delivery-steps',
  templateUrl: './credit-cheque-delivery-steps.component.html',
  styleUrls: ['./credit-cheque-delivery-steps.component.scss'],
  standalone: true,
  imports: [
    CreditPageLoadingComponent,
    CreditChequeDeliveryLocationComponent,
    CreditChequeDeliveryPostInfoComponent,
    CreditChequeDeliveryReservedInfoComponent,
    CreditChequeDeliveryInPersonAddressesComponent,
    CreditChequeDeliverySelectedAddressDetailComponent,
    CreditChequeDeliveryFullCapacityErrorComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditChequeDeliveryStepsComponent implements OnInit {
  chequeDeliverySteps = ChequeDeliverySteps;

  chequeStatus = model<ChequeStatus>();
  creditId = input<string>();
  chequeDeliveryData = input<ChequeDeliveryData>();

  showLoading = signal(true);
  stepIndex = signal<number>(0);
  activeStep = signal<ChequeDeliverySteps>(ChequeDeliverySteps.CHEQUE_DELIVERY_LOCATION);

  close = output<void>();
  back = output<void>();

  private creditChequeStepService = inject(CreditChequeStepService);

  ngOnInit() {
    this.creditChequeStepService.resetDeliveryInfo();
    if (
      [ChequeStatus.PHYSICS_DELIVERY_RESERVED, ChequeStatus.PHYSICS_DELIVERY_HANDLED, ChequeStatus.PHYSICS_RECEIVED].includes(
        this.chequeStatus()!,
      )
    ) {
      this.gotoStep(ChequeDeliverySteps.CHEQUE_DELIVERY_RESERVED_INFO);
    }
    this.showLoading.set(false);
  }

  SetSelectedDeliveryDateTime() {
    this.gotoStep(ChequeDeliverySteps.CHEQUE_DELIVERY_LOCATION_TIME_DETAILS);
  }

  goToLocation() {
    this.gotoStep(ChequeDeliverySteps.CHEQUE_DELIVERY_LOCATION);
  }

  goToReservedState() {
    this.chequeStatus.set(ChequeStatus.PHYSICS_DELIVERY_RESERVED);
    this.gotoStep(ChequeDeliverySteps.CHEQUE_DELIVERY_RESERVED_INFO);
  }

  goToFirstStep() {
    this.resetData();
    this.gotoStep(ChequeDeliverySteps.CHEQUE_DELIVERY_LOCATION);
  }

  setChequeStatusHandled() {
    this.chequeStatus.set(ChequeStatus.PHYSICS_DELIVERY_HANDLED);
    this.gotoStep(ChequeDeliverySteps.CHEQUE_DELIVERY_RESERVED_INFO);
  }

  resetData() {
    this.creditChequeStepService.resetDeliveryInfo();
  }

  gotoStep(step: ChequeDeliverySteps) {
    this.activeStep.set(step);
  }

  goToCapacityError() {
    this.activeStep.set(ChequeDeliverySteps.CHEQUE_DELIVERY_FULL_CAPACITY_ERROR);
  }
}
