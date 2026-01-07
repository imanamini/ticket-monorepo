import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { PreRegistrationService } from '../../services/pre-registration.service';
import { PlanGroup } from '../../../data-access/models/credit/pre-registration/credit-plan-group';
import { CreditSelectRegistrationFlowComponent } from '../../components/credit-select-registration-flow/credit-select-registration-flow.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditRegistrationFlowTypeDataModel } from '../../services/credit-registration-flow-type-data.model';

@Component({
  selector: 'app-credit-select-registration-flow-bottom-sheet',
  templateUrl: './credit-select-registration-flow-bottom-sheet.component.html',
  styleUrls: ['./credit-select-registration-flow-bottom-sheet.component.scss'],
  imports: [CreditSelectRegistrationFlowComponent, NgxButtonComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSelectRegistrationFlowBottomSheetComponent implements OnInit {
  journeyTypes = signal<CreditRegistrationFlowTypeDataModel[]>([]);
  selectedFlowType = signal<string | null>(null);
  plans!: PlanGroup[];
  bottomSheetService = inject(NgxBottomSheetService);
  preRegistrationService = inject(PreRegistrationService);

  ngOnInit(): void {
    this.preRegistrationService.unsetFilters(['registrationFlowType']);
    this.plans = this.preRegistrationService.filteredPlans;
    this.initiateData();
  }

  initiateData(): void {
    const flowObject: { [key: string]: CreditRegistrationFlowTypeDataModel } = {};
    this.plans.forEach((item) => {
      flowObject[item.planRegistrationFlowDto.type] = {
        type: item.planRegistrationFlowDto.type,
        title: item.planRegistrationFlowDto.name,
        description: item.planRegistrationFlowDto.description.body!,
        cost: item.filingPaymentAmount!,
        active: (flowObject[item.planRegistrationFlowDto.type] && flowObject[item.planRegistrationFlowDto.type].active) || item.active,
        subtitle: '',
      };
    });
    this.journeyTypes.set(Object.values(flowObject));
    const firstFlowType = this.journeyTypes().find((item) => item.active);
    this.selectedFlowType.set(firstFlowType! && firstFlowType.type);
    if (this.journeyTypes().length === 1) {
      this.onSubmit();
    }
  }

  onSubmit(): void {
    this.preRegistrationService.setFilters({
      registrationFlowType: this.selectedFlowType()!,
    });
    this.bottomSheetService.outputData.set({ nextStep: true });
    this.bottomSheetService.closeBottomSheet();
  }
}
