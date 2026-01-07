import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import moment from 'jalali-moment';
import { SharedRenewalService } from '../../services/shared-renewal.service';
import { RenewalApiService } from '../../../../api/services/renewal/renewal-api.service';
import { RenewalStepsListModel } from '../../partials/renewal-steps-list/models/renewal-steps-list.model';
import { JourneyNamesModel } from '../../../../shared-steps/models/journey-names.model';
import { RenewalStepsListComponent } from '../../partials/renewal-steps-list/renewal-steps-list.component';
import { NgIf } from '@angular/common';
import { JourneyButtonsComponent } from '../../../../partials/journey-buttons/journey-buttons.component';
import { UiButtonComponent } from '../../../../../../components/ui-button/ui-button/ui-button.component';
import { OrderModel } from '../../../../api/models/renewal/order.model';
import { isDesktop, isMobileOrTablet, MessageService } from '@client-monorepo/common/utilities';

@Component({
  selector: 'renewal-issue-policy',
  templateUrl: './renewal-issue-policy.component.html',
  standalone: true,
  imports: [RenewalStepsListComponent, NgIf, JourneyButtonsComponent, UiButtonComponent],
  styleUrls: ['./renewal-issue-policy.component.scss'],
})
export class RenewalIssuePolicyComponent implements OnInit, OnDestroy {
  constructor(
    private service: SharedRenewalService,
    private apiService: RenewalApiService,
    private messageService: MessageService,
  ) {}

  @Input()
  journey: JourneyNamesModel;

  readonly JourneyNamesModel = JourneyNamesModel;

  // Subscription
  subscriptions: Subscription[] = [];

  // Vars
  listItems: RenewalStepsListModel[];
  uniqueCode: string;
  policyData: OrderModel;
  isMobile = isMobileOrTablet() || !isDesktop();

  ngOnInit(): void {
    this.service.setJourney(this.journey);
    this.getUniqueCode();
  }

  getUniqueCode(): void {
    this.service.getUniqueCode().subscribe({
      next: (code) => {
        if (code) {
          this.uniqueCode = code;
          this.getOrderInfo();
        }
      },
    });
  }

  getOrderInfo(): void {
    this.subscriptions[0] = this.apiService.getOrderInfo(this.uniqueCode).subscribe({
      next: (res) => {
        this.policyData = res.data;
        this.generateListItems();
      },
      error: (e) => {
        this.messageService.showErrorIfExists(e);
      },
    });
  }

  generateListItems(): void {
    this.listItems = [
      {
        name: 'مدل دستگاه',
        value: this.policyData.productName,
        isPrice: false,
      },
      {
        name: 'شماره بیمه',
        value: this.policyData.policyNumber,
        isPrice: false,
      },
      {
        name: this.journey === JourneyNamesModel.RENEWAL ? 'تاریخ تمدید' : 'تاریخ صدور',
        value: this.policyData.newPolicyIssuedAt ? moment(this.policyData.newPolicyIssuedAt).locale('fa').format('YYYY/MM/DD') : 'ندارد',
        isPrice: false,
      },
      {
        name: 'تاریخ اعتبار',
        value: this.policyData.newPolicyExpiredAt ? moment(this.policyData.newPolicyExpiredAt).locale('fa').format('YYYY/MM/DD') : 'ندارد',
        isPrice: false,
      },
    ];
  }

  goToPolicies(): void {
    window.location.href = '/mini-app/insurance/dashboard/policy/list/' + this.policyData.policyNumber;
  }

  downloadPolicy(): void {
    window.open(this.policyData.pdfUrl, '_blank');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s && s.unsubscribe());
  }
}
