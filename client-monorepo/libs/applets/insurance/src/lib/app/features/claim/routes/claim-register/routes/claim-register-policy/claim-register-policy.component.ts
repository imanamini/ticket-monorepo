import { Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { HeaderTitlePositionEnum } from '../../../../../../data-access/enums/header-title-position.enum';
import { Router } from '@angular/router';
import { MessageService } from '@client-monorepo/common/utilities';
import { Observable, Subscription } from 'rxjs';
import { PolicyApiService } from '../../../../../../data-access/services/policy/policy-api.service';
import { PolicyModel } from '../../../../../equipment/api/models/policy/policy.model';
import { ActionButtonsComponent } from '../../../../../../components/action-buttons/action-buttons.component';
import { AsyncPipe } from '@angular/common';
import { UiLoadingSpinnerComponent } from '../../../../../../components/ui-loading-spinner/ui-loading-spinner.component';
import { LoadingService } from '../../../../../../data-access/services/loading.service';
import { IconEnum } from '../../../../../../data-access/enums/icon.enum';
import { EmptyResultComponent } from '../../../../../../components/empty-result/empty-result.component';
import { InsButtonStyleEnum } from '../../../../../../data-access/enums/ins-button-style.enum';
import { InsButtonSizeEnum } from '../../../../../../data-access/enums/ins-button-size.enum';
import { InsButtonModeEnum } from '../../../../../../data-access/enums/ins-button-mode.enum';
import { InsButtonComponent } from '../../../../../../components/ins-button/ins-button.component';
import { ClaimCardComponent } from '../../../../partials/card/claim-card.component';
import { RegisterDamageStateManagementService } from '../../services/register-damage-state-management.service';
import { SampleQueryModel } from '../../../../data-access/sample-query.model';
import { INSURANCE_APP_PREFIX } from '../../../../../../data-access/constants/insurance-app-prefix.constant';
import { InsDigikalaService } from '../../../../../../data-access/services/ins-digikala.service';

@Component({
  selector: 'insurance-list',
  standalone: true,
  imports: [ActionButtonsComponent, AsyncPipe, UiLoadingSpinnerComponent, EmptyResultComponent, InsButtonComponent, ClaimCardComponent],
  templateUrl: './claim-register-policy.component.html',
  styleUrl: './claim-register-policy.component.scss',
})
export class ClaimRegisterPolicyComponent implements OnInit, OnDestroy {
  constructor(
    private stateManagement: RegisterDamageStateManagementService,
    private router: Router,
    private messageService: MessageService,
    private policyApiService: PolicyApiService,
    private loadingService: LoadingService,
  ) {
    this.loadingService.setLoading(true);
  }

  protected readonly HeaderTitlePositionEnum = HeaderTitlePositionEnum;
  protected readonly InsButtonStyleEnum = InsButtonStyleEnum;
  protected readonly InsButtonSizeEnum = InsButtonSizeEnum;
  protected readonly InsButtonModeEnum = InsButtonModeEnum;
  protected readonly IconEnum = IconEnum;
  // SUBSCRIPTIONS
  subscriptions = new Subscription();

  // VARIABLES
  sampleQuery: SampleQueryModel;
  selectedPolicyIndex: number | null = null;
  policies: PolicyModel[];
  selectedPolicy: PolicyModel;
  loading$: Observable<boolean> = this.loadingService.getLoading();
  closeIconName = input<IconEnum>(IconEnum.Close);
  isChecked = false;
  isDigikala = signal<boolean>(false);

  digikalaService = inject(InsDigikalaService);

  ngOnInit(): void {
    this.createSimpleQuery();
    this.getPolicyList();
    this.isDigikala.set(this.digikalaService.isDigikala);
  }

  onSave(): void {
    if (this.selectedPolicy) {
      if (['HOME', 'HOMEAPPLIANCE'].includes(this.selectedPolicy.electronicEquipment.category)) {
        this.router.navigate([`${INSURANCE_APP_PREFIX}/claim/register/call-to-support-home`]);
        return;
      }
      this.router
        .navigate([`${INSURANCE_APP_PREFIX}/claim/register/step-one`], {
          queryParams: {
            policyDraftNo: this.selectedPolicy?.policyDraftNo,
            startAt: this.selectedPolicy?.startAt,
            policyId: this.selectedPolicy?.policyId,
          },
          queryParamsHandling: 'merge',
        })
        .then();
    }
  }

  onChecked(ev: boolean, index: number, policy: PolicyModel): void {
    this.selectedPolicyIndex = index;
    if (ev) {
      this.selectedPolicy = policy;
    }
    this.stateManagement.setPolicyStartAt(policy.startAt);
  }

  handleDeActiveButtonClicked(): void {
    this.router.navigate([`${INSURANCE_APP_PREFIX}/claim/register/type`]).then();
  }

  getPolicyList(): void {
    const subscription = this.policyApiService.getPolicyListProfile(this.sampleQuery, this.sampleQuery.page).subscribe({
      next: (res) => {
        this.policies = res?.data;
        this.loadingService.setLoading(false);
      },
      error: (e) => {
        this.messageService.showErrorIfExists(e);
        this.loadingService.setLoading(false);
      },
    });
    this.subscriptions.add(subscription);
  }

  createSimpleQuery(): void {
    this.sampleQuery = {
      orders: [{ field: 'createdAt', order: 'desc' }],
      restrictions: [
        { type: 'collection', field: 'policyStateTaxonomyKey', values: ['Active', 'EffectiveActive'] },
        { type: 'simple', field: 'hasClaimRequest', value: false, operation: 'eq' },
      ],
      page: 1,
      take: 20,
    };
  }

  goToUsed(): void {
    this.router.navigate([`${INSURANCE_APP_PREFIX}/InsuranceUrlsEnum.Equipment`]).then();
  }

  ngOnDestroy(): void {
    this.createSimpleQuery();
    this.subscriptions.unsubscribe();
  }

  clickHandler(i: any): void {
    this.isChecked = this.selectedPolicyIndex === i;
  }
}
