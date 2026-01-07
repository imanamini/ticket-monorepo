import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GeneratorService } from './services/generator.service';
import { TransferPolicyService } from './services/transfer-policy.service';
import { PolicyApiService } from '../../../../../data-access/services/policy/policy-api.service';
import { NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { UiLoadingSpinnerComponent } from '../../../../../components/ui-loading-spinner/ui-loading-spinner.component';
import { UiButtonComponent } from '../../../../../components/ui-button/ui-button/ui-button.component';
import {
  ElectronicEquipmentRegisterComponent
} from '../../../applets/electronic-equipment-register/electronic-equipment-register.component';
import { TransferPolicyShortenModel } from '../../../api/models/policy/policy-transfer-response.model';
import { UserAuthService } from '../../../../../data-access/services/user-services/user-auth.service';
import { INSURANCE_APP_PREFIX } from '../../../../../data-access/constants/insurance-app-prefix.constant';

@Component({
  selector: 'app-transfer-policy',
  templateUrl: './transfer-policy.component.html',
  standalone: true,
  imports: [
    NgSwitch,
    NgSwitchCase,
    NgIf,
    UiLoadingSpinnerComponent,
    UiButtonComponent,
    ElectronicEquipmentRegisterComponent
  ],
  styleUrls: ['./transfer-policy.component.scss']
})
export class TransferPolicyComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private generatorService = inject(GeneratorService);
  private policyApiService = inject(PolicyApiService);
  private transferPolicyService = inject(TransferPolicyService);
  private authService = inject(UserAuthService);

  transferCode: string;
  errorMessage: string;
  currentStep = 0;
  transferredPolicyInfo: TransferPolicyShortenModel;

  constructor() {
  }

  ngOnInit(): void {
    this.authService.purgeAuth(false); // "transfer-request" in this case shouldn't contain token in request header
    this.route.queryParams.subscribe(({code}) => {
      this.transferCode = code;
      this.checkTransferCode();
    });
  }

  checkTransferCode(): void {
    this.policyApiService.policyTransferDetail(this.transferCode).subscribe(res => {
      this.generatorService.setHasProfileState(res?.data.hasProfile);
      this.transferredPolicyInfo = res?.data?.policy;
      this.transferPolicyService.setTransferredPolicyInfo(res?.data.policy); // to show info in dialog at the last step
      this.currentStep = this.generatorService.goToNextStep().value;
    }, err => {
      this.errorMessage = err?.error?.result?.message || 'خطایی رخ داده‌است';
    });
  }

  registerSubmitted(event): void {
    this.transferPolicyService.transferByCodeApi(event);
  }

  goToHomePage(): void {
    window.location.replace('https://app.mydigipay.com/' + INSURANCE_APP_PREFIX);
  }

}
