import { Component, inject } from '@angular/core';
import { DeviceInfoService, MessageService } from '@client-monorepo/common/utilities';
import { LayoutService } from '../../../../../data-access/services/layout.service';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { EEIRegisterModel } from '../../../api/models/EEI-register.model';
import { PolicyApiService } from '../../../../../data-access/services/policy/policy-api.service';
import { AuthService } from '../../../../auth/service/auth.service';
import { TransformPolicyConfirmComponent } from './partials/transform-policy-confirm/transform-policy-confirm.component';
import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { InquiryRegisterComponent } from './partials/inquiry-register/inquiry-register.component';
import { InquiryLoginComponent } from './partials/inquiry-login/inquiry-login.component';
import { InquiryPolicyHolderComponent } from './partials/inquiry-policy-holder/inquiry-policy-holder.component';
import { InquiryPolicyPureComponent } from './partials/inquiry-policy-pure/inquiry-policy-pure.component';
import { InquiryLeadHasTimeComponent } from './partials/inquiry-lead-has-time/inquiry-lead-has-time.component';
import { InquiryLeadExtendableComponent } from './partials/inquiry-lead-extendable/inquiry-lead-extendable.component';
import { InquiryLeadTimeLostComponent } from './partials/inquiry-lead-time-lost/inquiry-lead-time-lost.component';
import { InquiryNoPolicyComponent } from './partials/inquiry-no-policy/inquiry-no-policy.component';
import { ElectronicEquipmentRegisterComponent } from '../../../applets/electronic-equipment-register/electronic-equipment-register.component';
import { InquiryResponseModel, PolicyInquiry } from '../../../api/models/policy-inquiry/policy-inquiry.model';
import { SharedUserSourceService } from '../../../../../data-access/services/user-services/shared-user-source.service';
import { UiLoadingSpinnerComponent } from '../../../../../components/ui-loading-spinner/ui-loading-spinner.component';

@Component({
  selector: 'inquiry',
  templateUrl: './inquiry.component.html',
  styleUrls: ['./inquiry.component.scss'],
  imports: [
    NgIf,
    NgSwitch,
    InquiryRegisterComponent,
    NgSwitchDefault,
    InquiryLoginComponent,
    NgSwitchCase,
    InquiryPolicyHolderComponent,
    InquiryPolicyPureComponent,
    InquiryLeadHasTimeComponent,
    InquiryLeadExtendableComponent,
    InquiryLeadTimeLostComponent,
    InquiryNoPolicyComponent,
    ElectronicEquipmentRegisterComponent,
    UiLoadingSpinnerComponent,
  ],
  standalone: true,
})
export class InquiryComponent {
  constructor() {}

  private messageService = inject(MessageService);
  private layout = inject(LayoutService);
  private dialog = inject(MatDialog);
  private sheet = inject(MatBottomSheet);
  private policyService = inject(PolicyApiService);
  private authService = inject(AuthService);
  private sharedUserSourceService = inject(SharedUserSourceService);
  private deviceInfoService = inject(DeviceInfoService);

  isLoading = false;

  formData: { mobileNo: string; serialNo: string };

  userId: string;

  newPerson: EEIRegisterModel;

  inquiryState: PolicyInquiry;

  policyInquiry = PolicyInquiry;

  inquiryResponse: InquiryResponseModel;

  setInquiryState(inquiryResponse: InquiryResponseModel): void {
    this.inquiryResponse = inquiryResponse;

    /* policy owner Inquired */
    if (inquiryResponse.hasPolicy && inquiryResponse.isPolicyOwner) {
      this.inquiryState = this.policyInquiry.policyHolder;

      /* policy is Pure */
    } else if (inquiryResponse.hasPolicy && !inquiryResponse.isPolicyOwner) {
      this.inquiryState = this.policyInquiry.policyPure;

      /* has lead and Time to buy e policy */
    } else if (
      !inquiryResponse.hasPolicy &&
      !inquiryResponse.isPolicyOwner &&
      inquiryResponse.hasPurchase &&
      inquiryResponse.purchases[0].expireDays > 0
    ) {
      this.inquiryState = this.policyInquiry.hasLeadHasTime;

      /* has lead and No Time to buy e policy but he/she can review the policy */
    } else if (
      !inquiryResponse.hasPolicy &&
      !inquiryResponse.isPolicyOwner &&
      inquiryResponse.hasPurchase &&
      inquiryResponse.purchases[0].expireDays === 0 &&
      inquiryResponse.purchases[0].renewAllowed === true
    ) {
      this.inquiryState = this.policyInquiry.hasLeadRenew;

      /* no longer Time to buy and review */
    } else if (
      !inquiryResponse.hasPolicy &&
      !inquiryResponse.isPolicyOwner &&
      inquiryResponse.hasPurchase &&
      inquiryResponse.purchases[0].expireDays === 0 &&
      inquiryResponse.purchases[0].renewAllowed === false
    ) {
      this.inquiryState = this.policyInquiry.HasLeadTimeLost;

      /* didn't got policy */
    } else if (!inquiryResponse.hasPolicy && !inquiryResponse.isPolicyOwner && !inquiryResponse.hasPurchase) {
      this.inquiryState = this.policyInquiry.noPolicy;
    } else {
      this.messageService.showErrorMessage('مشکلی پیش آمده');
    }
  }

  transferPurePolicy(): void {
    if (this.inquiryResponse.hasProfile) {
      this.openConfirmTransfer();
    } else {
      this.inquiryState = PolicyInquiry.registerUser;
    }
  }

  openConfirmTransfer(): void {
    if (this.layout.currentSize === 'LG') {
      const ref = this.dialog.open(TransformPolicyConfirmComponent, {
        data: {
          policy: this.inquiryResponse.policy,
          newPerson: this.newPerson,
        },
      });
    } else {
      const ref = this.sheet.open(TransformPolicyConfirmComponent, {
        data: {
          policy: this.inquiryResponse.policy,
          newPerson: this.newPerson,
        },
      });
    }
  }

  registerSubmitted(value): void {
    this.newPerson = value;
    this.openConfirmTransfer();
  }

  smsSent(res): void {
    this.isLoading = true;
    this.formData = res;
    this.sendLoginSms().then();
  }

  inquiryRequest(): void {
    this.isLoading = true;
    this.policyService.policyInquiry(this.formData).subscribe(
      (res) => {
        this.isLoading = false;
        this.setInquiryState(res.data);
      },
      (error) => {
        this.isLoading = false;
        this.messageService.showErrorIfExists(error);
      },
    );
  }

  async sendLoginSms(): Promise<void> {
    const device = await this.deviceInfoService.getDeviceInfo();
    this.sharedUserSourceService.globalCellNumber.next(this.formData.mobileNo);
    this.authService
      .getOTP({
        cellNumber: this.formData.mobileNo,
        device,
      })
      .subscribe(
        (res) => {
          this.userId = res.userId;
          this.messageService.showInfoMessage('پیامک ارسال شده را در این قسمت وارد کنید');
          this.inquiryState = PolicyInquiry.loginUser;
          this.isLoading = false;
        },
        (e) => {
          this.messageService.showErrorIfExists(e);
          this.isLoading = false;
        },
      );
  }

  backToRegisterInquiry(): void {
    this.inquiryState = null;
  }
}
