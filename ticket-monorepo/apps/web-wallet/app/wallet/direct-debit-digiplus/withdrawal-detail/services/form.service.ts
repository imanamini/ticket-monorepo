import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { invalidNationalCode } from '../../../direct-debit/direct-debit-contract/national-code-validation';
import { WalletApiService } from '../../../../api/wallet-api.service';
import { HandleErrorService } from '../../services/handle-error.service';
import { ApiResult } from '../../../../api/models/api-result';

@Injectable()
export class FormService {
  state: FormGroup;

  constructor(
    private walletApiService: WalletApiService,
    private handleErrorService: HandleErrorService) {
  }

  create(): void {
    this.state = new FormGroup({
      nationalCode: new FormControl('', [
        Validators.required,
        invalidNationalCode
      ])
    });
  }

  checkValidateNationalCode(ticket: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.walletApiService.directDebitContractValidation(
        Boolean(this.state.controls["nationalCode"].value)
          ? this.state.controls["nationalCode"].value
          : null,
        ticket
      )
        .subscribe(
          (response) => {
            resolve(response);
          },
          (error: ApiResult) => {
            this.handleErrorService.handle(error);
            reject(error);
          }
        );
    });
  }
}
