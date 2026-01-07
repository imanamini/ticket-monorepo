import { Inject, inject, Injectable } from '@angular/core';
import { PRE_REGISTRATION_STEP_TYPE, PreRegistrationStep } from './pre-registration-step';
import { BehaviorSubject } from 'rxjs';
import { PreRegistrationFilter } from './pre-registration-filter';
import { CreditUrlService } from '../../data-access/utils/url';
import { CreditNavigationService } from '../../data-access/services/credit-navigation.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CreditApiService } from '../../data-access/services/credit-api.service';
import { PlanGroup } from '../../data-access/models/credit/pre-registration/credit-plan-group';
import { PreRegistrationErrorType } from './pre-registration-error-type';
import { CreditServiceTypeService } from '../../data-access/services/credit-service-type.service';
import { PreRegisterRequest } from '../../data-access/models/credit/volunteer/pre-register.request';
import { PreRegistrationSubmitterService } from './pre-registration-submitter.service';
import { VolunteerField } from '../../data-access/models/credit/volunteer/volunteers-detail.response';
import { MessageService } from '../../data-access/services/message.service';
import { UserType } from '../../data-access/models/credit-smart-scoring/pre-signup-request.payload';
import { GetPlanGroupsResponse } from '../../data-access/models/credit/pre-registration/get-plan-groups.response';
import { CREDIT_ENVIRONMENT, CreditEnvironmentInterface } from '../../credit-environment.interface';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';
import { CreditTrackerEvent, PageNameMapper } from '../../credit-smart-scoring/services/credit-tracker-event';
import { CreditUserService } from '../../data-access/services/credit-user.service';

const QUERY_PARAMS_MAP: { [key: number]: string } = {
  0: 'Plan',
  1: 'Conditions',
  2: 'Collateral',
  3: 'Subscription',
  4: 'PriceDetail',
};

@Injectable({
  providedIn: 'root',
})
export class PreRegistrationService {
  steps: PreRegistrationStep[] = [
    {
      type: PRE_REGISTRATION_STEP_TYPE.BASE,
      skipInPrev: false,
      skipInNext: false,
    },
    {
      type: PRE_REGISTRATION_STEP_TYPE.CONDITIONS,
      skipInPrev: false,
      skipInNext: false,
    },
    {
      type: PRE_REGISTRATION_STEP_TYPE.COLLATERAL,
      skipInPrev: false,
      skipInNext: false,
    },
    {
      type: PRE_REGISTRATION_STEP_TYPE.PRE_SUBSCRIPTION,
      skipInPrev: true,
      skipInNext: true,
    },
    {
      type: PRE_REGISTRATION_STEP_TYPE.SUBSCRIPTION,
      skipInPrev: true,
      skipInNext: true,
    },
    {
      type: PRE_REGISTRATION_STEP_TYPE.JOURNEY_TYPE,
      skipInPrev: true,
      skipInNext: false,
    },
    {
      type: PRE_REGISTRATION_STEP_TYPE.CONFIRM_PLAN,
      skipInPrev: false,
      skipInNext: false,
    },
  ];
  activeStepIndex = new BehaviorSubject<number>(0);

  collateralType = new BehaviorSubject<string>('');

  allPlans: PlanGroup[] = [];

  filteredPlans: PlanGroup[] = [];

  filters!: PreRegistrationFilter;

  errorType = new BehaviorSubject<PreRegistrationErrorType | null>(null);

  smartScore = false;
  userType: UserType = UserType.APP;

  creditServiceTypeService = inject(CreditServiceTypeService);
  creditApiService = inject(CreditApiService);
  creditUrlService = inject(CreditUrlService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  creditNavigationService = inject(CreditNavigationService);
  private preRegistrationSubmitterService = inject(PreRegistrationSubmitterService);
  private messageService = inject(MessageService);
  private eventService = inject(NgxEventTrackerService);
  private userService = inject(CreditUserService);

  constructor(
    @Inject(CREDIT_ENVIRONMENT)
    private creditEnvironment: CreditEnvironmentInterface,
  ) {}

  init(): Promise<void> {
    this.addQueryParam(0);
    this.checkSmartScoreIsEnabled();
    this.clearService();
    return new Promise((resolve, reject) => {
      if (this.smartScore) {
        this.creditApiService.getSmartScorePlans(this.userType).subscribe({
          next: (response) => {
            this.checkPlansResponseDetail(response);
            resolve();
          },
          error: (error) => {
            reject(error);
          },
        });
      } else {
        this.creditApiService.getPlanGroups(this.userType).subscribe({
          next: (response) => {
            this.checkPlansResponseDetail(response);
            resolve();
          },
          error: (error) => {
            reject(error);
          },
        });
      }
    });
  }

  checkPlansResponseDetail(plans: GetPlanGroupsResponse) {
    if (
      (this.creditServiceTypeService.isBnpl() && !plans.hasBNPLCapacity) ||
      (this.creditServiceTypeService.isCredit() && !plans.hasBNPLCapacity && !plans.hasCreditCapacity)
    ) {
      this.errorType.next('NO_PLAN');
    } else if (!plans.planGroupDetails?.length) {
      this.errorType.next('NO_PLAN_USER');
    } else {
      this.errorType.next(null);
    }
    this.allPlans = plans.planGroupDetails;
    this.filteredPlans = plans.planGroupDetails;
    this.filters = {};
  }

  checkSmartScoreIsEnabled() {
    this.smartScore = !!this.route.snapshot.queryParams['smartScore'];
    this.userType = this.route.snapshot.queryParams['userType'] ?? UserType.APP;
  }

  clearService(): void {
    this.activeStepIndex.next(0);
    this.allPlans = [];
    this.filteredPlans = [];
    this.filters = {};
  }

  nextStep(): void {
    setTimeout(() => {
      const activeStep = this.activeStepIndex.getValue();
      let newStep = activeStep + 1;
      while (newStep < this.steps.length && this.steps[newStep].skipInNext) {
        newStep++;
      }
      if (newStep >= this.steps.length) {
        this.finishFlow();
        return;
      }
      this.activeStepIndex.next(newStep);
      this.addQueryParam(newStep);
    }, 0);
  }

  prevStep(): void {
    const activeStep = this.activeStepIndex.getValue();
    let newStep = activeStep - 1;
    while (newStep >= 0 && this.steps[newStep].skipInPrev) {
      newStep--;
    }
    if (newStep < 0) {
      this.goBack();
      return;
    }
    this.activeStepIndex.next(newStep);
    this.addQueryParam(newStep);
  }

  addQueryParam(stepIndex: number) {
    const currentParams = this.route.snapshot.queryParams; // Get current query params
    const queryParams = {
      ...currentParams,
      step: QUERY_PARAMS_MAP[stepIndex],
    };
    this.router
      .navigate([], {
        relativeTo: this.route,
        queryParams: queryParams,
        queryParamsHandling: 'merge',
      })
      .then();
  }

  setFilters(changedFilters: PreRegistrationFilter): void {
    this.filters = Object.assign({}, this.filters, changedFilters);
    this.onChangeFilter();
  }

  onChangeFilter(): void {
    this.filteredPlans = this.allPlans.filter((item) => {
      let output = true;
      Object.keys(this.filters).forEach((filterName) => {
        const key = filterName as keyof PreRegistrationFilter;
        if (this.getValueOfFilter(item, key) !== this.filters[key]) {
          output = false;
        }
      });
      return output;
    });
  }

  getValueOfFilter(planGroup: PlanGroup, filterName: keyof PreRegistrationFilter): string | number {
    switch (filterName) {
      case 'fundProviderCode':
        return planGroup.fundProvider.fundProviderCode;
      case 'collateralType':
        return planGroup.collateralDto.type;
      case 'registrationFlowType':
        return planGroup.planRegistrationFlowDto.type;
      case 'userEntryPoint':
        return <number>planGroup.userEntryPoint;
      default:
        return planGroup[filterName];
    }
  }

  unsetFilters(removedFilters: (keyof PreRegistrationFilter)[]): void {
    if (!removedFilters || !removedFilters.length) {
      return;
    }
    removedFilters.forEach((item) => {
      if (this.filters[item] || this.filters[item] === 0) {
        delete this.filters[item];
      }
    });
    this.onChangeFilter();
  }

  closeFlow(): void {
    this.clearService();
    this.creditNavigationService.closeService();
  }

  finishFlow(): void {
    const filteredPlans = this.filteredPlans;
    if (!filteredPlans[0]) {
      return;
    }
    const planId = filteredPlans[0].planId;
    const groupId = filteredPlans[0].groupId;

    if (this.smartScore) {
      this.submitForm({ planId, groupId });
      this.sendEvent(filteredPlans[0], 'credit_smart_scoring_select_plan').then();
    } else {
      this.clearService();
      this.goToPlanGroupDetail(planId, groupId);
    }
  }

  submitForm(data: { planId: string; groupId: string }): void {
    this.creditApiService.getVolunteersDetail().subscribe({
      next: (response) => {
        let volunteerFields: {
          birthDate?: VolunteerField;
          nationalCode?: VolunteerField;
        } = {};
        response.fields.forEach((field) => {
          volunteerFields = Object.assign(volunteerFields, { [field.name]: field });
        });

        const birthDate = volunteerFields.birthDate?.value;
        const nationalCode = volunteerFields.nationalCode?.value;
        const payload: PreRegisterRequest = {
          nationalCode: nationalCode!.toString(),
          birthDate: Number(birthDate),
          planId: data.planId,
          groupId: data.groupId,
          cartReservationRequest: null,
        };
        this.preRegistrationSubmitterService.submit(payload).then(() => {
          setTimeout(() => {
            this.clearService();
          }, 0);
        });
      },
      error: (error) => {
        this.messageService.showErrorOfErrorResponse(error);
      },
    });
  }

  async sendEvent(selectedPlan: PlanGroup, event: CreditTrackerEvent) {
    const user = await this.userService.currentUser();
    const eventData = {
      event: event,
      page_name: PageNameMapper[event],
      user_id: user.userId,
      collateral: selectedPlan?.collateralDto?.name,
      fund_provider_name: selectedPlan?.fundProvider?.name,
    };
    this.eventService.sendEvent(eventData, { platforms: ['gtm'] });
  }

  distinctFieldItems(fieldName: string, from: any[]): (string | number)[] {
    const options: any = {};
    from.forEach((item) => {
      options[item[fieldName]] = true;
    });
    return Object.keys(options);
  }

  goToPlanGroupDetail(planId: string, groupId: string): void {
    this.router.navigateByUrl(this.creditUrlService.getInnerServicePath(`/select-plan/detail/${planId}/${groupId}`)).then();
  }

  goToRegisterForm(planId: string, groupId: string, queryParams?: Params): void {
    // Filter out undefined or null query parameters
    const filteredQueryParams = queryParams
      ? Object.entries(queryParams)
          .filter(([_, value]) => value !== undefined && value !== null)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join('&')
      : '';

    const url = this.creditUrlService.getInnerServicePath(
      `/select-plan/submit/${planId}/${groupId}${filteredQueryParams ? `?${filteredQueryParams}` : ''}`,
    );

    this.router.navigateByUrl(url).then();
  }

  goToSelectPlan(): void {
    this.router.navigateByUrl(this.creditUrlService.getInnerServicePath(`/select-plan`)).then();
  }

  removeConfirmStep(): void {
    this.steps = this.steps.filter((item) => item.type !== PRE_REGISTRATION_STEP_TYPE.CONFIRM_PLAN);
  }

  resetSteps(): void {
    this.steps = [
      {
        type: PRE_REGISTRATION_STEP_TYPE.BASE,
        skipInPrev: false,
        skipInNext: false,
      },
      {
        type: PRE_REGISTRATION_STEP_TYPE.CONDITIONS,
        skipInPrev: false,
        skipInNext: false,
      },
      {
        type: PRE_REGISTRATION_STEP_TYPE.COLLATERAL,
        skipInPrev: false,
        skipInNext: false,
      },
      {
        type: PRE_REGISTRATION_STEP_TYPE.PRE_SUBSCRIPTION,
        skipInPrev: true,
        skipInNext: true,
      },
      {
        type: PRE_REGISTRATION_STEP_TYPE.SUBSCRIPTION,
        skipInPrev: true,
        skipInNext: true,
      },
      {
        type: PRE_REGISTRATION_STEP_TYPE.JOURNEY_TYPE,
        skipInPrev: true,
        skipInNext: false,
      },
      {
        type: PRE_REGISTRATION_STEP_TYPE.CONFIRM_PLAN,
        skipInPrev: false,
        skipInNext: false,
      },
    ];
  }

  setCollateralType(collateralType: string): void {
    this.collateralType.next(collateralType);
  }

  changeSkipInNextStepByType(type: PRE_REGISTRATION_STEP_TYPE, value: boolean) {
    const index = this.steps.findIndex((item) => item.type === type);
    this.steps[index].skipInNext = value;
  }

  changeSkipInPrevStepByType(type: PRE_REGISTRATION_STEP_TYPE, value: boolean) {
    const index = this.steps.findIndex((item) => item.type === type);
    this.steps[index].skipInPrev = value;
  }

  goBack() {
    this.router.navigateByUrl('/');
  }
}
