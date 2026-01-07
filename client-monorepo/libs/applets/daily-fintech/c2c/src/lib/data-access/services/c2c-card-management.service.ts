import { inject, Injectable } from '@angular/core';
import { SOURCE_CARD_LOAD_STATUS } from '../models/source-card-load-status';
import {
  BankCard,
  BankCardApiService,
  CardConfigResponse,
  CardDetailInterface,
  CardProfile,
  CardType,
  CardZonesEnum,
} from '@client-monorepo/daily-fintech/bank-card';
import { C2cStateService } from './c2c-state.service';
import { catchError, combineLatest, EMPTY, forkJoin, map, mergeMap, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { PayClientApiService, PaymentResultInterface } from '@client-monorepo/payment/purchase';
import { JSEncrypt } from 'jsencrypt';
import { ShaparakService } from './shaparak.service';
import { CardEditBottomSheetComponent } from '../../components/card-edit-bottom-sheet/card-edit-bottom-sheet.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { MessageService, StorageService } from '@client-monorepo/common/utilities';
import { ShaparakTypes } from '../models/shaparak.model';
import { C2cFrequentTransactionService } from './c2c-frequent-transaction.service';
import { IndirectDeletingRecommendationComponent } from '../../components/indirect-deleting-recommendation/indirect-deleting-recommendation.component';
import { CardActionEnum } from '../models/card-action.enum';
import { CardToCardRequest } from '../models/card-to-card-request.interface';
import { C2cEcdhService } from './c2c-ecdh.service';
import { C2cApiService } from './c2c-api.service';
import { convertNonEnglishDigits } from '@digipay/strings';
import { CardPaymentConfig } from '../models/card-payment-config.interface';
import { CardVerificationService } from './card-verification.service';
import { C2cBankService } from './c2c-bank.service';

@Injectable({
  providedIn: 'root',
})
export class C2cCardManagementService {
  private bankCardApiService = inject(BankCardApiService);
  private c2cStateService = inject(C2cStateService);
  private payClientApiService = inject(PayClientApiService);
  private shaparakService = inject(ShaparakService);
  private bottomSheetService = inject(NgxBottomSheetService);
  private messageService = inject(MessageService);
  private c2cFrequentTransactionService = inject(C2cFrequentTransactionService);
  private c2cEcdhService = inject(C2cEcdhService);
  private c2cApiService = inject(C2cApiService);
  private storageService = inject(StorageService);
  private cardVerificationService = inject(CardVerificationService);
  private c2cBankService = inject(C2cBankService);

  /**
   * Loads source cards from API and updates the application state automatically.
   * Fetches cards with type 'source' and applies bank code restrictions.
   * Updates loading status and stored cards in state service.
   *
   * @returns Observable that emits cards data
   */
  public loadSourceCardsList(): Observable<any> {
    this.c2cStateService.sourceCardsHasBeenLoaded.next(false);
    return this.bankCardApiService
      .searchCards(
        { type: 'source', serviceType: 0 }, // request query params
        {
          restrictions: [
            {
              type: 'collection',
              field: 'bankCodes',
              values: this.c2cStateService.allBanksCodes(),
            },
          ],
        },
      )
      .pipe(
        tap((res) => {
          // Handle success - this runs on every successful response
          this.c2cStateService.sourceStoredCards.set(res.cards);
          this.c2cStateService.sourceCardsLoadStatus.set(SOURCE_CARD_LOAD_STATUS.SUCCESS);
          this.c2cStateService.sourceCardsHasBeenLoaded.next(true);
        }),
        catchError((error) => {
          // Handle error - this runs on every error
          this.c2cStateService.sourceCardsLoadStatus.set(SOURCE_CARD_LOAD_STATUS.FAILED);
          this.c2cStateService.sourceCardsHasBeenLoaded.next(false);
          return throwError(() => error);
        }),
      );
  }

  /**
   * Loads destination (target) cards from API with pagination support.
   * Appends new cards to existing destination cards list in state.
   * Updates loading status and pagination information.
   *
   * @param page - Page number for pagination (default: 0)
   * @returns Observable that emits cards data
   */
  public loadDestinationCardsList(page = 0): Observable<any> {
    this.c2cStateService.isLoadingDestinationCards.set(true);
    return this.bankCardApiService
      .searchCards(
        { type: 'target', page, size: 20 }, // request query params
      )
      .pipe(
        tap((res) => {
          // Handle success - this runs on every successful response
          this.c2cStateService.destinationStoredCards.set([...(this.c2cStateService.destinationStoredCards() || []), ...res.cards]);
          this.c2cStateService.destinationStoredCardsHasNext.set(res.hasNext);
          this.c2cStateService.destinationCardCurrentPage.set(page);
          this.c2cStateService.isLoadingDestinationCards.set(false);
        }),
        catchError((error) => {
          // Handle error - this runs on every error
          this.c2cStateService.isLoadingDestinationCards.set(false);
          return throwError(() => error);
        }),
      );
  }

  /**
   * Fetches card profile information with encrypted card number.
   * First retrieves encryption certificate, then encrypts the card number using RSA encryption,
   * and finally fetches the card profile from API using the encrypted PAN.
   *
   * @param cardNumber - Plain text card number to be encrypted
   * @returns Observable that emits CardProfile with decrypted PAN
   */
  public fetchCardProfileWithEncryption(cardNumber: string): Observable<CardProfile> {
    return this.payClientApiService.getCertFile(this.c2cStateService.profileEncryptionCertFile()).pipe(
      switchMap((certText) => {
        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(certText);
        const encryptedPan = encrypt.encrypt(cardNumber) as string;

        return this.fetchCardProfileFromApi(encryptedPan);
      }),
      map((cardProfile) => {
        cardProfile.pan = cardNumber;
        return cardProfile;
      }),
    );
  }

  /**
   * Fetches card profile from API using encrypted PAN.
   * Internal method used by fetchCardProfileWithEncryption.
   *
   * @param encryptedPan - RSA encrypted card number
   * @returns Observable that emits CardProfile
   */
  private fetchCardProfileFromApi(encryptedPan: string): Observable<CardProfile> {
    return this.bankCardApiService.getCardProfile({
      pan: {
        value: encryptedPan,
        expireDate: undefined,
        type: '1',
      },
      certFile: this.c2cStateService.profileEncryptionCertFile(),
    });
  }

  /**
   * Retrieves C2C cards configuration from API.
   * Updates the vault certificate in state service as a side effect.
   *
   * @returns Observable that emits CardConfigResponse
   */
  public getC2cCardsConfig(): Observable<CardConfigResponse> {
    return this.bankCardApiService.getC2cConfig().pipe(
      tap((data) => {
        // Side effects: update state and emit to subject
        this.c2cStateService.vaultCert.set(data.vaultCert);
      }),
      catchError((error) => {
        this.c2cStateService.sourceCardsLoadStatus.set(SOURCE_CARD_LOAD_STATUS.FAILED);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Executes various card actions based on the provided action type.
   *
   * @param result - Action result containing action type and other data
   * @param card - BankCard object to perform action on
   * @param cardType - Type of card ('source' or 'destination')
   * @returns Observable that emits action result
   */
  public executeCardAction(result: any, card: BankCard, cardType: 'source' | 'destination'): Observable<any> {
    const cardZone = card.cardZones.includes(CardZonesEnum.external) ? CardZonesEnum.external : CardZonesEnum.internal;

    switch (result.action) {
      case CardActionEnum.EDIT:
        return this.handleEditAction(card, cardType, cardZone);
      case CardActionEnum.DELETE:
        return this.handleDeleteAction(card, cardType);
      case CardActionEnum.REGISTER:
        return this.registerByShaparak(card);
      case CardActionEnum.PIN:
        return this.handleTogglePin(card, cardType, true);
      case CardActionEnum.UNPIN:
        return this.handleTogglePin(card, cardType, false);
      default:
        return EMPTY;
    }
  }

  /**
   * Reloads the appropriate cards list based on card type.
   * Helper method to refresh cards data after modifications (= handle card actions).
   *
   * @param cardType - Type of cards to reload ('source' or 'destination')
   * @returns Observable that emits reloaded cards data
   */
  private reloadCardsList(cardType: 'source' | 'destination'): Observable<any> {
    switch (cardType) {
      case 'source':
        return this.loadSourceCardsList();
      case 'destination': {
        this.resetDestinationCards();
        return this.loadDestinationCardsList();
      }
    }
  }

  resetDestinationCards(): void {
    this.c2cStateService.destinationStoredCards.set([]);
    this.c2cStateService.destinationStoredCardsHasNext.set(false);
  }

  // ------------------------------------ start edit card action -----------------------------------------

  /**
   * Handles card edit action workflow.
   * Opens edit dialog, processes the changes, reloads cards list, and handles Shaparak if needed.
   *
   * @param card - BankCard to edit
   * @param cardType - Type of card ('source' or 'destination')
   * @param cardZone - Card zone (internal or external)
   * @returns Observable that emits edit operation result
   */
  private handleEditAction(card: BankCard, cardType: 'source' | 'destination', cardZone: CardZonesEnum): Observable<any> {
    return this.editCard(card, cardType, cardZone).pipe(
      switchMap((response) => this.reloadCardsList(cardType).pipe(map(() => response))),
      switchMap((response) => this.handleShaparakIfNeeded(response, card)),
    );
  }

  /**
   * Opens card edit bottom sheet and processes the edit request.
   * Handles expiration date changes and alias updates.
   * Shows success/error messages and manages strict mode for Shaparak integration.
   *
   * @param card - BankCard to edit
   * @param cardType - Type of card ('source' or 'destination')
   * @param cardZone - Card zone enum (default: 0)
   * @returns Observable that emits edit API response
   */
  private editCard(card: BankCard, cardType: 'source' | 'destination', cardZone: CardZonesEnum = 0): Observable<any> {
    this.bottomSheetService.openBottomSheet(
      CardEditBottomSheetComponent,
      {
        card,
        type: cardType,
      },
      { noPadding: true },
    );

    return this.bottomSheetService.onClose.pipe(
      take(1),
      switchMap(() => {
        const result = this.bottomSheetService.outputData();
        const strictMode = result?.expireDate !== card?.expireDate;
        // In case of changing the expiration date, it is necessary to send cardZone to register the change in shaparak
        this.c2cStateService.strictModeEditCard.set(strictMode); // TODO: Check it

        if (!result?.confirmed) {
          return EMPTY; // Complete without emitting if not confirmed
        }

        if (result?.alias?.trim() === card?.alias?.trim() && !strictMode) {
          return EMPTY; // Complete without emitting if no changes
        }

        const request = {
          cardIndex: card.cardIndex,
          alias: result.alias,
          pinned: card.pinned,
          expireDate: result.expireDate,
          callbackUrl: this.shaparakService.shaparakConfig()?.callbackUrl || '',
        };

        return this.bankCardApiService.editCard(request, strictMode ? cardZone : undefined);
      }),
      tap((response) => {
        if (response) this.messageService.showSuccessMessage(response.result.message);
      }),
      catchError((error) => {
        if (error?.error?.result?.message) this.messageService.showErrorOfErrorResponse(error);

        return throwError(() => error);
      }),
    );
  }

  /**
   * Handles Shaparak integration when needed after card edit.
   * If card is external and in strict mode (expiration date changed), initiates Shaparak registration.
   *
   * @param response - Edit card API response
   * @param card - BankCard that was edited
   * @returns Observable that emits final response after Shaparak handling
   */
  private handleShaparakIfNeeded(response: any, card: BankCard): Observable<any> {
    const strictMode = this.c2cStateService.strictModeEditCard();
    if (card.cardZones.includes(CardZonesEnum.external) && strictMode) {
      this.shaparakService.shaparakType.next(ShaparakTypes.EXPIRATION_DATE);

      return this.shaparakService.setShaparakUrl({ url: response.redirectUrl, cardInfo: null }).pipe(
        switchMap(() => this.shaparakService.confirmShaparakRegistration({ ...response.cardInfo, pan: card?.pan })),
        catchError((err) => {
          console.error('Shaparak handling failed:', err);
          return EMPTY;
        }),
      );
    }

    return of(response);
  }

  private registerByShaparak(card: BankCard): Observable<any> {
    return this.shaparakService.confirmShaparakRegistration(card);
  }

  // ------------------------------------ start delete card action -----------------------------------------

  /**
   * Handles card deletion with frequent transaction check.
   * If card has related frequent transactions, shows confirmation dialog.
   * Otherwise, proceeds with direct deletion.
   *
   * @param card - BankCard to delete
   * @param type - Card type ('source' or 'destination')
   * @returns Observable that emits deletion result
   */
  private handleDeleteAction(card: BankCard, type: 'source' | 'destination'): Observable<any> {
    const txn = this.c2cFrequentTransactionService.relatedFrequentTransactions(card.cardIndex);

    if (txn.length > 0) {
      return this.showIndirectDeletingConfirmation(txn).pipe(
        switchMap((confirmed) => (confirmed ? this.deleteCard(card, type, true) : EMPTY)),
      );
    }

    return this.deleteCard(card, type, false);
  }

  /**
   * Shows confirmation dialog for indirect deleting frequent transactions when card has frequent transactions.
   * Displays related frequent transactions and waits for user confirmation.
   *
   * @param recommendations - Array of related frequent transactions
   * @returns Observable that emits boolean confirmation result
   */
  private showIndirectDeletingConfirmation(recommendations: any[]): Observable<boolean> {
    this.bottomSheetService.openBottomSheet(
      IndirectDeletingRecommendationComponent,
      { recommendations },
      { overflow: 'auto', noPadding: true },
    );

    return this.bottomSheetService.onClose.pipe(
      take(1),
      map(() => {
        const result = this.bottomSheetService.outputData();
        return result && result.confirmed;
      }),
    );
  }

  /**
   * Deletes a bank card and handles related operations.
   * Reloads appropriate cards list and frequent transactions if needed.
   * Shows success/error messages.
   *
   * @param card - BankCard to delete
   * @param type - Card type ('source' or 'destination')
   * @param hasFrequentTransaction - Whether card has related frequent transactions
   * @returns Observable that emits deletion API response
   */
  private deleteCard(card: BankCard, type: 'source' | 'destination', hasFrequentTransaction: boolean): Observable<any> {
    // when you delete a stored card, you must delete the repeatedTransactions associated with it
    return this.bankCardApiService.deleteCard(card.cardIndex).pipe(
      tap(() => {
        // Show the API response message
        this.messageService.showSuccessMessage('کارت بانکی حذف شد');
      }),
      switchMap((response) => {
        const reloadOperations$ = [];

        if (type === 'source') {
          reloadOperations$.push(this.loadSourceCardsList());
        } else {
          this.c2cStateService.destinationStoredCards.set([]);
          reloadOperations$.push(this.loadDestinationCardsList());
        }

        if (hasFrequentTransaction) {
          reloadOperations$.push(this.c2cFrequentTransactionService.loadFrequentTransactions());
        }

        return forkJoin(reloadOperations$).pipe(map(() => response));
      }),
      catchError((error) => {
        this.messageService.showErrorOfErrorResponse(error);
        return throwError(() => error);
      }),
    );
  }

  // ------------------------------------ start pin/unpin card action -----------------------------------------

  /**
   * Handles pin/unpin toggle action for cards.
   * Updates card pin status, shows success message, and reloads cards list.
   *
   * @param card - BankCard to toggle pin status
   * @param cardType - Type of card ('source' or 'destination')
   * @param pined - Boolean indicating whether to pin (true) or unpin (false)
   * @returns Observable that emits toggle pin API response
   */
  private handleTogglePin(card: BankCard, cardType: 'source' | 'destination', pined: boolean): Observable<any> {
    return this.bankCardApiService.togglePin(card.alias, card.cardIndex, pined).pipe(
      tap((response) => {
        this.messageService.showSuccessMessage(response.result.message);
      }),
      switchMap((response) =>
        this.reloadCardsList(cardType).pipe(
          map(() => response), // Return original response
        ),
      ),
      catchError((error) => {
        if (error?.error?.result?.message) {
          this.messageService.showErrorOfErrorResponse(error);
        }
        return throwError(() => error);
      }),
    );
  }

  // ------------------------------------ start transfer methods -----------------------------------------

  public prepareTransferRequestDependencies(encryptor: JSEncrypt, data: CardDetailInterface): CardToCardRequest {
    const encryptedCardCredentials = this.encryptCardCredentials(encryptor, data);
    const { destinationValue, destinationType } = this.prepareDestinationData(encryptor);
    return this.buildTransferRequestBaseBody(data, encryptedCardCredentials, destinationValue, destinationType);
  }
  private buildTransferRequestBaseBody(
    data: CardDetailInterface,
    encryptedPin: string,
    destCardNumber: string,
    destType: CardType,
  ): CardToCardRequest {
    const sourceCard = this.c2cStateService.unifiedSourceCardData();
    const destCard = this.c2cStateService.unifiedDestinationCardData();
    const sourceBank = this.c2cStateService.sourceBank();

    return {
      amount: Number(this.c2cStateService.amount()),
      bankCode: sourceBank?.code || '',
      certFile: sourceBank?.xferCert || '',
      message: data?.message || '',
      destFullName: destCard?.cardOwner || '',
      saveDestination: false,
      saveSource: false,
      saveRecommendation: this.c2cStateService.isSavedAsFrequentTransaction(),
      encryptedPinDto: encryptedPin,
      source: {
        expireDate: data.expirationDate,
        type: Number(CardType.INDEX),
        prefix: sourceCard?.prefix || '',
        postfix: sourceCard?.postfix || '',
        value: sourceCard?.cardIndex || '',
      },
      destination: {
        type: Number(destType),
        prefix: destCard?.prefix || '',
        postfix: destCard?.postfix || '',
        value: destCardNumber,
      },
    };
  }

  private prepareDestinationData(encrypt: JSEncrypt): {
    destinationValue: string;
    destinationType: CardType;
  } {
    const selectedDestCard = this.c2cStateService.selectedDestCard();
    if (selectedDestCard?.cardIndex) {
      return { destinationValue: selectedDestCard.cardIndex, destinationType: CardType.INDEX };
    }
    const destCardPan = this.c2cStateService.destCardProfileData()?.pan || '';
    return {
      destinationValue: encrypt.encrypt(destCardPan) as string,
      destinationType: CardType.ENCRYPTED,
    };
  }

  private encryptCardCredentials(encrypt: JSEncrypt, data: CardDetailInterface): string {
    const cardData = {
      cvv2: convertNonEnglishDigits(data.cvv2),
      pin: convertNonEnglishDigits(data.password),
    };
    return encrypt.encrypt(JSON.stringify(cardData)) as string;
  }

  public sendCardTransferRequest(baseRequest: CardToCardRequest): Observable<PaymentResultInterface> {
    const serverTraceCode = this.c2cStateService.serverTraceCode();
    if (!serverTraceCode) {
      return throwError(() => new Error('Server trace code not found'));
    }

    return this.c2cEcdhService.observeDecodeServerTraceCode(serverTraceCode).pipe(
      map(({ publicKey, randomNumber }) => ({
        publicKey,
        hmacInput: this.buildHmacInput(baseRequest, randomNumber),
      })),
      mergeMap(({ publicKey, hmacInput }) =>
        this.c2cEcdhService.observeFingerPrint(publicKey, hmacInput, baseRequest.source.expireDate, baseRequest.encryptedPinDto),
      ),
      mergeMap((fingerprint) => this.c2cApiService.cardToCardTransfer({ ...baseRequest, fingerprint })),
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }

  private buildHmacInput(req: CardToCardRequest, random: string): string {
    return [
      req.destination.prefix,
      req.destination.postfix,
      req.amount,
      random,
      req.source.prefix,
      req.source.postfix,
      this.storageService.getUserId(),
    ].join('');
  }

  // ------------------------------------ start amount config methods -----------------------------------------

  public buildPaymentConfig(): Observable<CardPaymentConfig> {
    const needVaultCert = !this.c2cStateService.selectedSourceCard();

    const bankCert$ = this.c2cBankService.getBankCert(); // TODO: check is it still needed? used to use in targetPan
    const vaultCert$ = needVaultCert ? this.cardVerificationService.getVaultCertFile() : of(null);
    const trace$ = this.c2cEcdhService.observeGenerateClientTraceCode();

    return combineLatest([bankCert$, vaultCert$, trace$]).pipe(
      map(([bankCert, vaultCert, trace]) => {
        const bankCode = this.c2cStateService.sourceBank()?.code || '';
        const pan = this.buildSourceForPaymentConfig(vaultCert);

        return { trace, bankCode, pan };
      }),
    );
  }

  buildSourceForPaymentConfig(vaultCert: string | null) {
    const sourceCardData = this.c2cStateService.unifiedSourceCardData();
    const sourceType = this.c2cStateService.selectedSourceCard() ? CardType.INDEX : CardType.ENCRYPTED;
    let sourceValue = '';
    if (sourceType === CardType.INDEX) {
      sourceValue = this.c2cStateService.selectedSourceCard()?.cardIndex || '';
    } else {
      const encryption = new JSEncrypt();
      encryption.setPublicKey(vaultCert!);
      sourceValue = encryption.encrypt(sourceCardData?.pan || '') as string;
    }

    return {
      expireDate: '',
      type: sourceType,
      prefix: sourceCardData?.prefix || '',
      postfix: sourceCardData?.postfix || '',
      value: sourceValue,
    };
  }
}
