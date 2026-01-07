import { Component, OnDestroy, OnInit } from '@angular/core';
import moment from 'jalali-moment';
import { JourneyNamesModel } from '../../../../shared-steps/models/journey-names.model';
import { SharedRenewalService } from '../../services/shared-renewal.service';
import { RenewalApiService } from '../../../../api/services/renewal/renewal-api.service';
import { Subscription } from 'rxjs';
import { RenewalStepsListComponent } from '../../partials/renewal-steps-list/renewal-steps-list.component';
import { JourneyButtonsComponent } from '../../../../partials/journey-buttons/journey-buttons.component';
import { OrderModel } from '../../../../api/models/renewal/order.model';
import { ProductCategoryModel } from '../../../../api/models/policy/product-category.model';
import { UsedStepsListModel } from '../../../used/partials/used-steps-list/models/used-steps-list.model';
import { MessageService } from '@client-monorepo/common/utilities';

@Component({
  selector: 'renewal-order-info',
  templateUrl: './renewal-order-info.component.html',
  standalone: true,
  imports: [RenewalStepsListComponent, JourneyButtonsComponent],
  styleUrls: ['./renewal-order-info.component.scss'],
})
export class RenewalOrderInfoComponent implements OnInit, OnDestroy {
  constructor(
    private sharedService: SharedRenewalService,
    private renewalApiService: RenewalApiService,
    private messageService: MessageService,
  ) {}

  // Subscriptions
  subscriptions: Subscription[] = [];

  // Vars
  uniqueCode: string;
  orderInfo: OrderModel;
  listItems: UsedStepsListModel[] = [];
  isSubmitting: boolean;

  ngOnInit(): void {
    this.sharedService.setJourney(JourneyNamesModel.RENEWAL);
    this.getUniqueCode();
  }

  getUniqueCode(): void {
    this.sharedService.getUniqueCode().subscribe({
      next: (code) => {
        if (code) {
          this.uniqueCode = code;
          this.getOrderInfo();
        }
      },
    });
  }

  getOrderInfo(): void {
    this.subscriptions[0] = this.renewalApiService.getOrderInfo(this.uniqueCode).subscribe({
      next: (data) => {
        this.orderInfo = data.data;
        this.sharedService.setSelectedCategory(ProductCategoryModel[this.orderInfo.productCategory]);
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
        name: 'سریال دستگاه / IMEI',
        value: this.orderInfo.serialNumber ? this.orderInfo.serialNumber : '-',
        isPrice: false,
      },
      {
        name: 'مشخصات بیمه شده',
        value: this.orderInfo.firstName + ' ' + this.orderInfo.lastName,
        isPrice: false,
      },
      {
        name: 'شماره بیمه فعلی',
        value: this.orderInfo.oldPolicyNumber,
        isPrice: false,
      },
      {
        name: 'پایان اعتبار',
        value: moment(this.orderInfo.policyExpiredAt).locale('fa').format('YYYY/MM/DD'),
        isPrice: false,
      },
    ];
  }

  goToNextStep(): void {
    this.acceptInfo();
  }

  acceptInfo(): void {
    this.isSubmitting = true;
    this.renewalApiService.acceptInfo(this.uniqueCode).subscribe({
      next: (res) => {
        this.sharedService.setStepChangeSubject('NEXT');
      },
      error: (e) => {
        this.messageService.showErrorIfExists(e);
        this.isSubmitting = false;
      },
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s && s.unsubscribe());
  }
}
