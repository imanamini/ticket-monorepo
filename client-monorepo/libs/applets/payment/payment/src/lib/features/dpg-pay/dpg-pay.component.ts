import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DpgCardService, DpgPayService } from '@client-monorepo/payment/purchase';
import { CommonModule } from '@angular/common';
import { MessageService } from '@client-monorepo/common/utilities';
import { PageLayoutComponent, UiDynamicPassFieldComponent } from '@client-monorepo/common/ui-components';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
import moment from 'jalali-moment';
import { NgxButtonComponent } from '@digipay/ngx-button';

const DEFAULT_OTP_COUNTDOWN = 120;

@Component({
  selector: 'payment-applet-dpg-pay',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    NgxSkeletonLoadingComponent,
    PipesModule,
    DpIconComponent,
    UiDynamicPassFieldComponent,
    UiFormFieldBuilderModule,
    ReactiveFormsModule,
    NgxButtonComponent,
  ],
  templateUrl: './dpg-pay.component.html',
  styleUrls: ['./dpg-pay.component.scss'],
})
export class DpgPayComponent implements OnInit {
  ticket = '';
  loading!: boolean;
  form!: FormGroup;
  gettingProfileCard!: boolean;
  // dynamic password
  gettingDynamicPassword!: boolean;
  enableSendDynamicPasswordButton!: boolean;
  countdownDynamicPasswordSeconds!: number | null;

  bankName!: string | null;
  bankLogo!: string | null;
  displayingDatePicker = false;
  amount!: number;
  paying!: boolean;
  autoFocusCvv2!: boolean;
  autofocusDate!: boolean;
  autoFocusPassword!: boolean;
  validationRules = {
    cardNumber: [Validators.required, Validators.minLength(16), Validators.maxLength(19)],
    password: [Validators.required, Validators.minLength(5), Validators.maxLength(12)],
    cvv2: [Validators.required, Validators.minLength(3), Validators.maxLength(4)],
    expirationDate: [Validators.required],
  };
  transactionType!: number;

  constructor(
    private dpgPayService: DpgPayService,
    private formBuilder: FormBuilder,
    private dpgCardService: DpgCardService,
    private messageService: MessageService,
    private bottomNavigationService: NgxBottomNavigationService,
  ) {}

  ngOnInit() {
    this.bottomNavigationService.hide();
    this.getInfo();
    this.buildForm();
  }

  getInfo() {
    if (!this.dpgPayService.ticket) {
      window.history.back();
      return;
    }
    this.ticket = this.dpgPayService.ticket;
    this.amount = this.dpgPayService.amount;
    this.transactionType = this.dpgPayService.transactionType;
  }

  buildForm() {
    this.form = this.formBuilder.group({
      cardNumber: ['', this.validationRules.cardNumber],
      cvv2: ['', this.validationRules.cvv2],
      expirationDate: [null, this.validationRules.expirationDate],
      password: ['', this.validationRules.password],
    });
    this.form.controls['cardNumber'].valueChanges.subscribe((value) => {
      this.dpgCardService.getBankOfCardNumber(value).then((bank) => {
        this.bankLogo = bank && bank.imageId;
        this.bankName = bank && bank.name;
      });
    });
  }

  pay() {
    this.paying = true;
    const formData = { ...this.form.value };
    formData.expirationDate = moment(formData.expirationDate).format('jYYYY/jMM');

    this.dpgPayService.finalizePay(formData).subscribe(
      () => {
        this.paying = false;
      },
      () => {
        this.paying = false;
      },
    );
  }

  sendDynamicPass() {
    this.gettingDynamicPassword = true;
    const expirationDate = moment(this.form.value.expirationDate).format('jYYYY/jMM');
    this.dpgPayService
      .sendDynamicPass(this.form.value.cardNumber, expirationDate)
      .then(() => {
        this.enableSendDynamicPasswordButton = false;
        this.countdownDynamicPasswordSeconds = DEFAULT_OTP_COUNTDOWN;
        this.gettingDynamicPassword = false;
      })
      .catch((e) => {
        this.messageService.showErrorOfErrorResponse(e, 'ارتباط برقرار نشد، لطفا تا لحظاتی دیگر مجددا تلاش کنید');
        this.enableSendDynamicPasswordButton = true;
        this.countdownDynamicPasswordSeconds = null;
        this.gettingDynamicPassword = false;
      });
  }

  dynamicPassCountdownFinished() {
    this.enableSendDynamicPasswordButton = true;
    this.countdownDynamicPasswordSeconds = null;
  }
}
