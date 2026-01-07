import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DpgPayService } from '../services/dpg/dpg-pay/dpg-pay.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CardService } from '../services/dpg/card/card.service';
import { MessageService } from '../../core/services/message.service';

const DEFAULT_OTP_COUNTDOWN = 120;

@Component({
  selector: 'app-dpg-pay',
  templateUrl: './dpg-pay.component.html',
  styleUrls: ['./dpg-pay.component.scss']
})
export class DpgPayComponent implements OnInit {

  ticket = null;
  backUrl: string;
  loading: boolean;
  form: UntypedFormGroup;
  gettingProfileCard: boolean;
  // dynamic password
  gettingDynamicPassword: boolean;
  enableSendDynamicPasswordButton: boolean;
  countdownDynamicPasswordSeconds: number;

  bankName: string;
  bankLogo: string;
  displayingDatePicker = false;
  amount: number;
  paying: boolean;
  autoFocusCvv2: boolean;
  autofocusDate: boolean;
  autoFocusPassword: boolean;
  validationRules = {
    cardNumber: [Validators.required, Validators.minLength(19), Validators.maxLength(19)],
    password: [Validators.required, Validators.minLength(5), Validators.maxLength(12)],
    cvv2: [Validators.required, Validators.minLength(3), Validators.maxLength(4)],
    expirationDate: [Validators.required],
  };
  transactionType: number;

  constructor(
    private dpgPayService: DpgPayService,
    private formBuilder: UntypedFormBuilder,
    private cardService: CardService,
    private messageService: MessageService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.getInfo();
    this.buildForm();
  }

  getInfo() {
    this.backUrl = this.dpgPayService.homeUrl;
    if (!this.dpgPayService.ticket) {
      this.back();
      return;
    }
    this.ticket = this.dpgPayService.ticket;
    this.amount = this.dpgPayService.amount;
    this.transactionType = this.dpgPayService.transactionType;
  }

  back() {
    this.router.navigateByUrl(this.backUrl);
  }

  buildForm() {
    this.form = this.formBuilder.group({
      cardNumber: ['', this.validationRules.cardNumber],
      cvv2: ['', this.validationRules.cvv2],
      expirationDate: [null, this.validationRules.expirationDate],
      password: ['', this.validationRules.password]
    });
    this.form.controls.cardNumber.valueChanges.subscribe(value => {
      this.cardService.getBankOfCardNumber(value).then(bank => {
        this.bankLogo = bank && bank.imageId;
        this.bankName = bank && bank.name;
      });
    });
  }

  pay() {
    this.paying = true;
    this.dpgPayService.finalizePay(this.form.value).subscribe(() => {
      this.paying = false;
    }, () => {
      this.paying = false;
    });
  }

  confirmDateSelection(date: { timestamp: number, date: string }) {
    this.form.controls.expirationDate.setValue(date.date);
    this.displayingDatePicker = false;
  }

  expirationDateKeydown($event) {
    $event.preventDefault();
  }

  sendDynamicPass() {
    this.gettingDynamicPassword = true;
    this.dpgPayService.sendDynamicPass(
      this.form.value.cardNumber,
      this.form.value.expirationDate
    ).then(() => {
      this.enableSendDynamicPasswordButton = false;
      this.countdownDynamicPasswordSeconds = DEFAULT_OTP_COUNTDOWN;
      this.gettingDynamicPassword = false;
    }).catch((e) => {
      if (!e || !this.messageService.hasMessage(e)) {
        this.messageService.showErrorMessage('ارتباط برقرار نشد، لطفا تا لحظاتی دیگر مجددا تلاش کنید');
      } else {
        this.messageService.showErrorIfExists(e);
      }
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
