import { Component, inject, OnInit, signal } from '@angular/core';
import { AlertColorEnum } from '../../../../data-access/enums/alert-color.enum';
import { InsAlertComponent } from '../../../../components/ins-alert/ins-alert.component';
import { HouseIncidentsStepsEnum } from '../../data-access/enums/house-incidents-steps.enum';
import {
  HouseIncidentsStepperComponent
} from '../../components/house-incidents-stepper/house-incidents-stepper.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InsButtonComponent } from '../../../../components/ins-button/ins-button.component';
import { MainHeaderComponent } from '../../../../components/main-header/main-header.component';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { InsIconComponent } from '../../../vehicle/components/ins-icon/ins-icon.component';
import { HouseIncidentsApiService } from '../../data-access/services/house-incidents-api.service';
import { PolicyUserInfoModel } from '../complete-journey/model/policy-user-info.model';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { InsButtonStyleEnum } from '../../../../data-access/enums/ins-button-style.enum';
import { InsButtonSizeEnum } from '../../../../data-access/enums/ins-button-size.enum';
import { HouseIncidentsActionService } from '../../data-access/services/house-incidents-action.service';
import { InsButtonModeEnum } from '../../../../data-access/enums/ins-button-mode.enum';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxAlert } from '@digipay/ngx-alert';
import { NgClass } from '@angular/common';
import { QueryParamHouseIncidentEnum } from '../../data-access/enums/query-param-house-incident.enum';
import { ActivatedRoute } from '@angular/router';
import { FaqCategoryTypeEnum } from '../../../../data-access/enums/faq-category-type.enum';
import { FaqService } from '../../../../data-access/services/faq.service';

@Component({
  selector: 'checkout',
  standalone: true,
  imports: [
    InsAlertComponent,
    HouseIncidentsStepperComponent,
    FormsModule,
    InsButtonComponent,
    MainHeaderComponent,
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    InsIconComponent,
    NgxSkeletonLoadingComponent,
    PipesModule,
    NgxButtonComponent,
    NgxIcon,
    NgxAlert,
    NgClass
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {

  protected readonly AlertColorEnum = AlertColorEnum;
  protected readonly HouseIncidentsStepsEnum = HouseIncidentsStepsEnum;

  private applicationId: string;
  public orderDetail = signal<PolicyUserInfoModel>(null);
  public isSendingToPayment = signal<boolean>(false);

  private activatedRoute = inject(ActivatedRoute);
  private houseIncidentsApiService = inject(HouseIncidentsApiService);
  private houseIncidentsActionService = inject(HouseIncidentsActionService);
  private faqService = inject(FaqService);
  protected readonly InsButtonModeEnum = InsButtonModeEnum;
  protected readonly InsButtonStyleEnum = InsButtonStyleEnum;
  protected readonly InsButtonSizeEnum = InsButtonSizeEnum;
  protected readonly FaqCategoryTypeEnum = FaqCategoryTypeEnum;

  ngOnInit(): void {
    this.setApplicationId();
    this.loadOrderDetail();
  }

  setApplicationId(): void {
    this.applicationId = this.activatedRoute.snapshot.queryParamMap.get(QueryParamHouseIncidentEnum.ApplicationId);
  }

  loadOrderDetail(): void {
    this.houseIncidentsApiService.getPolicyUserInfo(this.applicationId).subscribe({
      next: result => {
        this.orderDetail.set(result.result);
        return result;
      }
    });
  }

  confirmAndPay(): void {
    this.houseIncidentsActionService.sendToPayment(this.applicationId);
  }

  openVoucherBottomSheet(): void {
    this.houseIncidentsActionService.openVoucherBottomSheet(this.orderDetail()).subscribe({
      next: value => {
        if (!value) {
          return;
        }
        this.orderDetail.set(value);
      }
    });
  }

  deleteVoucher(): void {
    this.houseIncidentsApiService.removeVoucher(this.applicationId).subscribe({
      next: result => {
        if (result.success) {
          this.houseIncidentsApiService.getPolicyUserInfo(this.applicationId).subscribe({
            next: result => {
              this.orderDetail.set(result.result);
            }
          });
        }
      }
    });
  }

  public openConditionTerms(): void {
    this.faqService.open(FaqCategoryTypeEnum.HOUSE_INCIDENTS);
  }

  backClick(): void {
    window.history.back();
  }

}
