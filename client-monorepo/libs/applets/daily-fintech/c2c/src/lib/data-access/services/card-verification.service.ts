import { inject, Injectable } from '@angular/core';
import { BankCardApiService, CardType } from '@client-monorepo/daily-fintech/bank-card';
import { PayClientApiService } from '@client-monorepo/payment/purchase';
import { Observable, switchMap, catchError, throwError, map } from 'rxjs';
import { JSEncrypt } from 'jsencrypt';
import { CardVerifyRequest } from '../models/card-verify-request';
import { C2cApiService } from './c2c-api.service';
import { C2cStateService } from './c2c-state.service';
import { CardDefinition } from '../models/card-definition.interface';
import { convertStoredCardToCardProfile } from '@client-monorepo/common/utilities';
import { CardCheckResponse } from '../models/card-check-response.interface';

@Injectable({
  providedIn: 'root',
})
export class CardVerificationService {
  private readonly payClientApiService = inject(PayClientApiService);
  private readonly c2cStateService = inject(C2cStateService);
  private readonly bankCardApiService = inject(BankCardApiService);
  private readonly c2cApiService = inject(C2cApiService);

  /**
   * Gets the vault certificate file
   */
  getVaultCertFile(): Observable<string> {
    return this.payClientApiService.getCertFile(this.c2cStateService.vaultCert());
  }

  /**
   * Verifies the card by fetching the certificate, building the request, and calling the verify API.
   * @param cardCheckResponse - The response from the card check API.
   * @returns Observable<any> - The result of the verification API call.
   */
  verifyCard(cardCheckResponse: CardCheckResponse): Observable<any> {
    return this.getCertificate(cardCheckResponse.cert).pipe(
      map((certText) => this.buildVerifyRequest(certText)), // Simple sync map
      switchMap((request) => this.callVerifyApi(request)), // Keep switchMap here if callVerifyApi could be cancellable
      catchError((error) => {
        console.error('Card verification failed:', error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Gets the certificate file for encrypting the PAN
   */
  private getCertificate(certUrl: string): Observable<string> {
    return this.bankCardApiService.getCertFileByUrl(certUrl).pipe(
      catchError((error) => {
        console.error('Failed to get certificate:', error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Builds the verification request object using state data and certificate text.
   * @param certText - The text of the fetched certificate.
   * @returns CardVerifyRequest - The constructed verification request.
   */
  private buildVerifyRequest(certText: string): CardVerifyRequest {
    const unifiedSourceCardData = this.c2cStateService.unifiedSourceCardData();
    const unifiedDestinationCardData = this.c2cStateService.unifiedDestinationCardData();
    const sourceStoredCard = this.c2cStateService.selectedSourceCard();
    const sourceCardProfile = this.c2cStateService.sourceCardProfileData();
    const destStoredCard = this.c2cStateService.selectedDestCard();
    const destCardProfile = this.c2cStateService.destCardProfileData();
    const amount = Number(this.c2cStateService.amount());

    const srcCard: CardDefinition = {
      prefix: unifiedSourceCardData?.prefix || '',
      postfix: unifiedSourceCardData?.postfix || '',
      cardIndex: unifiedSourceCardData?.cardIndex,
      cardProfile: sourceStoredCard ? convertStoredCardToCardProfile(sourceStoredCard) : (sourceCardProfile ?? undefined),
      pan: unifiedSourceCardData?.pan || '',
    };

    const destCard: CardDefinition = {
      prefix: unifiedDestinationCardData?.prefix || '',
      postfix: unifiedDestinationCardData?.postfix || '',
      cardIndex: unifiedDestinationCardData?.cardIndex,
      cardProfile: destStoredCard ? convertStoredCardToCardProfile(destStoredCard) : (destCardProfile ?? undefined),
      pan: unifiedDestinationCardData?.pan || '',
    };

    const srcPanValue = this.processPanValue(srcCard, certText);
    const destPanValue = this.processPanValue(destCard, certText);

    const request: CardVerifyRequest = {
      pan: {
        postfix: srcCard.postfix || '',
        prefix: srcCard.prefix || '',
        type: srcCard.cardIndex ? CardType.INDEX : CardType.ENCRYPTED,
        value: srcPanValue,
      },
      targetPan: {
        postfix: destCard.postfix || '',
        prefix: destCard.prefix || '',
        type: destCard.cardIndex ? CardType.INDEX : CardType.ENCRYPTED,
        value: destPanValue,
      },
    };

    if (amount) {
      request.amount = amount;
    }

    return request; // Synchronous return
  }

  /**
   * Processes PAN value - either uses card index or encrypts the PAN
   */
  private processPanValue(card: any, certText: string): string {
    if (card.cardIndex) {
      return card.cardIndex;
    }

    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(certText);
    const cleanPan = card.pan?.replace(/-/gi, '') || '';
    const encryptedPan = encrypt.encrypt(cleanPan);

    if (!encryptedPan) {
      throw new Error('Failed to encrypt PAN');
    }

    return encryptedPan;
  }

  /**
   * Calls the verification API
   */
  private callVerifyApi(requestParams: CardVerifyRequest): Observable<any> {
    return this.c2cApiService.verifyCardApi(requestParams).pipe(
      catchError((error) => {
        console.error('Verify API call failed:', error);
        return throwError(() => error);
      }),
    );
  }
}
