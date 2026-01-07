import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ColorRangeModel, PlanServices, ProgressBarModel, SERVICES_TYPE } from '@client-monorepo/common/subscription';
import { Subscription } from 'rxjs';
import { SubscriptionManagementService } from '../../data-access/services/subscription-management.service';
import { ServiceItemComponent } from './service-item/service-item.component';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';

@Component({
  selector: 'subscription-applet-other-services',
  templateUrl: './other-services.component.html',
  standalone: true,
  styleUrls: ['./other-services.component.scss'],
  imports: [ServiceItemComponent, ProgressBarComponent],
})
export class OtherServicesComponent implements OnInit, OnDestroy {
  @Input() services!: PlanServices[];

  @ViewChild('cashbackTemplate', { static: true })
  cashbackTemplate!: TemplateRef<any | null>;

  subscriptions: Subscription[] = [];

  cashbackProgressData: Partial<Record<SERVICES_TYPE, ProgressBarModel>> = {};

  CASHBACK_COLOR_RANGES: ColorRangeModel[] = [
    { limit: 50, color: '#789AFFFF' },
    { limit: 90, color: '#FFA054FF' },
    { limit: 100, color: '#FF6572FF' },
    { limit: 101, color: '#DEE3E7FF' },
  ];

  protected readonly SERVICES_TYPE = SERVICES_TYPE;

  constructor(private subscriptionManagementService: SubscriptionManagementService) {}

  ngOnInit(): void {
    this.subscriptionManagementService.getUserCashback();
    this.setCashbackProgress();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => {
      s.unsubscribe();
    });
  }

  setCashbackProgress(): void {
    const userCallbackSub = this.subscriptionManagementService.userCashback.subscribe((cashbackData) => {
      if (!cashbackData) {
        return;
      }

      // Reset the object
      this.cashbackProgressData = {} as Record<SERVICES_TYPE, ProgressBarModel>;

      cashbackData.forEach((cashback) => {
        this.cashbackProgressData[cashback.type] = {
          total: cashback.totalCount,
          used: cashback.usedCount,
          defaultColor: '#F2F5F8',
          colorRange: this.CASHBACK_COLOR_RANGES,
        };
      });
    });
    this.subscriptions.push(userCallbackSub);
  }

  getTemplate(type: SERVICES_TYPE): TemplateRef<any | null> | null {
    switch (type) {
      case SERVICES_TYPE.CASHBACK:
      case SERVICES_TYPE.PURCHASE_CASHBACK:
        return this.cashbackTemplate;
      default:
        return null;
    }
  }

  selectService(service: PlanServices): void {
    const redirectUrl = `${window.location.origin}/mini-app/pay-club/`;
    switch (service.type) {
      case SERVICES_TYPE.COIN:
        window.open(redirectUrl, '_self');
        break;
      default:
        return;
    }
  }
}
