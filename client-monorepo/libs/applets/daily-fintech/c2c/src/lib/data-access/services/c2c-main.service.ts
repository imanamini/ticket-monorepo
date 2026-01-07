import { inject, Injectable } from '@angular/core';
import { Bank, BankCard, CardDetailInterface, CardProfile, CardType, RegisterCardResponse } from '@client-monorepo/daily-fintech/bank-card';
import { ShaparakService } from './shaparak.service';
import { C2cCardManagementService } from './c2c-card-management.service';
import { C2cStateService } from './c2c-state.service';
import { MessageService, StorageService } from '@client-monorepo/common/utilities';
import { C2cApiService } from './c2c-api.service';
import { catchError, EMPTY, forkJoin, map, mergeMap, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { C2cBankService } from './c2c-bank.service';
import { C2cStepsEnum, C2cStepsType } from '../models/c2c-steps';
import { ModifiedC2cFrequentTransaction } from '../models/c2c-frequent-transaction-response';
import { C2cFrequentTransactionService } from './c2c-frequent-transaction.service';
import { CardActionsBottomSheetComponent } from '../../components/card-actions-bottom-sheet/card-actions-bottom-sheet.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CardActionEnum } from '../models/card-action.enum';
import { C2C_STEPS } from '../constants/c2c-steps';
import { BackHandlerService } from '@client-monorepo/back-handler';
import { ExpirationDateDialogComponent } from '../../components/expiration-date-dialog/expiration-date-dialog.component';
import { ConfirmShaparakStatus } from '../models/shaparak.model';
import { DisableBankDialogComponent } from '../../components/disable-bank-dialog/disable-bank-dialog.component';
import { C2cCardHelper } from '../../utils/c2c-card';
import { PaymentResultInterface } from '@client-monorepo/payment/purchase';
import { JSEncrypt } from 'jsencrypt';
import { Base64 } from 'js-base64';
import { Router } from '@angular/router';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';
import { CardPaymentConfigResponse } from '../models/card-payment-config-response';
import { CheckCardRequest } from '../models/check-card-request.interface';
import { CardVerificationService } from './card-verification.service';
import { CardVerificationStatus } from '../models/card-verification-status';

@Injectable({
  providedIn: 'root',
})
export class C2cMainService {
  private shaparakService = inject(ShaparakService);
  private c2cCardManagementService = inject(C2cCardManagementService);
  private c2cStateService = inject(C2cStateService);
  private messageService = inject(MessageService);
  private c2cApiService = inject(C2cApiService);
  private c2cBankService = inject(C2cBankService);
  private c2cFrequentTransactionService = inject(C2cFrequentTransactionService);
  private bottomSheetService = inject(NgxBottomSheetService);
  private backHandler = inject(BackHandlerService);
  private storageService = inject(StorageService);
  private router = inject(Router);
  private gtmService = inject(NgxEventTrackerService);
  private cardVerificationService = inject(CardVerificationService);

  /**
   * Main initialization - loads banks then cards
   * Components call this to initialize everything
   */
  public loadC2cEssentialApis(): Observable<any> {
    return forkJoin([
      this.c2cBankService.loadAllBanks().pipe(switchMap(() => this.c2cCardManagementService.loadSourceCardsList())),
      this.c2cCardManagementService.getC2cCardsConfig(),
    ]);
  }

  public loadFrequentTransactionApis(): Observable<any> {
    return forkJoin([
      this.c2cFrequentTransactionService.loadFrequentTransactions(),
      this.c2cFrequentTransactionService.loadC2cFrequentTransactionConfig(),
    ]);
  }

  public initializeC2c(): Observable<any> {
    this.loadFrequentTransactionApis()
      .pipe(catchError(() => EMPTY))
      .subscribe();
    return this.loadC2cEssentialApis();
  }

  public getStoredCardByIndex(cardIndex: string): BankCard {
    return this.c2cStateService.sourceStoredCards().find((item) => item.cardIndex === cardIndex) as BankCard;
  }

  public loadCardProfile(cardNumber: string, bank: any): Observable<CardProfile> {
    return this.c2cCardManagementService.fetchCardProfileWithEncryption(cardNumber).pipe(
      map((result) => {
        result.bankLogo = bank?.imageId;
        return result;
      }),
      catchError((err) => {
        const error = err?.error;
        const inputError = [1041, 5051, 5054, 5058, 5059, 10055, 10075];

        if (error?.result && inputError.includes(error.result.status)) {
          // Return input validation error for component to handle
          return throwError(() => ({ type: 'validation', error }));
        } else {
          // Handle general errors in service
          this.messageService.showErrorOfErrorResponse(err);
          return throwError(() => ({ type: 'general', error }));
        }
      }),
    );
  }

  /**
   * Registers a destination card
   * @param cardProfile - The destination card profile containing pan and cardHolder
   * @returns Observable<RegisterCardResponse>
   * for destination card we always use cardZone = 0 & targetSide = true
   */
  // TODO: call it in saving destination card action, also in saving transfer as a frequent transaction in credential step
  public registerDestinationCard(cardProfile: CardProfile | null): Observable<RegisterCardResponse> {
    if (!cardProfile?.pan || !cardProfile?.cardHolder) {
      const error = new Error('Missing destination card profile data (pan or cardHolder)');
      return throwError(() => error);
    }

    return this.shaparakService.registerNewCard(
      cardProfile.pan,
      0, // cardZone always 0 for destination
      true, // targetSide always true for destination
      cardProfile.cardHolder,
    );
  }

  /**
   * Deletes a frequent transaction and refreshes the transactions list
   * @param frequentTransaction - The frequent transaction to delete
   * @returns Observable that completes when deletion and refresh are finished
   */
  public handleDeleteFrequentTransaction(frequentTransaction: ModifiedC2cFrequentTransaction) {
    return this.c2cApiService.deleteRecommendation(frequentTransaction.id).pipe(
      // Chain the reload operation after successful deletion
      switchMap((response) => {
        if (response.result.message) {
          this.messageService.showSuccessMessage(response.result.message);
          // Reload the frequent transactions list to reflect the deletion
          return this.c2cFrequentTransactionService.loadFrequentTransactions();
        }
        // Return original response if no success message
        return of(response);
      }),
      // Handle any errors during deletion or reload
      catchError((error) => {
        this.messageService.showErrorOfErrorResponse(error);
        return throwError(() => error);
      }),
    );
  }

  public handleEditFrequentTransaction(data: any): Observable<any> {
    return this.c2cApiService.editRecommendation(data).pipe(
      switchMap((response) => {
        if (response.result.message) {
          this.messageService.showSuccessMessage(response.result.message);
          return this.c2cFrequentTransactionService.loadFrequentTransactions();
        }
        return of(response);
      }),
      catchError((error) => {
        this.messageService.showErrorOfErrorResponse(error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Main method that components call - handles the entire flow
   */
  public handleCardActions(
    card: BankCard,
    cardType: 'source' | 'destination',
    editable = false,
    customCallbackPath?: string,
  ): Observable<{ action: CardActionEnum; result: any }> {
    // Set callback URL based on editable flag
    const callbackPath = customCallbackPath || (editable ? 'edit/0' : 'update/0');
    this.shaparakService.setCallbackUrlFromShaparak(callbackPath);

    // Open bottom sheet
    this.bottomSheetService.openBottomSheet(CardActionsBottomSheetComponent, { card, type: cardType, editable }, { noPadding: true });

    return this.bottomSheetService.onClose.pipe(
      take(1),
      switchMap(() => {
        const result = this.bottomSheetService.outputData();

        if (!result) {
          return EMPTY;
        }

        return this.c2cCardManagementService.executeCardAction(result, card, cardType).pipe(
          map((actionResult) => ({
            action: result.action,
            result: actionResult,
          })),
        );
      }),
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }

  /**
   * Shared method to handle card protection/registration flow
   * @param card - The bank card to validate
   * @param cardType - Whether this is a source or destination card
   * @param customCallbackPath - Optional custom callback path for expired cards
   * @param skipRegistrationCheck - Skip registration validation (for frequent transactions)
   */
  public handleCardProtections(
    card: BankCard,
    cardType: 'source' | 'destination' = 'source',
    customCallbackPath?: string,
    skipRegistrationCheck = false,
  ): Observable<{ success: boolean; card: BankCard }> {
    // Check if bank is active
    const bank = this.findBankByPrefix(card.prefix);
    if (!bank?.active) {
      this.bottomSheetService.openBottomSheet(DisableBankDialogComponent, {
        data: bank?.badge?.message || `انتقال وجه از بانک ${bank?.name} موقتا غیرفعال می‌باشد.`,
      });
      return of({ success: false, card });
    }

    // Handle unregistered cards (skip for frequent transactions)
    if (!skipRegistrationCheck && C2cCardHelper.shouldBeRegistered(card)) {
      return this.shaparakService.confirmShaparakRegistration(card).pipe(
        map((result) => ({
          success: result.status === ConfirmShaparakStatus.IGNORED,
          card,
        })),
      );
    }

    // Handle expired cards
    if (card.expired) {
      return this.handleExpiredCardFlow(card, cardType, customCallbackPath);
    }

    // Card is ready to use
    return of({ success: true, card });
  }

  /**
   * Handles expired card flow with user confirmation
   */
  private handleExpiredCardFlow(
    card: BankCard,
    cardType: 'source' | 'destination',
    customCallbackPath?: string,
  ): Observable<{ success: boolean; card: BankCard }> {
    this.bottomSheetService.openBottomSheet(ExpirationDateDialogComponent, {}, { noPadding: true });

    return this.bottomSheetService.onClose.pipe(
      take(1),
      switchMap(() => {
        const result = this.bottomSheetService.outputData();
        if (!result?.confirmed) {
          return of({ success: false, card });
        }
        // open edit card bottom sheet automatically to edit expireDate
        // Set editable parameter to true in handleCardActions call
        return this.handleCardActions(card, cardType, true, customCallbackPath).pipe(
          // in this case action in actionResult always should be 'EDIT'
          map((actionResult) => ({
            success: actionResult.result.status === ConfirmShaparakStatus.IGNORED,
            card,
          })),
        );
      }),
    );
  }

  public loadNextDestinationCardsPage() {
    const cards = this.c2cStateService.destinationStoredCards();
    const hasNextPage = this.c2cStateService.destinationStoredCardsHasNext();

    // If no cards exist, start from the first page
    if (!cards?.length) {
      return this.c2cCardManagementService.loadDestinationCardsList(0);
    }

    // If no more pages available, return empty observable
    if (!hasNextPage) {
      return EMPTY;
    }

    // Load next page
    const nextPage = this.c2cStateService.destinationCardCurrentPage() + 1;
    return this.c2cCardManagementService.loadDestinationCardsList(nextPage);
  }

  public findBankByPrefix(prefix: string): Bank | null {
    const allBanks = this.c2cStateService.allBanks();
    const matchingBank = allBanks.find((bank) => bank.cardPrefixes.includes(prefix));
    return matchingBank || null;
  }

  public goToNextStep() {
    const activeIndex = this.c2cStateService.activeStepIndex();
    if (activeIndex + 1 >= C2C_STEPS.length) {
      return;
    }
    this.c2cStateService.activeStepIndex.update((value) => value + 1);
    this.c2cStateService.stepsHistory.update((history) => [...history, C2C_STEPS[activeIndex]]);
  }

  public goToStep(step: C2cStepsType) {
    const activeIndex = this.c2cStateService.activeStepIndex();
    this.c2cStateService.stepsHistory.update((history) => [...history, C2C_STEPS[activeIndex]]);
    const nextIndex = C2C_STEPS.findIndex((c2cStep) => c2cStep.name === step);
    this.c2cStateService.activeStepIndex.set(nextIndex);
  }

  public goToPrevStep() {
    const history = this.c2cStateService.stepsHistory();
    const activeStepName = this.c2cStateService.activeStepName();
    const shouldGoBackToHub = history.length === 0 || activeStepName === C2cStepsEnum.SOURCE;
    if (shouldGoBackToHub) {
      this.backHandler.setCustomBackUrl('/');
      this.backHandler.goBack();
      return;
    }

    const previousStep = history[history.length - 1]; // Get last step without removing it
    const stepIndex = C2C_STEPS.findIndex((step) => step === previousStep);

    if (stepIndex !== -1) {
      this.c2cStateService.activeStepIndex.set(stepIndex);
      // Remove the last step from history after navigating
      this.c2cStateService.stepsHistory.update((history) => {
        const newHistory = [...history];
        newHistory.pop();
        return newHistory;
      });
    }
  }

  public sendDynamicPass(): Observable<any> {
    const unifiedSourceCardData = this.c2cStateService.unifiedSourceCardData();
    const unifiedDestinationCardData = this.c2cStateService.unifiedDestinationCardData();

    if (!unifiedSourceCardData || !unifiedDestinationCardData) {
      return throwError(() => new Error('Card data is not available'));
    }

    return this.c2cBankService.loadBankConfig(unifiedSourceCardData.bankCode).pipe(
      switchMap((config) =>
        this.c2cBankService.sendRequestForDynamicPassword(
          unifiedSourceCardData as BankCard,
          unifiedDestinationCardData as BankCard,
          config,
        ),
      ),
      catchError((error) => {
        this.messageService.showErrorOfErrorResponse(error, 'ارتباط برقرار نشد، لطفا تا لحظاتی دیگر مجددا تلاش کنید');
        return throwError(() => error);
      }),
    );
  }

  public storeDataForDynamicPassword(countdownSeconds: number) {
    const sourceCard = this.c2cStateService.unifiedSourceCardData();
    const destCard = this.c2cStateService.unifiedDestinationCardData();
    // Dynamic password requirements
    const value = this.c2cStateService.amount();

    const data = {
      srcCardIndex: sourceCard?.cardIndex,
      desCardIndex: destCard?.cardIndex,
      value,
      countdownSeconds,
      startTime: +new Date(),
    };
    this.storageService.setCardHistory(sourceCard?.cardIndex || '', data);
  }

  public cardTransfer(data: CardDetailInterface): Observable<PaymentResultInterface> {
    const certificateFileUrl = this.c2cStateService.sourceBank()?.xferCertFileUrl;
    if (!certificateFileUrl) {
      return throwError(() => new Error('Certificate file URL not found'));
    }

    return this.c2cBankService.getBankCert().pipe(
      map((certificateText) => this.createEncryptor(certificateText)),
      map((encryptor) => this.c2cCardManagementService.prepareTransferRequestDependencies(encryptor, data)),
      mergeMap((transferRequest) => this.c2cCardManagementService.sendCardTransferRequest(transferRequest)),
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }

  private createEncryptor(certText: string): JSEncrypt {
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(certText);
    return encrypt;
  }

  public goToReceiptPage(response: PaymentResultInterface): void {
    this.sendC2cResultEvent(response);
    const responseBase64 = Base64.encode(JSON.stringify(response));
    this.router
      .navigate(['payment', 'result', 'c2c'], {
        queryParams: { data: responseBase64, result: response.paymentResult },
      })
      .then();
  }

  private sendC2cResultEvent(response: PaymentResultInterface): void {
    const eventData = {
      event: 'C2C_' + (response.status === 'پرداخت موفق' ? 'SUCCESS' : 'FAILED'),
      pageName: 'c2c-result',
    };
    this.gtmService.sendEvent(eventData, { platforms: ['gtm'] });
  }

  /**
   * Retrieves the card payment configuration, either from cache or by building a new one.
   * @returns Observable emitting the CardPaymentConfigResponse
   */
  public amountConfig(): Observable<CardPaymentConfigResponse> {
    // Build and Fetch the amount configuration from the API
    return this.c2cCardManagementService.buildPaymentConfig().pipe(switchMap((data) => this.c2cApiService.getAmountConfig(data)));
  }

  // ------------------------------------ start kyc & verify -----------------------------------------

  /**
   * Main flow: Processes KYC and verification for card transfer.
   * Builds the check request, performs the card check, and if needed, proceeds to verification.
   * Errors are propagated for handling in the subscriber (e.g., component).
   */
  public processKycAndVerify(): Observable<any> {
    const cardData = this.c2cStateService.unifiedSourceCardData();
    const request: CheckCardRequest = {
      amount: Number(this.c2cStateService.amount()),
      prefix: cardData?.prefix || '',
      postfix: cardData?.postfix || '',
      cardIndex: cardData?.cardIndex,
      panType: this.c2cStateService.selectedSourceCard() ? CardType.INDEX : CardType.ENCRYPTED,
    };

    return this.c2cApiService.checkCardTransferKyc(request).pipe(
      switchMap((response) => {
        if (response.verificationStatus === CardVerificationStatus.CONFIRMED) {
          return of(response);
        }
        return this.cardVerificationService.verifyCard(response);
      }),
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }
}
