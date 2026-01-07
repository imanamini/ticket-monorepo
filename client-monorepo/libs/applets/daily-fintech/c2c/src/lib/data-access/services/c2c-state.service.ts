import { computed, Injectable, signal } from '@angular/core';
import { ModifiedC2cFrequentTransaction } from '../models/c2c-frequent-transaction-response';
import { Bank, BankCard, CardProfile } from '@client-monorepo/daily-fintech/bank-card';
import { ReplaySubject } from 'rxjs';
import { SOURCE_CARD_LOAD_STATUS } from '../models/source-card-load-status';
import { C2cFrequentTransactionConfigResponse } from '../models/c2c-frequent-transaction-config-response';
import { C2C_STEPS } from '../constants/c2c-steps';
import { C2cStepsType } from '../models/c2c-steps';
import { getCardPanPostfix, getCardPanPrefix } from '@client-monorepo/common/utilities';

@Injectable({
  providedIn: 'root',
})
export class C2cStateService {
  /*
|--------------------------------------------------------------------------
| Steps of c2c
|--------------------------------------------------------------------------
| These group of variables are meant for holding the Steps
*/
  activeStepIndex = signal<number>(1);
  activeStepName = computed<C2cStepsType>(() => C2C_STEPS[this.activeStepIndex()]?.name);
  stepsHistory = signal<any[]>([]);
  /*
  |--------------------------------------------------------------------------
  | Banks
  |--------------------------------------------------------------------------
  | These group of variables are meant for holding the Banks
  */
  allBanks = signal<Bank[]>([]);
  allBanksCodes = computed<string[]>(() => this.allBanks().map((bank) => bank.code));
  /*
  |--------------------------------------------------------------------------
  | Source Card
  |--------------------------------------------------------------------------
  | These group of variables are meant for holding the source card
  | details
  */
  sourceStoredCards = signal<BankCard[]>([]);
  sourceCardsHasBeenLoaded: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  sourceCardsLoadStatus = signal<SOURCE_CARD_LOAD_STATUS>(SOURCE_CARD_LOAD_STATUS.LOADING);
  sourceBank = signal<Bank | null>(null);
  strictModeEditCard = signal(false); // In order to determine the necessity of registration in shaparak
  sourceCardProfileData = signal<CardProfile | null>(null);
  selectedSourceCard = signal<BankCard | null>(null);
  /**
   * Returns the active source card data.
   * Uses selectedSourceCard if available, otherwise uses sourceCardProfileData.
   * Follow BankCard interface and add more properties if needed
   */
  unifiedSourceCardData = computed(() => {
    const selectedCard = this.selectedSourceCard();
    const profileCard = this.sourceCardProfileData();

    const sourceCard = selectedCard || profileCard;
    if (!sourceCard) return null;

    // Return a normalized object with consistent property names
    return {
      pan: sourceCard.pan,
      cardOwner: 'cardOwner' in sourceCard ? sourceCard.cardOwner : sourceCard.cardHolder,
      bankName: sourceCard.bankName,
      bankCode: sourceCard.bankCode,
      expireDate: 'expireDate' in sourceCard ? sourceCard.expireDate : sourceCard.expirationDate,
      bankLogoImageId: 'bankLogoImageId' in sourceCard ? sourceCard.bankLogoImageId : sourceCard.bankLogo,
      logoImageId: sourceCard.logoImageId,
      imageId: sourceCard.imageId,
      colorRange: sourceCard.colorRange,
      cardIndex: sourceCard.cardIndex,
      prefix: 'prefix' in sourceCard ? sourceCard.prefix : getCardPanPrefix(sourceCard?.pan),
      postfix: 'postfix' in sourceCard ? sourceCard.postfix : getCardPanPostfix(sourceCard?.pan),
    };
  });

  /*
  |--------------------------------------------------------------------------
  | Destination
  |--------------------------------------------------------------------------
  | These group of variables are meant for holding the destination (target)
  | card details
  */
  /**
   * Certificate file name in order to send to file server API and
   * encrypt card profiles with it.
   */
  profileEncryptionCertFile = signal('');
  destCardProfileData = signal<CardProfile | null>(null); // For new destination cards which needed to register and save in DB
  selectedDestCard = signal<BankCard | null>(null);
  isLoadingDestinationCards = signal(true);
  destinationStoredCards = signal<BankCard[]>([]);
  destinationCardCurrentPage = signal(0);
  enteredDestinationPan = signal<string>('');
  destinationStoredCardsHasNext = signal(false);
  /**
   * Returns the active destination card data.
   * Uses selectedDestCard if available, otherwise uses destCardProfileData.
   * Follow BankCard interface and add more properties if needed
   */
  unifiedDestinationCardData = computed(() => {
    const selectedCard = this.selectedDestCard();
    const profileCard = this.destCardProfileData();

    const sourceCard = selectedCard || profileCard;
    if (!sourceCard) return null;
    // Return a normalized object with consistent property names
    return {
      pan: sourceCard.pan,
      cardOwner: 'cardOwner' in sourceCard ? sourceCard.cardOwner : sourceCard.cardHolder,
      bankName: sourceCard.bankName,
      bankCode: sourceCard.bankCode,
      expireDate: 'expireDate' in sourceCard ? sourceCard.expireDate : sourceCard.expirationDate,
      bankLogoImageId: 'bankLogoImageId' in sourceCard ? sourceCard.bankLogoImageId : sourceCard.imageId,
      logoImageId: sourceCard.logoImageId,
      imageId: sourceCard.imageId,
      colorRange: sourceCard.colorRange,
      cardIndex: sourceCard.cardIndex,
      prefix: 'prefix' in sourceCard ? sourceCard.prefix : getCardPanPrefix(sourceCard?.pan),
      postfix: 'postfix' in sourceCard ? sourceCard.postfix : getCardPanPostfix(sourceCard?.pan),
    };
  });

  /**
   * True when the user selects the "Save" checkbox or activates the frequent transaction option.
   * If true, the destination card will be registered in the DB as a frequent card during the final step;
   */
  shouldRegisterDestinationCard = signal(true);

  /*
  |--------------------------------------------------------------------------
  | Frequent Transactions
  |--------------------------------------------------------------------------
  | These group of variables are meant for  holding the frequent transactions
  */
  c2cFrequentTransactions = signal<ModifiedC2cFrequentTransaction[] | null>(null);
  c2cFrequentTransactionsConfig = signal<C2cFrequentTransactionConfigResponse | null>(null);
  isFromFrequentTransaction = signal(false);
  isSavedAsFrequentTransaction = signal(false);
  /**
   * Holds the certificate itself (text)
   */
  amount = signal<string>('');
  vaultCert = signal('');
  serverTraceCode = signal<string>('');
  isPaymentConfigLoaded = signal<boolean>(false);

  resetC2cState(): void {
    this.c2cFrequentTransactions.set(null);
    this.sourceStoredCards.set([]);
    this.allBanks.set([]);
    this.sourceBank.set(null);
    this.amount.set('');
    this.sourceCardProfileData.set(null);
    this.sourceCardsLoadStatus.set(SOURCE_CARD_LOAD_STATUS.LOADING);
    this.selectedDestCard.set(null);
    this.selectedSourceCard.set(null);
    this.destCardProfileData.set(null);
    this.destinationCardCurrentPage.set(0);
    this.isFromFrequentTransaction.set(false);
    this.isSavedAsFrequentTransaction.set(false);
    this.c2cFrequentTransactionsConfig.set(null);
    this.activeStepIndex.set(1);
    this.stepsHistory.set([]);
    this.strictModeEditCard.set(false);
    this.shouldRegisterDestinationCard.set(true);
    this.profileEncryptionCertFile.set('');
    this.isLoadingDestinationCards.set(true);
    this.destinationStoredCards.set([]);
    this.destinationStoredCardsHasNext.set(false);
    this.enteredDestinationPan.set('');
    this.vaultCert.set('');
    this.serverTraceCode.set('');
    this.isPaymentConfigLoaded.set(false);
  }
}
