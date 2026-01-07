import { Injectable } from '@angular/core';
import { Bank, BankCardApiService, CardPanDto, CardPin, CardType, DynamicPasswordRequest } from '@client-monorepo/daily-fintech/bank-card';
import { getCardPanPostfix, getCardPanPrefix, MessageService, removePanDashes } from '@client-monorepo/common/utilities';
import { JSEncrypt } from 'jsencrypt';

@Injectable({
  providedIn: 'root',
})
export class DpgCardService {
  private banks: Bank[] = [];

  constructor(
    private bankCardApiService: BankCardApiService,
    private messageService: MessageService,
  ) {
    this.getAllBanks().then();
  }

  getAllBanks(): Promise<Bank[]> {
    return new Promise((resolve, reject) => {
      if (this.banks) {
        return resolve(this.banks);
      }
      this.bankCardApiService.getAllBanks().subscribe(
        (response) => {
          this.banks = response.banks;
          resolve(response.banks);
        },
        (error) => {
          reject(error);
        },
      );
    });
  }

  async getBankOfCardNumber(pan: string): Promise<Bank | null> {
    const prefix = getCardPanPrefix(removePanDashes(pan));
    const banks = await this.getAllBanks();
    return banks.find((b) => b.cardPrefixes.indexOf(prefix) >= 0) || null;
  }

  encryptCvv2AndPass(certText: string, cvv2: string, password: string): string {
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(certText);
    const dto: CardPin = {
      cvv2,
      pin: password,
    };

    return encrypt.encrypt(JSON.stringify(dto)) as string;
  }

  encryptCardNumber(certText: string, cardNumber: string): string {
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(certText);
    return encrypt.encrypt(cardNumber) as string;
  }

  // @ts-ignore
  async sendDynamicPass(ticket: string, amount: number, pan: string, expireDate: string, transactionType: number) {
    try {
      const response = await this.bankCardApiService.getDpgBankClientConfig().toPromise();
      const request: DynamicPasswordRequest = {
        certFile: response!.certFileName,
        amount,
        pan: this.getCardPanDto(response!.certFile, pan, expireDate),
        transactionType,
      };
      return this.bankCardApiService.requestDynamicPassword(request, ticket).toPromise();
    } catch (e: any) {
      if (!e || !e?.result?.message) {
        this.messageService.showErrorMessage('ارتباط برقرار نشد، لطفا تا لحظاتی دیگر مجددا تلاش کنید');
      } else {
        this.messageService.showErrorOfErrorResponse(e);
      }
    }
  }

  getCardPanDto(certText: string, pan: string, expireDate: string): CardPanDto {
    const cardNumber = removePanDashes(pan);
    const prefix = getCardPanPrefix(cardNumber);
    const postfix = getCardPanPostfix(cardNumber);
    return {
      value: this.encryptCardNumber(certText, cardNumber),
      type: +CardType.ENCRYPTED,
      expireDate,
      prefix,
      postfix,
    };
  }
}
