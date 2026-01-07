import { Component, effect, inject, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { UiButtonComponent } from '../../../../components/ui-button/ui-button/ui-button.component';
import {
  UsedStepsListComponent
} from '../../../equipment/routes/used/partials/used-steps-list/used-steps-list.component';
import { Subscription } from 'rxjs';
import {
  UsedStepsListModel
} from '../../../equipment/routes/used/partials/used-steps-list/models/used-steps-list.model';
import moment from 'jalali-moment';
import { AppWindow } from '../../../../data-access/web-interfaces/app-window';
import { SubscriptionModel } from '../../data-access/model/subscription.model';
import { UiIconComponent } from '../../../../data-access/directives/ui-icon/ui-icon.component';
import { Router } from '@angular/router';
import { UserAuthService } from '../../../../data-access/services/user-services/user-auth.service';
import { InsuranceUrlsEnum } from '../../../../data-access/enums/insurance-urls.enum';
import { InsuranceTabEnum } from '../../../policy/data-access/enums/policy-list.enum';

declare const window: AppWindow;

@Component({
  selector: 'export-insurance',
  standalone: true,
  imports: [
    UiButtonComponent,
    UsedStepsListComponent,
    UiIconComponent,
    NgOptimizedImage
  ],
  templateUrl: './export-insurance.component.html',
  styleUrl: './export-insurance.component.scss'
})
export class ExportInsuranceComponent {
  private authService = inject(UserAuthService);
  // Subscription
  subscriptions: Subscription[] = [];
  // Vars
  listItems: UsedStepsListModel[];
  // SIGNALS(INPUT)
  subscriptionInfo = input.required<SubscriptionModel>();

  constructor(private router: Router) {
    effect(() => {
      if (this.subscriptionInfo()) {
        this.generateListItems();
      }
    });
  }

  generateListItems(): void {
    this.listItems = [
      {
        name: 'مدل دستگاه',
        value: this.subscriptionInfo().productModel ?? '-',
        isPrice: false
      },
      {
        name: 'مالک دستگاه',
        value: this.subscriptionInfo().firstName + ' ' + this.subscriptionInfo().lastName,
        isPrice: false
      },
      {
        name: 'کد ملی',
        value: this.subscriptionInfo().nationalCode ?? '-',
        isPrice: false
      },
      {
        name: 'شماره بیمه نامه',
        value: this.subscriptionInfo().policyNumber,
        isPrice: false
      },
      {
        name: 'شناسه سریال دستگاه',
        value: this.subscriptionInfo().serialNumber ?? '-',
        isPrice: false
      },
      {
        name: 'تاریخ صدور',
        value: this.subscriptionInfo().newPolicyIssuedAt ? moment(this.subscriptionInfo().newPolicyIssuedAt)
          .locale('fa')
          .format('YYYY/MM/DD') : 'ندارد',
        isPrice: false
      },
      {
        name: 'پایان اعتبار',
        value: this.subscriptionInfo().newPolicyExpiredAt ?
          moment(this.subscriptionInfo().newPolicyExpiredAt)
            .locale('fa')
            .format('YYYY/MM/DD') : 'ندارد',
        isPrice: false
      }
    ];
  }

  goToPolicies(): void {
    this.router.navigate([InsuranceUrlsEnum.PolicyList], {
      queryParams: {
        type: InsuranceTabEnum.DIGITAL_EQUIPMENT
      }
    }).then();
  }

  downloadPolicy(): void {
    window.open(this.subscriptionInfo().pdfUrl);
  }
}
