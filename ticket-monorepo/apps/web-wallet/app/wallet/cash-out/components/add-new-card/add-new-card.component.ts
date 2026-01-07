import { Component, inject, OnInit } from '@angular/core';
import { CardService } from '../../services/card.service';
import {ActivatedRoute, Router} from '@angular/router';
import { BankService } from '../../services/bank.service';
import { getCardInfoEnteredByUser, getTransferKey, saveCardInfoEnteredByUser, } from '../../utiles/storage';
import { publicKeyEncryption } from '../../utiles/public-key-encryption';
import { ScreenType } from '../../models/screen.type';
import { ScreenService } from '../../services/screen.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import {
  ConfirmationOfWithdrawalInformationComponent
} from '../confirmation-of-withdrawal-information/confirmation-of-withdrawal-information.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CASH_OUT_BOTTOM_SHEET_CONFIG } from '../../consts/cash-out-bottom-sheet.const';
import { PATH } from '../../consts/cash-out-paths.const';
import { throwError } from 'rxjs';
import { Card } from './card';
import { switchMap } from 'rxjs/operators';
import { CardInfoEnteredByUserInterface } from '../../models/card-info-entered-by-user.interface';
import {CashOutService} from "../../services/cash-out.service";
import {CardNumberPipe} from "@digipay/ng-lib-pipes";
import {BanksModel} from "../../models/banks.model";
import {MessageService} from "../../../../core/services/message.service";
import {CardProfile} from "../../models/card-profile-response.model";
import {PanTypeEnum} from "../../models/pan-type.enum";
import {GetProfileBodyInterface} from "../../models/get-profile-body.interface";

@Component({
  selector: 'add-new-card',
  templateUrl: './add-new-card.component.html',
  styleUrls: ['./add-new-card.component.scss'],
  providers: [CardNumberPipe]
})
export class AddNewCardComponent extends Card implements OnInit {
  private cardService = inject(CardService);
  private cashOutService = inject(CashOutService);
  private bankService = inject(BankService);
  private screenService = inject(ScreenService);
  private router = inject(Router);
  private bottomSheet = inject(MatBottomSheet);
  private cardNumberPipe = inject(CardNumberPipe);

  public banks: BanksModel[] = [];
  public errorGetConfig: string = '';
  public loadingSubmitApi = false;
  public title: string = 'افزودن کارت جدید';
  public showDatePickerInMobile: boolean = false;
  public screenMode: ScreenType;
  public loadingProfileApi: boolean = false;
  public messageService = inject(MessageService);
  public cardProfile: CardProfile;
  public invalidCard: boolean = false;
  private activatedRoute = inject(ActivatedRoute);

  public form: FormGroup = new FormGroup({
    cardNumber: new FormControl('', Validators.required),
    expireDate: new FormControl(null, Validators.required),
    cardHolder: new FormControl(null),
    bank: new FormControl(null),
    value: new FormControl(''),
    type: new FormControl(PanTypeEnum.ENCRYPTED),
    registerCertificatePublicKey: new FormControl(''),
    publicKey: new FormControl(''),
    transferKey: new FormControl(getTransferKey())
  });

  ngOnInit() {
    this.screenMode = this.screenService.detectScreen();
    this.getActiveBanks();
    this.setDefaultFormValue();
  }

  private setDefaultFormValue(): void {
    const defaultValues: CardInfoEnteredByUserInterface = JSON.parse(getCardInfoEnteredByUser()) || null;
    if (defaultValues && defaultValues.type === PanTypeEnum.ENCRYPTED) {
      this.form.patchValue({expireDate: defaultValues.expireDate});
      this.addCardNumber(this.cardNumberPipe.transform(defaultValues.sourceCardNumber));
    }
  }

  private getActiveBanks(): void {
    this.bankService.getActiveBanks()
      .then((result: BanksModel[]) => {
        this.banks = result;
      }).catch(() => {
      this.errorGetConfig = 'عملیات با خطا مواجه شد لطفا بعدا مجددا تلاش کنید.';
    });
  }

  public addCardNumber(value: string) {
    this.form.controls['cardNumber'].patchValue(value);
    this.getSelectedBankDetail();
    this.setCardHolder(value);
  }

  private setCardHolder(cardNumber: string) {
    this.form.controls['cardHolder'].patchValue(null);
    if (cardNumber.length === 16) {
      if (this.invalidCard === true) {
        return;
      }
      this.loadingProfileApi = true;
      this.getUserCardProfile()
        .then((result: CardProfile) => {
          this.form.controls['cardHolder'].patchValue(result.cardHolder);
          this.loadingProfileApi = false;
        }).catch(() => {
        this.loadingProfileApi = false;
      });
    }
  }

  private getSelectedBankDetail() {
    if (this.form.controls['cardNumber'].value.length >= 6) {
      this.form.controls['bank'].patchValue(this.getSelectedCardBank());
    } else if (this.form.controls['cardNumber'].value.length < 6) {
      this.form.controls['bank'].patchValue(null);
    }
  }

  private getSelectedCardBank(): BanksModel {
    if (!this.form.controls['cardNumber'].value) {
      throwError('شماره کارت موجود نمیباشد!');
      return null;
    }
    const prefix: string = this.implementPrefixCard(this.form.controls['cardNumber'].value);
    return this.banks.find((bankItem: BanksModel) => bankItem.cardPrefixes.includes(prefix));
  }

  public onSubmit(): void {
    console.log(this.form.value)
    if (!this.form.controls['bank'].value) {
      this.messageService.showErrorMessage('شماره کارت وارد شده اشتباه است.');
      return;
    }

    if (!this.form.controls['cardNumber'].value || this.form.controls['cardNumber'].value.length !== 16) {
      this.messageService.showErrorMessage('وارد کردن شماره کارت صحیح الزامی است!');
      return;
    }

    this.loadingSubmitApi = true;
    if (this.cardProfile) {
      this.loadingSubmitApi = false;
      this.saveCardProfile();
      this.saveCardInfo();
      this.goToConfirmationComponent();
    } else {
      this.getUserCardProfile()
        .then(() => {
          this.loadingSubmitApi = false;
          this.saveCardProfile();
          this.saveCardInfo();
          this.goToConfirmationComponent();
        })
        .catch(() => {
          this.loadingSubmitApi = false;
        });
    }
  }

  private saveCardProfile() {
    const cardProfile: CardProfile = {...this.cardProfile, ...this.form.value, cardOwner: this.cardProfile.cardHolder};
    this.cardService.saveSelectedCardProfile(cardProfile);
  }

  public getUserCardProfile(): Promise<CardProfile> {
    return new Promise((resolve, reject) => {
      this.cashOutService.getPublicKey(this.form.controls['transferKey'].value)
        .pipe(
          switchMap((publicKey: string) => {
            this.form.controls['publicKey'].patchValue(publicKey);
            const certificate: string = this.form.controls['bank'].value.profileCert;
            return this.cashOutService.getCertFile(certificate);
          }),
          switchMap((registerCertificatePublicKey: string) => {
            this.form.controls['registerCertificatePublicKey'].patchValue(registerCertificatePublicKey);
            const profileBody: GetProfileBodyInterface = this.createGetProfileBody();
            return this.cashOutService.getCardProfileByCardNumber(profileBody);
          }))
        .subscribe((result: CardProfile) => {
          this.cardProfile = result;
          resolve(result);
        }, (error) => {
          this.cardProfile = null;
          this.cardService.saveSelectedCardProfile(null);
          this.messageService.showErrorMessage(error?.error?.result?.message);
          reject();
        });
    });

  }

  private saveCardInfo(): void {
    saveCardInfoEnteredByUser({
      sourceCardNumber: this.form.controls['cardNumber'].value,
      value: publicKeyEncryption(
        this.form.controls['publicKey'].value,
        this.form.controls['cardNumber'].value) as string,
      expireDate: this.form.controls['expireDate'].value,
      postfix: this.implementPostfixCard(this.form.controls['cardNumber'].value),
      prefix: this.implementPrefixCard(this.form.controls['cardNumber'].value),
      type: this.form.controls['type'].value,
    });
  }

  private createGetProfileBody(): GetProfileBodyInterface {
    const key: string = this.form.controls['registerCertificatePublicKey'].value;
    const cardNumber: string = this.form.controls['cardNumber'].value;
    const encryptedRegisterCertificatePublicKey = publicKeyEncryption(key, cardNumber);
    return {
      certFile: this.getSelectedCardBank().profileCert,
      pan: {
        expireDate: this.form.controls['expireDate'].value,
        postfix: this.implementPostfixCard(this.form.controls['cardNumber'].value),
        prefix: this.implementPrefixCard(this.form.controls['cardNumber'].value),
        type: this.form.controls['type'].value,
        value: encryptedRegisterCertificatePublicKey as string
      }
    };
  }

  public goToConfirmationComponent(): void {
    if (this.screenMode === 'MOBILE') {
      this.openConfirmationComponentOnMobile();
      return;
    }
    this.router.navigate(['../'+ PATH.confirmation], { relativeTo: this.activatedRoute });
  }

  private openConfirmationComponentOnMobile(): void {
    this.bottomSheet.open(ConfirmationOfWithdrawalInformationComponent, {
      ...CASH_OUT_BOTTOM_SHEET_CONFIG
    });
  }
}
