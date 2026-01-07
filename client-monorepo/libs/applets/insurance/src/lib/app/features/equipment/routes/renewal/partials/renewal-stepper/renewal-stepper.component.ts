import { Component, Input, OnInit } from '@angular/core';
import { StepModel } from './models/step.model';
import { StepNames } from './models/step-names';
import { StepStates } from './models/step-states';
import { StepIconSetModel } from './models/step-icon-set.model';
import { Observable, Subscription } from 'rxjs';
import { JourneyNamesModel } from '../../../../shared-steps/models/journey-names.model';
import { SharedRenewalService } from '../../services/shared-renewal.service';
import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { StateModel } from '../../../../api/models/renewal/state.model';
import { isDesktop, isMobileOrTablet } from '@client-monorepo/common/utilities';

@Component({
  selector: 'renewal-stepper',
  templateUrl: './renewal-stepper.component.html',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgClass, NgForOf],
  styleUrls: ['./renewal-stepper.component.scss'],
})
export class RenewalStepperComponent implements OnInit {
  protected readonly stepNames = StepNames;
  protected readonly stepStates = StepStates;

  constructor(
    private sharedService: SharedRenewalService,
  ) {
  }

  @Input()
  showMobileMode = false;

  @Input()
  maxReturnableStep = 3;

  @Input()
  iconSet: StepIconSetModel[] = [
    {
      activeIcon: 'insurance-assets/icons/insurance-info-white.svg',
      deActiveIcon: 'insurance-assets/icons/insurance-info-gray.svg',
    },
    {
      activeIcon: 'insurance-assets/icons/pricing-white.svg',
      deActiveIcon: 'insurance-assets/icons/pricing-gray.svg',
    },
    {
      activeIcon: 'insurance-assets/icons/payment-white.svg',
      deActiveIcon: 'insurance-assets/icons/payment-gray.svg',
    },
    {
      activeIcon: 'insurance-assets/icons/health-check-white.svg',
      deActiveIcon: 'insurance-assets/icons/health-check-gray.svg',
    },
    {
      activeIcon: 'insurance-assets/icons/complete-information-white.svg',
      deActiveIcon: 'insurance-assets/icons/complete-information-gray.svg',
    },
    {
      activeIcon: 'insurance-assets/icons/issue-policy-white.svg',
      deActiveIcon: 'insurance-assets/icons/issue-policy-gray.svg',
    },
  ];

  // Subscriptions
  subscriptions: Subscription[] = [];

  // Vars
  stateData: StateModel[];
  isMobile = isMobileOrTablet() || !isDesktop();
  activeIndex: number;
  steps: StepModel[] = [];
  state$: Observable<StateModel[]>;

  ngOnInit(): void {
    this.sharedService.setJourney(JourneyNamesModel.RENEWAL);
    this.subscribeToStateData();
    const subscription = this.sharedService.getActiveIndex().subscribe({
      next: (index) => {
        if (index !== this.activeIndex) {
          this.activeIndex = index;
          this.changeSteps(this.activeIndex);
        }
      },
    });
    this.subscriptions.push(subscription);
  }

  subscribeToStateData(): void {
    this.state$ = this.sharedService.getStateData();
    const subscription = this.sharedService.getStateData().subscribe({
      next: (data) => {
        if (data) {
          this.stateData = data;
          this.generateStepperData();
        }
      },
    });
    this.subscriptions.push(subscription);
  }

  generateStepperData(): void {
    let activeStepIndex = 0;
    this.steps = this.stateData?.map((item, index) => {
      const iconSet = this.iconSet[item.state - 1];
      if (item.stepState === StepStates.COMPLETED) {
        if (index !== this.stateData.length - 1) {
          activeStepIndex = index + 1;
        } else {
          activeStepIndex = index;
        }
      }
      return {
        title: item.title,
        activeIcon: iconSet.activeIcon,
        deActiveIcon: iconSet.deActiveIcon,
        stepperNumber: item.state,
        state: item.stepState,
      };
    });
    this.changeSteps(activeStepIndex);
  }

  changeSteps(index: number): void {
    if (index >= 0 && index < this.stateData?.length) {
      this.steps.forEach((step) => {
        if (step.state === StepStates.COMPLETED) {
          step.state = StepStates.REVIEWED;
        }
      });
      this.steps[index].state = StepStates.COMPLETED;
      this.sharedService.setActiveIndex(index);
    }
  }

  handleNodeClick(node: StepModel): void {
    if (!this.isMobile && !this.showMobileMode) {
      if (node.state === StepStates.REVIEWED) {
        const index = this.steps.indexOf(node);
        if (this.activeIndex < this.maxReturnableStep) {
          this.changeSteps(index);
        }
      }
    }
  }
}
