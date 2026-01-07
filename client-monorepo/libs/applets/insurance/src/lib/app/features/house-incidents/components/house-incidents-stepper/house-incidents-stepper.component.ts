import { Component, inject, input, OnInit, signal } from '@angular/core';
import { HouseIncidentsStepperModel } from '../../data-access/models/house-incidents-stepper.model';
import { HouseIncidentsStepsEnum } from '../../data-access/enums/house-incidents-steps.enum';
import { HouseIncidentsActionService } from '../../data-access/services/house-incidents-action.service';
import { BaseComponent } from '../../../../components/base/base.component';
import { HouseIncidentsServiceActionType } from '../../data-access/enums/house-incidents-service-action-type.enum';

@Component({
  selector: 'house-incidents-stepper',
  standalone: true,
  templateUrl: './house-incidents-stepper.component.html',
  styleUrl: './house-incidents-stepper.component.scss'
})
export class HouseIncidentsStepperComponent extends BaseComponent implements OnInit {
  selectedStep = input<HouseIncidentsStepsEnum>(HouseIncidentsStepsEnum.SELECT_PLAN);
  selectedStepIndex = signal<number>(null);
  steps = signal<HouseIncidentsStepperModel[]>([]);

  serviceTypeStepsMapper: { [key: string]: HouseIncidentsStepperModel[] } = {
    [HouseIncidentsServiceActionType.A]: [
      {
        id: HouseIncidentsStepsEnum.SELECT_PLAN,
        title: 'انتخاب طرح'
      },
      {
        id: HouseIncidentsStepsEnum.CONFIRM_AND_PAY,
        title: 'تایید و پرداخت'
      },
      {
        id: HouseIncidentsStepsEnum.COMPLETE_INFO,
        title: 'تکمیل اطلاعات'
      },
    ],
    [HouseIncidentsServiceActionType.B]: [
      {
        id: HouseIncidentsStepsEnum.SELECT_PLAN,
        title: 'انتخاب طرح'
      },
      {
        id: HouseIncidentsStepsEnum.COMPLETE_INFO,
        title: 'تکمیل اطلاعات'
      },
      {
        id: HouseIncidentsStepsEnum.CONFIRM_AND_PAY,
        title: 'تایید و پرداخت'
      },
    ],
  };

  private houseIncidentsActionService = inject(HouseIncidentsActionService);

  ngOnInit(): void {
    this.buildSteps();
    this.setSelectedStepIndex();
  }

  setSelectedStepIndex(): void {
    this.selectedStepIndex.set(this.steps().findIndex(step => step.id === this.selectedStep()));
  }

  buildSteps(): void {
    super.addSubscription(
      this.houseIncidentsActionService.serviceType.subscribe({
        next: value => {
          this.steps.set(this.serviceTypeStepsMapper[value ?? HouseIncidentsServiceActionType.A]);
        }
      })
    );
  }
}
