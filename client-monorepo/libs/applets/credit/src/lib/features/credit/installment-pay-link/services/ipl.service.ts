import { Injectable, signal } from '@angular/core';
import { IplErrorService } from '../ipl-errors/services/ipl-error.service';
import { IplErrorEnum } from '../ipl-errors/data-access/ipl-error';
import { CreditApiService } from '../../data-access/services/credit-api.service';
import { InstallmentPayLinkResponse } from '../../data-access/models/credit/installment-pay-link/installment-pay-link.response';
import { MessageService } from '../../data-access/services/message.service';
import { Router } from '@angular/router';
import { CreditUrlService } from '../../data-access/utils/url';

@Injectable()
export class IplService {
  #userInfo = signal<InstallmentPayLinkResponse | null>(null);
  #uuid = signal<string>('');
  #loading = signal<boolean>(false);
  #referer = signal<string>('');

  constructor(
    private creditApiService: CreditApiService,
    private iplErrorService: IplErrorService,
    private router: Router,
    private messageService: MessageService,
    private creditUrlService: CreditUrlService,
  ) {}

  get userInfo() {
    return this.#userInfo.asReadonly();
  }

  get uuid() {
    return this.#uuid.asReadonly();
  }

  get isLoading() {
    return this.#loading.asReadonly();
  }

  get referer() {
    return this.#referer.asReadonly();
  }

  setUuid(uuid: string | null) {
    if (uuid) {
      this.#uuid.set(uuid);
    } else {
      window.history.back();
    }
  }

  setLoading(loading: boolean) {
    this.#loading.set(loading);
  }

  setReferer(referer: string) {
    this.#referer.set(referer);
  }

  initUserInfo(userInfo: InstallmentPayLinkResponse): void {
    this.#userInfo.set(userInfo);
  }

  getInformation() {
    this.setLoading(true);
    this.creditApiService.getUserInfoForPayByLink(this.uuid(), this.referer()).subscribe({
      next: (res) => {
        this.initUserInfo(res);

        if (res.isCutOffTime) {
          return this.handleCutOff();
        }

        const iplDetailRoute = this.creditUrlService.getInnerServicePath(`/ipl/${this.uuid()}`);
        this.router.navigate([iplDetailRoute], { queryParamsHandling: 'preserve' }).then(() => {
          this.setLoading(false);
        });
      },
      error: (e) => {
        this.setLoading(false);
        this.messageService.showErrorOfErrorResponse(e);
        setTimeout(() => {
          window.history.back();
        }, 3000);
      },
    });
  }

  private handleCutOff() {
    this.iplErrorService.setErrorEnum(IplErrorEnum.CutOff);
    const iplErrorRoute = this.creditUrlService.getInnerServicePath(`/ipl/${this.uuid()}/error`);
    this.router.navigate([iplErrorRoute], { queryParamsHandling: 'preserve' }).then(() => {
      this.setLoading(false);
    });
  }
}
