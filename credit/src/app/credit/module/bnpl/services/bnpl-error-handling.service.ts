import { Injectable, signal } from '@angular/core';
import { BnplErrorConfig, bnplErrorHandlingConfig } from './bnpl-error-handling-config';
import { Router } from '@angular/router';

@Injectable()
export class BnplErrorHandlingService {
  cellNumber = signal('');
  nationalCode = signal('');

  constructor(
    private router: Router,
  ) {
  }

  setCellNumber(cellNumber: string): void {
    this.cellNumber.set(cellNumber);
  }

  setNationalCode(cellNumber: string): void {
    this.nationalCode.set(cellNumber);
  }

  transformErrorText(input: string): string {
    let output = input;
    output = output.replace(/\{\{cellNumber}}/g, this.cellNumber);
    output = output.replace(/\{\{nationalCode}}/g, this.nationalCode);
    return output;
  }

  getConfig(errorType: number): BnplErrorConfig {
    const output: BnplErrorConfig = {
      title: 'متاسفانه خطایی در عملیات به وجود آمده است.',
      description: '',
      image: '',
      buttons: [],
      hasTimer: false,
    };

    if (bnplErrorHandlingConfig[errorType]) {
      output.title = this.transformErrorText(bnplErrorHandlingConfig[errorType].title);
      output.description = this.transformErrorText(bnplErrorHandlingConfig[errorType].description);
      output.buttons = bnplErrorHandlingConfig[errorType].buttons;
      output.image = bnplErrorHandlingConfig[errorType].image;
      output.hasTimer = bnplErrorHandlingConfig[errorType].hasTimer;
    }
    return output;
  }

  backToMerchant(): void {
    this.router.navigate(['cancel']);
  }
}
