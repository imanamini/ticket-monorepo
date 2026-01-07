import { inject, Injectable } from '@angular/core';
import { ApiResultInterface, ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import {
  DigiCardChangePasswordApiInput,
  DigiCardForgotPasswordApiInput,
  DigiCardSetPasswordApiInput,
} from '../models/digi-card-password.interface';

@Injectable()
export class PasswordApiService {
  private apiService = inject(ApiService);

  changePassword(entity: DigiCardChangePasswordApiInput) {
    return this.apiService.call<ApiResultInterface>(new RequestBuilder(RequestTypeEnum.POST, 'digicard/cards/change-plan', entity));
  }
  forgotPassword(entity: DigiCardForgotPasswordApiInput) {
    return this.apiService.call<ApiResultInterface>(
      new RequestBuilder(RequestTypeEnum.POST, 'digicard/cards/forget-pass', entity),
    );
  }
}
