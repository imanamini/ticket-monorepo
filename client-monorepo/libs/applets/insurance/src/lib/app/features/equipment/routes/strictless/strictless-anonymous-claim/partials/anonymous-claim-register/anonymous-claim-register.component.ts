import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  StyledSwitchOption,
  UiAnimatedSwitchComponent
} from '../../../../../../../components/ui-animated-switch/ui-animated-switch.component';
import { PolicyApiService } from '../../../../../../../data-access/services/policy/policy-api.service';
import { OnlyEnFaArNumbersPattern } from '../../../../../../../util/patterns';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { NgIf } from '@angular/common';
import { CardComponent } from '../../../../../../../components/card/card.component';
import { UiButtonComponent } from '../../../../../../../components/ui-button/ui-button/ui-button.component';
import { PolicyTransferModel } from '../../../../../api/models/policy/policy-transfer.model';
import { INSURANCE_APP_PREFIX } from '../../../../../../../data-access/constants/insurance-app-prefix.constant';

enum anonymousOptions {
  NationalCode,
  SERIAL
}

@Component({
  selector: 'anonymous-claim-register',
  templateUrl: './anonymous-claim-register.component.html',
  styleUrls: ['./anonymous-claim-register.component.scss'],
  imports: [
    UiFormFieldBuilderModule,
    ReactiveFormsModule,
    NgIf,
    CardComponent,
    UiAnimatedSwitchComponent,
    UiButtonComponent
  ],
  standalone: true
})
export class AnonymousClaimRegisterComponent implements OnInit {

  @Output()
  registered = new EventEmitter<PolicyTransferModel>();

  anonymousOptions = anonymousOptions;

  selectedClaimWay = anonymousOptions.NationalCode;

  options: StyledSwitchOption[] = [
    {
      label: 'از طریق کد ملی بیمه‌گزار',
      value: this.anonymousOptions.NationalCode
    },
    {
      label: 'از طریق سریال (IMEI) دستگاه',
      value: this.anonymousOptions.SERIAL
    }
  ];

  form: UntypedFormGroup = new UntypedFormGroup({
    policyDraftNo: new UntypedFormControl('', [
      Validators.required,
      Validators.pattern(/\d{1,20}/),
    ]),
    transferMobileNo: new UntypedFormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]{11}$/)
    ]),
    nationalCode: new UntypedFormControl('', [
      Validators.required,
      Validators.pattern(OnlyEnFaArNumbersPattern),
      Validators.maxLength(10),
      Validators.minLength(10)
    ])
  });

  constructor(
    private policyService: PolicyApiService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
  }

  changeSwitch(): void {
    if (this.selectedClaimWay === anonymousOptions.NationalCode) {
      this.selectedClaimWay = anonymousOptions.SERIAL;
      this.form.removeControl('nationalCode');
      this.form.addControl('serialNo', new UntypedFormControl('', [
        Validators.required
      ]));
      return;
    }
    this.selectedClaimWay = anonymousOptions.NationalCode;
    this.form.removeControl('serialNo');
    this.form.addControl('nationalCode', new UntypedFormControl('', [
      Validators.required,
      Validators.pattern(OnlyEnFaArNumbersPattern),
      Validators.maxLength(10),
      Validators.minLength(10)
    ]));
  }

  close(): void {
    this.router.navigate([`${INSURANCE_APP_PREFIX}/equipment/unbundled/home`]).then();
  }

  submitForm(): void {
    this.registered.emit(this.form.value);
  }
}
