import { Component, inject, OnInit, signal } from '@angular/core';
import { NgxIcon } from '@digipay/ngx-icon';
import { InsButtonComponent } from '../../../../../components/ins-button/ins-button.component';
import { InsButtonStyleEnum } from '../../../../../data-access/enums/ins-button-style.enum';
import { InsButtonSizeEnum } from '../../../../../data-access/enums/ins-button-size.enum';
import { PaymentResultMessageModel } from './data-access/models/payment-result-message.model';
import { InsAlertComponent } from '../../../../../components/ins-alert/ins-alert.component';
import { AlertColorEnum } from '../../../../../data-access/enums/alert-color.enum';
import { Router } from '@angular/router';
import { HOUSE_INCIDENTS_URLS } from '../../../data-access/constants/house-incidents-urls';
import { QueryParamHouseIncidentEnum } from '../../../data-access/enums/query-param-house-incident.enum';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { BaseComponent } from '../../../../../components/base/base.component';
import { HouseIncidentsActionService } from '../../../data-access/services/house-incidents-action.service';
import { HouseIncidentsDataStorageService } from '../../../data-access/services/house-incidents-data-storage.service';
import { MainHeaderComponent } from '../../../../../components/main-header/main-header.component';
import { FaqCategoryTypeEnum } from '../../../../../data-access/enums/faq-category-type.enum';
import { CloseService } from '../../../../vehicle/data-access/services/shared/close.service';
import {
  GoogleTagManagerService
} from '../../../../../data-access/services/google-tag-manager/angular-google-tag-manager.service';

@Component({
  selector: 'payment-result',
  standalone: true,
  imports: [
    NgxIcon,
    InsButtonComponent,
    InsAlertComponent,
    NgxSpinnerModule,
    MainHeaderComponent
  ],
  templateUrl: './payment-result.component.html',
  styleUrl: './payment-result.component.scss'
})
export class PaymentResultComponent extends BaseComponent implements OnInit {
  isSuccess = signal<boolean | null>(null);
  isLoading = signal<boolean>(true);
  successDetail = signal<PaymentResultMessageModel>({
    title: 'پرداخت حق بیمه، با موفقیت انجام شد.',
    subtitle: 'پرداخت حق بیمه به معنای صدور بیمه‌نامه نیست؛\n' +
      'لطفاً مراحل بعدی را تکمیل کنید.',
    notifyMessage: 'در صورت عدم تکمیل اطلاعات ظرف ۷۲ ساعت آینده، وجه پرداختی به کیف پول شما باز خواهد گشت.'
  });
  failedDetail = signal<PaymentResultMessageModel>({
    title: 'پرداخت حق بیمه انجام نشد!',
    subtitle: 'مشکلی در فرآیند پرداخت حق بیمه رخ داده است.\n' +
      'لطفا مجددا تلاش فرمایید.',
  });

  private router = inject(Router);
  private houseIncidentsActionService = inject(HouseIncidentsActionService);
  private houseIncidentsDataStorageService = inject(HouseIncidentsDataStorageService);
  private closeService = inject(CloseService);
  private GTManagerService = inject(GoogleTagManagerService);
  private applicationFormId: string | null = null;
  protected readonly InsButtonStyleEnum = InsButtonStyleEnum;
  protected readonly InsButtonSizeEnum = InsButtonSizeEnum;
  protected readonly AlertColorEnum = AlertColorEnum;
  protected readonly FaqCategoryTypeEnum = FaqCategoryTypeEnum;

  ngOnInit(): void {
    this.GTManagerService.handleDuplicatePaymentResultEvent();
    const providerId = this.router.routerState.snapshot.root.queryParams[QueryParamHouseIncidentEnum.ProviderId];
    this.houseIncidentsActionService.handlePaymentResult(providerId).subscribe({
      next: value => {
        this.isLoading.set(false);
        this.isSuccess.set(value);
        this.saveIdAndDeleteOnStorage();
      }
    });
  }

  public retryPayment(): void {
    this.houseIncidentsActionService.retryFailedPayment(this.applicationFormId);
  }

  completeUserInfo(): void {
    this.router.navigate([HOUSE_INCIDENTS_URLS.COMPLETE_INFO], {
      queryParams: {
        [QueryParamHouseIncidentEnum.ApplicationId]: this.applicationFormId
      }
    });
  }

  saveIdAndDeleteOnStorage(): void {
    this.applicationFormId = this.houseIncidentsDataStorageService.getApplicationFormId();
    if (this.isSuccess()) {
      this.houseIncidentsDataStorageService.removeApplicationFormId();
    }
  }

  backButtonClicked(): void {
    this.closeService.close();
  }

}
