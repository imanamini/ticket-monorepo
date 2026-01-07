import { Component, inject, OnInit } from '@angular/core';
import { PolicyApiService } from '../../../../../data-access/services/policy/policy-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceInfoService, MessageService } from '@client-monorepo/common/utilities';
import { AuthService } from '../../../../auth/service/auth.service';
import {
  AnonymousClaimRegisterComponent
} from './partials/anonymous-claim-register/anonymous-claim-register.component';
import { NgSwitch, NgSwitchCase } from '@angular/common';
import { AnonymousClaimLoginComponent } from './partials/anonymous-claim-login/anonymous-claim-login.component';
import {
  AnonymousClaimTransferPreviewComponent
} from './partials/anonymous-claim-transfer-preview/anonymous-claim-transfer-preview.component';
import { PolicyTransferModel } from '../../../api/models/policy/policy-transfer.model';
import { PolicyTransferResponseModel } from '../../../api/models/policy/policy-transfer-response.model';
import { SharedUserSourceService } from '../../../../../data-access/services/user-services/shared-user-source.service';
import { INSURANCE_APP_PREFIX } from '../../../../../data-access/constants/insurance-app-prefix.constant';
import { InsuranceUrlsEnum } from '../../../../../data-access/enums/insurance-urls.enum';

enum anonymousState {
  login,
  registerAnonymous,
  transferPreview,
}

@Component({
  selector: 'anonymous-claim',
  templateUrl: './anonymous-claim.component.html',
  styleUrls: ['./anonymous-claim.component.scss'],
  imports: [AnonymousClaimRegisterComponent, NgSwitch, NgSwitchCase, AnonymousClaimLoginComponent, AnonymousClaimTransferPreviewComponent],
  standalone: true,
})
export class AnonymousClaimComponent implements OnInit {
  constructor() {
  }

  private policyService = inject(PolicyApiService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);
  private sharedUserSourceService = inject(SharedUserSourceService);
  private activatedRoute = inject(ActivatedRoute);
  private deviceInfoService = inject(DeviceInfoService);

  state: anonymousState = anonymousState.registerAnonymous;

  anonymousState = anonymousState;

  transferData: PolicyTransferResponseModel;

  formData: PolicyTransferModel;

  userId: string;

  ngOnInit(): void {
  }

  next(): void {
    this.state++;
  }

  registerAnonymousClaim(formData: PolicyTransferModel): void {
    this.formData = formData;
    this.resendOtpCode().then();
  }

  transferRequest(): void {
    this.policyService.policyTransfer(this.formData).subscribe(
      (res) => {
        if (res.data.isOwner) {
          this.router.navigate([`${INSURANCE_APP_PREFIX}/${InsuranceUrlsEnum.PolicyList}`, this.formData.policyDraftNo]).then();
        } else {
          this.transferData = res.data;
          this.state = anonymousState.transferPreview;
        }
      },
      (e) => {
        this.messageService.showErrorIfExists(e);
      },
    );
  }

  async resendOtpCode(): Promise<void> {
    const device = await this.deviceInfoService.getDeviceInfo();
    this.sharedUserSourceService.globalCellNumber.next(this.formData.transferMobileNo);
    this.authService
      .getOTP({
        cellNumber: this.formData.transferMobileNo,
        device,
      })
      .subscribe(
        (res) => {
          this.userId = res.userId;
          this.messageService.showInfoMessage('پیامک ارسال شده را در این قسمت وارد کنید');
          this.state = anonymousState.login;
        },
        (e) => {
          this.messageService.showErrorIfExists(e);
        },
      );
  }

  changeActionToRegister(): void {
    this.state = anonymousState.registerAnonymous;
  }
}
