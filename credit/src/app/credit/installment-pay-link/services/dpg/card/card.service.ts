import { Injectable } from '@angular/core';
import JSEncrypt from 'jsencrypt/bin/jsencrypt.min';
import { CardApiService } from './card-api.service';
import { Bank } from './models/bank.model';
import { CardType } from './models/card-type-enum';
import { CardPin } from './models/card-pin.model';
import { DpgCardPanDto, DpgDynamicPasswordRequest } from './models/dpg-card';
import { getCardPanPostfix, getCardPanPrefix, removePanDashes } from '../../../../../utils/card-helpers';
import { MessageService } from '../../../../core/services/message.service';
import { TokenService } from '../../token/token.service';

@Injectable()
export class CardService {

  private banks: Bank[];

  constructor(
    private cardApiService: CardApiService,
    private messageService: MessageService,
    private tokenService: TokenService,
  ) {
    this.getAllBanks().then();
  }

  getAllBanks(): Promise<Bank[]> {
    return new Promise((resolve, reject) => {
      if (this.banks) {
        return resolve(this.banks);
      }
      this.cardApiService.getAllBanks(this.tokenService.token()).subscribe(response => {
        this.banks = response.banks;
        resolve(response.banks);
      }, error => {
        reject(error);
      });
    });
  }

  async getBankOfCardNumber(pan: string): Promise<Bank | null> {
    const prefix = getCardPanPrefix(removePanDashes(pan));
    const banks = await this.getAllBanks();
    return banks.find(b => b.cardPrefixes.indexOf(prefix) >= 0);
  }

  encryptCvv2AndPass(certText, cvv2, password): string {
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(certText);
    const dto: CardPin = {
      cvv2,
      pin: password,
    };

    return encrypt.encrypt(JSON.stringify(dto));
  }

  encryptCardNumber(certText, cardNumber): string {
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(certText);
    return encrypt.encrypt(cardNumber);
  }

  async sendDynamicPass(
    ticket: string, amount: number, pan: string, expireDate: string, transactionType: number
  ) {
    try {
      const response = await this.cardApiService.getBankClientConfig(this.tokenService.token()).toPromise();
      const request: DpgDynamicPasswordRequest = {
        certFile: response.certFileName,
        amount,
        pan: this.getCardPanDto(response.certFile, pan, expireDate),
        transactionType,
      };
      return this.cardApiService.requestDynamicPassword(request, ticket).toPromise();
    } catch (e) {
      if (!e || !this.messageService.hasMessage(e)) {
        this.messageService.showErrorMessage('ارتباط برقرار نشد، لطفا تا لحظاتی دیگر مجددا تلاش کنید');
      } else {
        this.messageService.showErrorIfExists(e);
      }
    }
  }

  getCardPanDto(certText, pan, expireDate: string): DpgCardPanDto {
    const cardNumber = removePanDashes(pan);
    const prefix = getCardPanPrefix(cardNumber);
    const postfix = getCardPanPostfix(cardNumber);
    return {
      value: this.encryptCardNumber(certText, cardNumber),
      type: +CardType.ENCRYPTED,
      expireDate,
      prefix,
      postfix
    };
  }
}
