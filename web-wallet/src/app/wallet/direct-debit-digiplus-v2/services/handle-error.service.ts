import { Injectable } from '@angular/core';
import { ApiResult } from '../../../api/models/api-result';
import { MessageService } from '../../../core/services/message.service';
import { RedirectDataFactory } from '../utiles/redirect-form-data';
import { DirectDebitNavigationService } from './direct-debit-navigation.service';
import {GetProviderId} from "../../direct-debit-digiplus/utiles/digiplus-direct-debit-storage";

@Injectable()
export class HandleErrorService {

  constructor(
    private messageService: MessageService,
    private redirect: RedirectDataFactory,
    private directDebitNavigationService: DirectDebitNavigationService
  ) {
  }

  public handle(errorResponse: ApiResult, ticket?: string): void {
    if (errorResponse && errorResponse.status === 401) {
      this.authenticationError(ticket);
    } else if (errorResponse.error && errorResponse.error.result) {
      this.messageService.showErrorIfExists(errorResponse);
    } else {
      this.messageService.showErrorMessage('بروز خطا، لطفا مجددا تلاش کنید');
    }
  }

  private authenticationError(ticket: string): void {
    this.messageService.showErrorMessage('مهلت فعالسازی برداشت مستقیم شما به پایان رسیده است. میتوانید دوباره اقدام کنید.');
    const providerId: string = GetProviderId();
    const formData = this.redirect.unknownFormData(providerId);
    this.directDebitNavigationService.navigateToMerchant(formData, ticket).then();
  }
}
