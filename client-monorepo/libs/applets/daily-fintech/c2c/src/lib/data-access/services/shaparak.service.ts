import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import {
  BankCard,
  BankCardApiService,
  CardProfile,
  CardZonesEnum,
  RegisterCardDataInterface,
  RegisterCardResponse,
} from '@client-monorepo/daily-fintech/bank-card';
import { ConfirmShaparakStatus, ShaparakCardInfo, ShaparakConfig, ShaparakTypes } from '../models/shaparak.model';
import { getCardPanPostfix, getCardPanPrefix, MessageService } from '@client-monorepo/common/utilities';
import { JSEncrypt } from 'jsencrypt';
import { CardRegistration } from '../models/card-registration.enum';
import { PaymentUrlService } from '@client-monorepo/payment/purchase';
import { ShaparakConfirmationComponent } from '../../components/shaparak-confirmation/shaparak-confirmation.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { C2cStateService } from './c2c-state.service';
import { CardVerificationService } from './card-verification.service';

@Injectable({
  providedIn: 'root',
})
export class ShaparakService {
  // Injects
  private bottomSheetService = inject(NgxBottomSheetService);
  private c2cStateService = inject(C2cStateService);
  private cardVerificationService = inject(CardVerificationService);

  shaparakConfig = signal<ShaparakConfig | null>(null);

  shaparakType = new BehaviorSubject<ShaparakTypes | null>(null);

  constructor(
    private messageService: MessageService,
    private bankCardApiService: BankCardApiService,
    private paymentUrlService: PaymentUrlService,
  ) {}

  // Extract encryption logic to a private method
  private createEncryptedCardData(
    cardNumber: string,
    cardOwner: string,
    targetSide: boolean,
    certText: string,
    expireDate?: string,
  ): RegisterCardDataInterface {
    this.setCallbackUrlFromShaparak();

    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(certText);

    return {
      prefix: getCardPanPrefix(cardNumber),
      postfix: getCardPanPostfix(cardNumber),
      cardOwner,
      encryptedPan: encrypt.encrypt(cardNumber) as string,
      targetSide,
      callbackUrl: this.shaparakConfig()?.callbackUrl,
      expireDate,
    };
  }

  // Extract success handling
  private handleSuccessfulRegistration(response: RegisterCardResponse, targetSide: boolean): void {
    if (targetSide) return;

    const updates: Partial<CardProfile> = {};

    if (response.cardInfo.cardIndex) {
      updates.cardIndex = response.cardInfo.cardIndex;
    }

    if (response.cardInfo.expireDate) {
      updates.expirationDate = response.cardInfo.expireDate;
    }

    if (Object.keys(updates).length > 0) {
      this.c2cStateService.sourceCardProfileData.update((profile) => (profile ? { ...profile, ...updates } : profile));
    }
  }

  // Extract error handling
  private handleRegistrationError(error: any): Observable<never> {
    this.messageService.showErrorOfErrorResponse(error, 'بروز خطا! لطفا مجددا تلاش کنید');
    return throwError(() => error);
  }

  private registerCardInShaparak(pan: string, cardZone: CardZonesEnum, cardHolder: string): Observable<string> {
    return this.registerNewCard(pan, cardZone, false, cardHolder).pipe(
      map((result) => {
        if (result.redirectUrl) {
          return result.redirectUrl;
        }
        throw new Error('No redirect URL received');
      }),
      catchError((error) => {
        this.messageService.showErrorOfErrorResponse(error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * register new card for source or destination card
   */
  registerNewCard(
    cardNumber: string,
    cardZone: number,
    targetSide: boolean,
    cardOwner: string,
    expireDate?: string,
  ): Observable<RegisterCardResponse> {
    return this.cardVerificationService.getVaultCertFile().pipe(
      map((certText) => this.createEncryptedCardData(cardNumber, cardOwner, targetSide, certText, expireDate)),
      switchMap((body) => this.bankCardApiService.registerNewCard(body, cardZone)),
      tap((response) => this.handleSuccessfulRegistration(response, targetSide)),
      catchError((error) => this.handleRegistrationError(error)),
    );
  }

  setCallbackUrlFromShaparak(callbackUrl = '') {
    const baseCallbackUrl = 'service/c2c/shaparak/';
    const config: ShaparakConfig = { ...this.shaparakConfig() } as ShaparakConfig;
    if (callbackUrl) {
      config.callbackUrl = this.paymentUrlService.appCallbackUrl(`${baseCallbackUrl}${callbackUrl}`, true);
    } else {
      config.callbackUrl = this.paymentUrlService.appCallbackUrl(`${baseCallbackUrl}register/0`, true);
    }
    this.shaparakConfig.set(config);
  }

  setShaparakUrl({ cardInfo, url = '' }: { cardInfo: ShaparakCardInfo | null; url: string }): Observable<void> {
    // Early return if URL already exists
    if (this.shaparakConfig()?.redirectUrl) {
      return of(void 0);
    }

    const config: ShaparakConfig = { ...this.shaparakConfig() } as ShaparakConfig;
    const shaparakType = this.shaparakType.getValue();

    // Handle EXPIRATION_DATE case - just set the URL directly
    if (shaparakType === ShaparakTypes.EXPIRATION_DATE) {
      return this.setConfigWithUrl(config, url);
    }

    // Handle REGISTER and default cases - get URL from registration
    return this.getUrlFromRegistration(cardInfo, config);
  }

  // Helper method for expiration date case
  private setConfigWithUrl(config: ShaparakConfig, url: string): Observable<void> {
    config.redirectUrl = url;
    return of(void 0).pipe(tap(() => this.shaparakConfig.set(config)));
  }

  // Helper method for registration cases
  private getUrlFromRegistration(cardInfo: ShaparakCardInfo | null, config: ShaparakConfig): Observable<void> {
    const pan = cardInfo?.pan || '';
    const cardHolder = cardInfo?.cardHolder || '';

    return this.registerCardInShaparak(pan, CardZonesEnum.external, cardHolder).pipe(
      tap((redirectUrl) => {
        config.redirectUrl = redirectUrl;
        this.shaparakConfig.set(config);
      }),
      map(() => void 0),
    );
  }

  setShaparakConfig(card: ShaparakCardInfo) {
    const config: ShaparakConfig = { ...this.shaparakConfig() } as ShaparakConfig;
    switch (this.shaparakType.getValue()) {
      case ShaparakTypes.EXPIRATION_DATE:
        config.forcible = card.cardZones?.includes(CardZonesEnum.external) as boolean;
        config.description = 'برای انتقال وجه تغییر تاریخ انقضا باید در سامانه شاپرک ثبت شود.';
        break;
      case ShaparakTypes.REGISTER:
        config.forcible = card.cardExternalRegistrationMode === CardRegistration.FORCE;
        config.description =
          'برای انجام انتقال وجه از مبدا بانک‌های تحت پوشش شاپرک باید کارت خود را جهت احراز هویت در سیستم شاپرک وارد کنید.';
        break;
      default:
        config.forcible = card.cardExternalRegistrationMode === CardRegistration.FORCE;
        config.description =
          'برای انجام انتقال وجه از مبدا بانک‌های تحت پوشش شاپرک باید کارت خود را جهت احراز هویت در سیستم شاپرک وارد کنید.';
        break;
    }
    this.shaparakConfig.set(config);
  }

  resetShaparkConfig() {
    this.shaparakConfig.set(null);
    this.shaparakType.next(null);
  }

  /**
   * Shows Shaparak confirmation dialog and returns user's decision
   * @param card - Bank card information to display in confirmation dialog
   * @returns Observable that emits the card and status:
   *   - 'cancelled': User closed dialog without action
   *   - 'ignored': User chose to ignore Shaparak (when optional)
   *   - 'failed': Dialog completed but conditions not met
   */
  public confirmShaparakRegistration(card: BankCard): Observable<{ card: BankCard; status: any }> {
    const cardInfo: ShaparakCardInfo = {
      bankName: card.bankName,
      bankLogo: card.bankLogoImageId,
      pan: card.pan,
      cardHolder: card.cardOwner,
      cardExternalRegistrationMode: card.externalRegistrationMode,
      cardZones: card.cardZones,
    };

    this.bottomSheetService.openBottomSheet(
      ShaparakConfirmationComponent,
      { cardInfo },
      {
        noPadding: true,
      },
    );

    return this.bottomSheetService.onClose.pipe(
      map(() => {
        const result = this.bottomSheetService.outputData();

        if (!result) {
          return { card, status: ConfirmShaparakStatus.CANCELLED };
        }

        if (result && result.ignoreShaparak && CardRegistration.OPTIONAL) {
          return { card, status: ConfirmShaparakStatus.IGNORED };
        }

        return { card, status: ConfirmShaparakStatus.FAILED };
      }),
      take(1), // Automatically unsubscribes after first emission
    );
  }
}
